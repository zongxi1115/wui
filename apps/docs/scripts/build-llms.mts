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
 *   public/r/llms/examples.json  — example name -> { component, title, code }
 *   public/r/llms/overview.json  — library-level rules + theme tokens
 *   public/llms.txt              — the llms.txt convention, for non-MCP consumers
 *
 * Run with: pnpm --filter docs registry:build (after build-registry + build-docgen)
 */
import { promises as fs } from "node:fs"
import path from "node:path"

const ROOT = process.cwd() // apps/docs
const REGISTRY_JSON = path.join(ROOT, "registry.json")
const PROPS_JSON = path.join(ROOT, "registry", "__props__.json")
const OVERVIEW_MD = path.join(ROOT, "llms", "overview.md")
const MDX_DIR = path.join(ROOT, "content", "docs", "components")
const EXAMPLES_DIR = path.join(ROOT, "registry", "examples")
const OUT_DIR = path.join(ROOT, "public", "r", "llms")
const LLMS_TXT = path.join(ROOT, "public", "llms.txt")

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
interface PropMeta {
  name: string
  type: string
  required: boolean
  options?: string[]
  defaultValue?: string
  description?: string
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
 * preview/source/table tags are dropped entirely.
 */
function stripMdxComponents(body: string): string {
  return body
    .replace(
      /<(ComponentPreview|ComponentSource|CodeTabs|Playground|PropsTable)\b[\s\S]*?\/>/g,
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

/**
 * Pull one `## <heading>` section's body out of an MDX document. Split on the
 * heading rather than one regex with a lookahead — JS has no `\z`, and `$`
 * under /m means end-of-line, so a single-pass pattern truncates mid-section.
 */
function section(body: string, ...headings: string[]): string | undefined {
  const parts = body.split(/^##\s+(.+?)\s*$/m) // [pre, h1, body1, h2, body2, ...]
  for (const heading of headings) {
    for (let i = 1; i < parts.length; i += 2) {
      if (parts[i] !== heading) continue
      const text = stripMdxComponents(parts[i + 1] ?? "")
      // Sections that are only sub-headings wrapping previews carry no prose.
      const hasProse = text
        .split(/\r?\n/)
        .some((l) => l.trim() && !/^#{1,6}\s/.test(l.trim()))
      if (text && hasProse) return text
    }
  }
  return undefined
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
  const dir = TARGET_DIR[file.type] ?? TARGET_DIR[item.type]
  if (!dir) return undefined
  return `${dir}/${path.basename(file.path).replace(/\.[jt]sx?$/, "")}`
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
  const overviewMd = await fs.readFile(OVERVIEW_MD, "utf8")

  const site = (process.env.WUI_SITE_URL ?? registry.homepage ?? "").replace(
    /\/$/,
    ""
  )

  await fs.rm(OUT_DIR, { recursive: true, force: true })
  await fs.mkdir(OUT_DIR, { recursive: true })

  const exampleFiles = (await fs.readdir(EXAMPLES_DIR))
    .filter((f) => f.endsWith(".tsx"))
    .map((f) => f.replace(/\.tsx$/, ""))
    .sort()

  const discovery: unknown[] = []
  const exampleBank: Record<string, unknown> = {}
  const txtLines: string[] = []

  for (const item of registry.items) {
    // The theme item carries tokens, not a component API — handled separately.
    if (item.type === "registry:theme") continue

    const mdxPath = path.join(MDX_DIR, `${item.name}.mdx`)
    let front: Record<string, string> = {}
    let body = ""
    try {
      const parsed = splitFrontmatter(await fs.readFile(mdxPath, "utf8"))
      front = parsed.data
      body = parsed.body
    } catch {
      // lib items (utils) have no component page
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
      const code = await fs.readFile(
        path.join(EXAMPLES_DIR, `${name}.tsx`),
        "utf8"
      )
      exampleBank[name] = {
        name,
        component: item.name,
        ...(titles[name] ? { title: titles[name] } : {}),
        code: rewriteImports(code),
      }
      examples.push({ name, ...(titles[name] ? { title: titles[name] } : {}) })
    }

    const sourceFile = item.files[0]
    const { values, types } = sourceFile
      ? parseExports(
          await fs.readFile(path.join(ROOT, sourceFile.path), "utf8")
        )
      : { values: [], types: [] }
    const imp = importPath(item)

    const digest = {
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
        wui: `npx wui@latest add @wui/${item.name}`,
        shadcn: site
          ? `npx shadcn@latest add ${site}/r/${item.name}.json`
          : undefined,
        npmDependencies: item.dependencies ?? [],
        registryDependencies: item.registryDependencies ?? [],
      },
      props: props[item.name] ?? [],
      usage: section(body, "组件作用", "使用说明", "使用方式", "直接使用"),
      extended: section(body, "扩展使用", "拓展使用"),
      events: section(body, "事件"),
      examples,
      files: item.files.map((f) => f.path),
      docsUrl: site ? `${site}/docs/components/${item.name}` : undefined,
      sourceUrl: site ? `${site}/r/${item.name}.json` : undefined,
    }

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
      keyProps: (props[item.name] ?? [])
        .slice(0, 6)
        .map((p) =>
          p.options
            ? `${p.name}: ${p.options.join("|")}`
            : `${p.name}: ${p.type}`
        ),
      exampleCount: examples.length,
    })

    txtLines.push(
      site
        ? `- [${title}](${site}/docs/components/${item.name}): ${description}`
        : `- ${title} (${item.name}): ${description}`
    )
  }

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

  const llmsTxt = [
    `# ${registry.name}`,
    "",
    "> shadcn 风格的 React 组件库，组件源码按需复制进你的项目。React 19 · Tailwind CSS v4 · Radix · motion。",
    "",
    "## 组件",
    "",
    ...txtLines,
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
