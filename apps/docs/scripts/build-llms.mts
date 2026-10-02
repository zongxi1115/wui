/**
 * build-llms.mts
 * ------------------------------------------------------------------
 * Condenses the registry + docgen props + MDX prose + examples into
 * LLM-shaped digests. These are what the MCP server serves; they are
 * deliberately *not* the CLI's `public/r/<name>.json`, because those inline
 * the full component source (4–8k tokens) that a model asking "what variants
 * does Button have?" should not have to pay for.
 *
 * Emits:
 *   public/r/llms/index.json     — discovery list (name/title/description/props gist)
 *   public/r/llms/<name>.json    — per-component digest (props, usage, examples, install)
 *   public/r/llms/examples/index.json — example metadata without source
 *   public/r/llms/examples/<name>.json — one example's code
 *   public/r/llms/overview.json  — library-level rules + theme tokens
 *   public/llms.txt              — the llms.txt convention, for non-MCP consumers
 *
 * Run with: pnpm --filter docs registry:build (after build-registry + build-docgen)
 */
import { promises as fs } from "node:fs"
import path from "node:path"
import ts from "typescript"
import type {
  ComponentApi,
  ComponentDigest,
  ExampleEntry,
  ExampleIndex,
  IndexEntry,
  PropMeta,
  TypeDefinition,
} from "@wui-design/mcp/core"

const ROOT = process.cwd() // apps/docs
const REGISTRY_JSON = path.join(ROOT, "registry.json")
const PROPS_JSON = path.join(ROOT, "registry", "__props__.json")
const API_JSON = path.join(ROOT, "registry", "__api__.json")
const OVERVIEW_MD = path.join(ROOT, "llms", "overview.md")
const DOCS_DIR = path.join(ROOT, "content", "docs")
const EXAMPLES_DIR = path.join(ROOT, "registry", "examples")
const OUT_DIR = path.join(ROOT, "public", "r", "llms")
const LLMS_TXT = path.join(ROOT, "public", "llms.txt")

async function readText(file: string): Promise<string> {
  return (await fs.readFile(file, "utf8")).replace(/\r\n/g, "\n")
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface RegistryFile {
  path: string
  type: string
  target?: string
}
interface RegistryItem {
  name: string
  type: string
  title?: string
  description?: string
  dependencies?: string[]
  registryDependencies?: string[]
  files: RegistryFile[]
  cssVars?: Record<string, Record<string, string>>
  categories?: string[]
}

// ---------------------------------------------------------------------------
// MDX helpers
// ---------------------------------------------------------------------------
/** Strip frontmatter and return { data, body }. Only flat `key: value` pairs. */
function splitFrontmatter(raw: string): {
  data: Record<string, string>
  body: string
} {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(raw)
  if (!match) return { data: {}, body: raw }
  const data: Record<string, string> = {}
  for (const line of match[1].split(/\r?\n/)) {
    const kv = /^([A-Za-z_][\w-]*):\s*(.*)$/.exec(line)
    if (kv) data[kv[1]] = kv[2].trim().replace(/^["']|["']$/g, "")
  }
  return { data, body: raw.slice(match[0].length) }
}

/**
 * Remove the docs-site-only MDX components, leaving prose a model can read.
 * `<Callout>` and `<Steps>` wrappers keep their inner text; self-closing
 * preview/source tags are dropped. Literal PropsTable rows become Markdown.
 */
function stripMdxComponents(body: string): string {
  return body
    .replace(/<PropsTable\b[\s\S]*?\/>/g, renderPropsTable)
    .replace(
      /<(ComponentPreview|ComponentSource|CodeTabs|Playground)\b[\s\S]*?\/>/g,
      ""
    )
    .replace(/<PropsTable\b[\s\S]*?<\/PropsTable>/g, "")
    .replace(
      /<\/?(Callout|Steps|Step|Tabs|Tab|Accordions?|Files?|Folder)\b[^>]*>/g,
      ""
    )
    .replace(/\n{3,}/g, "\n\n")
    .trim()
}

/** Read only literal table data through the TS parser; never execute MDX. */
function renderPropsTable(tag: string): string {
  const source = ts.createSourceFile(
    "props.tsx",
    `const table = (${tag})`,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX
  )
  const rows: string[] = []
  function visit(node: ts.Node) {
    if (
      ts.isJsxAttribute(node) &&
      node.name.getText(source) === "data" &&
      node.initializer &&
      ts.isJsxExpression(node.initializer)
    ) {
      const value = node.initializer.expression
      if (value && ts.isArrayLiteralExpression(value)) {
        for (const element of value.elements) {
          if (!ts.isObjectLiteralExpression(element)) continue
          const fields: Record<string, string> = {}
          for (const property of element.properties) {
            if (!ts.isPropertyAssignment(property)) continue
            const value = property.initializer
            if (
              ts.isStringLiteral(value) ||
              ts.isNoSubstitutionTemplateLiteral(value)
            ) {
              fields[
                property.name.getText(source).replace(/^["']|["']$/g, "")
              ] = value.text
            }
          }
          if (fields.prop)
            rows.push(
              `- \`${fields.prop}\`${fields.type ? `: ${fields.type}` : ""}${fields.default ? `（默认：${fields.default}）` : ""}${fields.description ? ` — ${fields.description}` : ""}`
            )
        }
      }
    }
    ts.forEachChild(node, visit)
  }
  visit(source)
  return rows.join("\n")
}

/**
 * Pull matching `## <heading>` sections out of an MDX document. Split on the
 * heading rather than one regex with a lookahead — JS has no `\z`, and `$`
 * under /m means end-of-line, so a single-pass pattern truncates mid-section.
 */
function section(body: string, ...headings: string[]): string | undefined {
  const parts = body.split(/^##\s+(.+?)\s*$/m) // [pre, h1, body1, h2, body2, ...]
  const normalize = (heading: string) =>
    heading.replace(/\s+(?:[·|｜]\s*)?[A-Za-z].*$/, "").trim()
  const matches: Array<{ heading: string; text: string }> = []
  for (const heading of headings) {
    for (let i = 1; i < parts.length; i += 2) {
      if (normalize(parts[i]) !== normalize(heading)) continue
      if (matches.some((m) => m.heading === parts[i])) continue
      const text = stripMdxComponents(parts[i + 1] ?? "")
      // Sections that are only sub-headings wrapping previews carry no prose.
      const hasProse = text
        .split(/\r?\n/)
        .some((l) => l.trim() && !/^#{1,6}\s/.test(l.trim()))
      if (text && hasProse) matches.push({ heading: parts[i], text })
    }
  }
  if (!matches.length) return undefined
  return matches.length === 1
    ? matches[0].text
    : matches.map((m) => `### ${m.heading}\n\n${m.text}`).join("\n\n")
}

/**
 * Map example name -> the nearest preceding `###`/`##` heading, so examples get
 * a human label ("变体", "尺寸") instead of just a slug.
 */
function exampleTitles(body: string): Record<string, string> {
  const out: Record<string, string> = {}
  let heading = ""
  for (const line of body.split(/\r?\n/)) {
    const h = /^#{2,4}\s+(.+?)\s*$/.exec(line)
    if (h) {
      heading = h[1]
      continue
    }
    const p = /<ComponentPreview\s+name=["']([^"']+)["']/.exec(line)
    if (p) out[p[1]] = heading
  }
  return out
}

// ---------------------------------------------------------------------------
// Source helpers
// ---------------------------------------------------------------------------
/**
 * Collect the public export names of a component file, separating types from
 * values — a type in an `import { ... }` hint would be wrong to copy.
 */
function parseExports(source: string): { values: string[]; types: string[] } {
  const values = new Set<string>()
  const types = new Set<string>()
  for (const m of source.matchAll(
    /^export\s+(?:default\s+)?(?:async\s+)?(const|let|function|class|type|interface)\s+([A-Za-z_$][\w$]*)/gm
  )) {
    ;(m[1] === "type" || m[1] === "interface" ? types : values).add(m[2])
  }
  for (const m of source.matchAll(/^export\s+(type\s+)?\{([^}]+)\}/gm)) {
    const allTypes = Boolean(m[1])
    for (const part of m[2].split(",")) {
      const raw = part.trim()
      if (!raw) continue
      const isType = allTypes || /^type\s/.test(raw)
      const name = raw
        .replace(/^type\s+/, "")
        .split(/\s+as\s+/)
        .pop()
        ?.trim()
      if (name && name !== "default") (isType ? types : values).add(name)
    }
  }
  return { values: [...values].sort(), types: [...types].sort() }
}

/**
 * Examples live in the docs app and import via `@/registry/...`, which does not
 * exist in a consumer project. Rewrite to the aliases `wui init` writes, so a
 * model can copy example code verbatim. Mirrors packages/cli transformImports;
 * order matters — the most specific prefix must win.
 */
const IMPORT_REWRITES: Array<[string, string]> = [
  ["@/registry/lib/utils", "@/lib/utils"],
  ["@/registry/ui/", "@/components/ui/"],
  ["@/registry/charts/", "@/components/charts/"],
  ["@/registry/hooks/", "@/hooks/"],
  ["@/registry/components/", "@/components/"],
  ["@/registry/lib/", "@/lib/"],
]

function rewriteImports(code: string): string {
  let out = code
  for (const [from, to] of IMPORT_REWRITES) out = out.split(from).join(to)
  return out
}

const TARGET_DIR: Record<string, string> = {
  "registry:ui": "@/components/ui",
  "registry:component": "@/components",
  "registry:lib": "@/lib",
  "registry:hook": "@/hooks",
}

/** The import path the component lands on in a consumer project. */
function importPath(item: RegistryItem): string | undefined {
  const file = item.files[0]
  if (!file) return undefined
  if (file.target?.startsWith("@components/")) {
    return `@/components/${file.target.slice(12).replace(/\.[jt]sx?$/, "")}`
  }
  const dir = TARGET_DIR[file.type] ?? TARGET_DIR[item.type]
  if (!dir) return undefined
  return `${dir}/${path.basename(file.path).replace(/\.[jt]sx?$/, "")}`
}

function docsSection(item: RegistryItem): "charts" | "components" | "hooks" {
  if (item.categories?.includes("charts")) return "charts"
  return item.type === "registry:hook" ? "hooks" : "components"
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  const registry = JSON.parse(await fs.readFile(REGISTRY_JSON, "utf8")) as {
    name: string
    homepage?: string
    items: RegistryItem[]
  }
  const props = JSON.parse(await fs.readFile(PROPS_JSON, "utf8")) as Record<
    string,
    PropMeta[]
  >
  const apis = JSON.parse(await fs.readFile(API_JSON, "utf8")) as Record<
    string,
    { api: ComponentApi[]; types: TypeDefinition[] }
  >
  const overviewMd = await readText(OVERVIEW_MD)

  const site = (process.env.WUI_SITE_URL ?? registry.homepage ?? "").replace(
    /\/$/,
    ""
  )

  // Validate the deletion target before clearing generated artifacts.
  if (path.resolve(OUT_DIR) !== path.resolve(ROOT, "public/r/llms"))
    throw new Error("Unexpected digest output directory")
  await fs.rm(OUT_DIR, { recursive: true, force: true })
  await fs.mkdir(OUT_DIR, { recursive: true })
  await fs.mkdir(path.join(OUT_DIR, "examples"), { recursive: true })

  const exampleFiles = (await fs.readdir(EXAMPLES_DIR))
    .filter((f) => f.endsWith(".tsx"))
    .map((f) => f.replace(/\.tsx$/, ""))
    .sort()

  const discovery: IndexEntry[] = []
  const exampleBank: Record<string, ExampleEntry> = {}
  const exampleIndex: ExampleIndex = {}
  const missingUsage: string[] = []
  const componentTxtLines: string[] = []
  const chartTxtLines: string[] = []

  for (const item of registry.items) {
    // The theme item carries tokens, not a component API — handled separately.
    if (item.type === "registry:theme") continue

    const sectionName = docsSection(item)
    const mdxPath = path.join(DOCS_DIR, sectionName, `${item.name}.mdx`)
    let front: Record<string, string> = {}
    let body = ""
    try {
      const parsed = splitFrontmatter(await readText(mdxPath))
      front = parsed.data
      body = parsed.body
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error
      // Internal lib items have no component page.
    }

    const title = front.title ?? item.title ?? item.name
    const description = front.description ?? item.description ?? ""

    // Examples: those the docs page embeds, plus any `<name>-*` file not yet listed.
    const titles = exampleTitles(body)
    const embedded = Object.keys(titles)
    const byPrefix = exampleFiles.filter(
      (f) => f === item.name || f.startsWith(`${item.name}-`)
    )
    const exampleNames = [...new Set([...embedded, ...byPrefix])].filter((n) =>
      exampleFiles.includes(n)
    )

    const examples: Array<{ name: string; title?: string }> = []
    for (const name of exampleNames) {
      const code = await readText(path.join(EXAMPLES_DIR, `${name}.tsx`))
      exampleBank[name] = {
        name,
        component: item.name,
        ...(titles[name] ? { title: titles[name] } : {}),
        code: rewriteImports(code),
      }
      exampleIndex[name] = {
        name,
        component: item.name,
        ...(titles[name] ? { title: titles[name] } : {}),
      }
      examples.push({ name, ...(titles[name] ? { title: titles[name] } : {}) })
    }

    const sourceFile = item.files[0]
    const { values, types } = sourceFile
      ? parseExports(await readText(path.join(ROOT, sourceFile.path)))
      : { values: [], types: [] }
    const imp = importPath(item)
    const api = apis[item.name]?.api ?? []
    const primaryProps =
      api.find(
        (part) => part.name.toLowerCase() === item.name.replace(/-/g, "")
      )?.props ??
      props[item.name] ??
      []

    const digest: ComponentDigest = {
      name: item.name,
      type: item.type,
      title,
      description,
      ...(item.categories?.length ? { categories: item.categories } : {}),
      import:
        imp && values.length
          ? `import { ${values.join(", ")} } from "${imp}"`
          : undefined,
      exports: values,
      ...(types.length ? { typeExports: types } : {}),
      install: {
        wui: `pnpm dlx @wui-design/cli@latest add @wui/${item.name}`,
        shadcn: site
          ? `pnpm dlx shadcn@latest add ${site}/r/${item.name}.json`
          : undefined,
        npmDependencies: item.dependencies ?? [],
        registryDependencies: item.registryDependencies ?? [],
      },
      props: primaryProps,
      api,
      types: apis[item.name]?.types ?? [],
      usage: section(
        body,
        "使用场景与设计规范",
        "使用场景",
        "使用建议",
        "组件作用",
        "使用说明",
        "使用方式",
        "直接使用",
        "协议定位"
      ),
      extended: section(
        body,
        "场景示例",
        "扩展使用",
        "拓展使用",
        "扩展用法",
        "组合结构",
        "精简组合",
        "请求接口"
      ),
      events: section(body, "事件 Events", "事件"),
      accessibility: section(
        body,
        "无障碍与交互",
        "交互与无障碍",
        "无障碍",
        "键盘操作"
      ),
      examples,
      files: item.files.map((f) => f.path),
      docsUrl: site ? `${site}/docs/${sectionName}/${item.name}` : undefined,
      sourceUrl: site ? `${site}/r/${item.name}.json` : undefined,
    }
    if (body && !digest.usage) missingUsage.push(item.name)

    await fs.writeFile(
      path.join(OUT_DIR, `${item.name}.json`),
      JSON.stringify(digest, null, 2) + "\n",
      "utf8"
    )

    discovery.push({
      name: item.name,
      type: item.type,
      title,
      description,
      ...(item.categories?.length ? { categories: item.categories } : {}),
      // A props gist lets a model shortlist candidates without a second call.
      keyProps: primaryProps
        .filter(
          (p) =>
            !["children", "dir", "name", "autoComplete", "form"].includes(
              p.name
            )
        )
        .slice(0, 6)
        .map((p) =>
          p.options
            ? `${p.name}: ${p.options.join("|")}`
            : `${p.name}: ${p.type}`
        ),
      exampleCount: examples.length,
    })

    const txtLine = site
      ? `- [${title}](${site}/docs/${sectionName}/${item.name}): ${description}`
      : `- ${title} (${item.name}): ${description}`
    if (sectionName === "charts") chartTxtLines.push(txtLine)
    else componentTxtLines.push(txtLine)
  }
  if (missingUsage.length)
    throw new Error(`Missing usage section: ${missingUsage.join(", ")}`)

  // --- Overview: authored rules + the live token list ------------------------
  const theme = registry.items.find((i) => i.type === "registry:theme")
  const tokens = theme?.cssVars ?? {}
  await fs.writeFile(
    path.join(OUT_DIR, "overview.json"),
    JSON.stringify(
      {
        name: registry.name,
        homepage: site || undefined,
        instructions: overviewMd,
        componentCount: discovery.length,
        tokens,
      },
      null,
      2
    ) + "\n",
    "utf8"
  )

  await fs.writeFile(
    path.join(OUT_DIR, "index.json"),
    JSON.stringify(
      { name: registry.name, homepage: site || undefined, items: discovery },
      null,
      2
    ) + "\n",
    "utf8"
  )
  await fs.writeFile(
    path.join(OUT_DIR, "examples.json"),
    JSON.stringify(exampleBank, null, 2) + "\n",
    "utf8"
  )
  // Retain the existing bank for already-published stdio clients. New clients
  // fetch a small index and only the requested example.
  await fs.writeFile(
    path.join(OUT_DIR, "examples", "index.json"),
    JSON.stringify(exampleIndex, null, 2) + "\n",
    "utf8"
  )
  for (const [name, entry] of Object.entries(exampleBank)) {
    await fs.writeFile(
      path.join(OUT_DIR, "examples", `${name}.json`),
      JSON.stringify(entry, null, 2) + "\n",
      "utf8"
    )
  }

  const llmsTxt = [
    `# ${registry.name}`,
    "",
    "> shadcn 风格的 React 组件库，组件源码按需复制进你的项目。React 19 · Tailwind CSS v4 · Radix · motion。",
    "",
    "## 组件",
    "",
    ...componentTxtLines,
    "",
    "## 图表",
    "",
    ...chartTxtLines,
    "",
    "## 说明",
    "",
    overviewMd.split(/\r?\n/).slice(1).join("\n").trim(),
    "",
  ].join("\n")
  await fs.writeFile(LLMS_TXT, llmsTxt, "utf8")

  console.log(
    `✓ llms digests: ${discovery.length} components, ${Object.keys(exampleBank).length} examples`
  )
  console.log(`  → public/r/llms/*.json`)
  console.log(`  → public/llms.txt`)
}

main().catch((err) => {
  console.error("✗ llms build failed:\n", err)
  process.exit(1)
})
