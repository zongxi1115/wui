/**
 * build-docgen.mts — parse component props from TypeScript types + TSDoc.
 *
 * Emits:
 *   registry/__props__.ts       — name -> PropMeta[] (type, default, description,
 *                                  and a derived control kind + enum options),
 *                                  consumed by <PropsTable> and <Playground>.
 *   registry/__props__.json      — the same map as plain data, consumed by
 *                                  scripts/build-llms.mts (no TS parsing needed).
 *   registry/__api__.json        — every component export's API, including
 *                                  Radix behavior props and related data types.
 *   registry/__playground__.tsx  — name -> component, for the live playground.
 *
 * Uses one TypeScript program for docgen and referenced-type extraction.
 * Playground props stay compact; MCP preserves composite component APIs.
 */
import { promises as fs } from "node:fs"
import path from "node:path"
import * as docgen from "react-docgen-typescript"
import ts from "typescript"
import type {
  ComponentApi,
  PropMeta,
  TypeDefinition,
} from "@wui-design/mcp/core"
import { getPropDescription } from "../lib/prop-descriptions"
import { standalonePlaygroundConfigs } from "../lib/playground-standalone"
import { buildDemoPlaygrounds } from "./build-playgrounds.mts"

const ROOT = process.cwd() // apps/docs
const REGISTRY_JSON = path.join(ROOT, "registry.json")
const PROPS_FILE = path.join(ROOT, "registry", "__props__.ts")
const PROPS_JSON_FILE = path.join(ROOT, "registry", "__props__.json")
const API_JSON_FILE = path.join(ROOT, "registry", "__api__.json")

async function writeFileIfChanged(file: string, content: string) {
  try {
    if ((await fs.readFile(file, "utf8")) === content) return
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error
  }

  await fs.writeFile(file, content, "utf8")
}

function pascalCase(name: string): string {
  return name
    .split(/[-_]/)
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join("")
}

// Standard DOM/HTML global attributes. When a documented interface extends a
// mapped type (e.g. `Omit<HTMLMotionProps<...>>`), react-docgen can mis-attribute
// these inherited props to our own file, so we also filter them out by name —
// but only when they carry no docstring, so a real prop that happens to share a
// name (e.g. ConfirmDialog's documented `title`) is preserved.
const DOMISH = /^(aria-|data-|on[A-Z])/
const DOM_GLOBALS = new Set([
  "color",
  "content",
  "translate",
  "slot",
  "title",
  "ref",
  "key",
  "style",
  "children",
  "className",
  "id",
  "role",
  "tabIndex",
  "dir",
  "lang",
  "hidden",
  "draggable",
  "spellCheck",
  "accessKey",
  "autoCapitalize",
  "autoCorrect",
  "autoSave",
  "autoFocus",
  "contentEditable",
  "contextMenu",
  "enterKeyHint",
  "nonce",
  "inputMode",
  "is",
  "itemProp",
  "itemScope",
  "itemType",
  "itemID",
  "itemRef",
  "results",
  "security",
  "unselectable",
  "popover",
  "popoverTarget",
  "popoverTargetAction",
  "inert",
  "exportparts",
  "part",
  "radioGroup",
  "about",
  "datatype",
  "inlist",
  "prefix",
  "property",
  "rel",
  "resource",
  "rev",
  "typeof",
  "vocab",
  "defaultChecked",
  "defaultValue",
  "suppressContentEditableWarning",
  "suppressHydrationWarning",
  "dangerouslySetInnerHTML",
  // Native <button>/<form> attributes. `motion.button` types (HTMLMotionProps)
  // re-declare these on the local interface, so react-docgen mis-attributes
  // them to our file instead of node_modules — filter by name (undocumented
  // only, so a real documented prop of the same name still surfaces).
  "form",
  "formAction",
  "formEncType",
  "formMethod",
  "formNoValidate",
  "formTarget",
  "name",
  "type",
  "value",
])

function playgroundProp(prop: docgen.PropItem): boolean {
  if (prop.name === "disabled") return true
  if (prop.parent?.fileName.includes("node_modules")) return false
  const documented = (prop.description ?? "").trim().length > 0
  return documented || !(DOMISH.test(prop.name) || DOM_GLOBALS.has(prop.name))
}

function apiProp(prop: docgen.PropItem): boolean {
  const declarations = prop.declarations ?? (prop.parent ? [prop.parent] : [])
  // Radix behavior props are API, even when inherited and undocumented.
  if (
    declarations.some((d) => /[/\\](@radix-ui|radix-ui)[/\\]/.test(d.fileName))
  )
    return true
  if (prop.required) return true
  // Locally declared callbacks are not necessarily DOM event handlers.
  if (
    /^on[A-Z]/.test(prop.name) &&
    !/EventHandler</.test(prop.type.name) &&
    declarations.some((d) => !d.fileName.includes("node_modules"))
  )
    return true
  return playgroundProp(prop)
}

const parser = docgen.withCustomConfig(path.join(ROOT, "tsconfig.json"), {
  savePropValueAsString: true,
  shouldExtractLiteralValuesFromEnum: true,
  shouldRemoveUndefinedFromOptional: true,
  skipChildrenPropWithoutDoc: false,
  componentNameResolver: (symbol) => symbol.getName(),
  // Keep raw metadata; the playground and MCP have different API needs.
  propFilter: () => true,
})

type Control = "select" | "boolean" | "text" | "number"

function deriveControl(prop: docgen.PropItem): {
  control: Control
  type: string
  options?: string[]
} {
  const t = prop.type
  if (t.name === "boolean") return { control: "boolean", type: "boolean" }
  if (t.name === "number") return { control: "number", type: "number" }
  if (t.name === "string") return { control: "text", type: "string" }
  if (t.name === "enum" && Array.isArray(t.value)) {
    const raw = t.value
      .map((v) => String((v as { value: string }).value))
      .filter((v) => v !== "undefined")
    if (raw.every((v) => v === "true" || v === "false")) {
      return { control: "boolean", type: "boolean" }
    }
    const isStringLiteral = raw.every((v) => /^['"].*['"]$/.test(v))
    if (isStringLiteral) {
      return {
        control: "select",
        type: raw.join(" | "),
        options: raw.map((v) => v.replace(/^['"]|['"]$/g, "")),
      }
    }
  }
  return {
    control: "text",
    type: t.name === "enum" ? (t.raw ?? t.name) : t.name,
  }
}

function apiMeta(itemName: string, prop: docgen.PropItem): PropMeta {
  const derived = deriveControl(prop)
  const description = getPropDescription(itemName, prop.name, prop.description)
  const defaultValue = prop.defaultValue?.value
  return {
    name: prop.name,
    type: derived.type,
    required: Boolean(prop.required),
    ...(derived.options ? { options: derived.options } : {}),
    ...(defaultValue != null ? { defaultValue: String(defaultValue) } : {}),
    ...(description ? { description } : {}),
  }
}

/** Resolve locally owned data types referenced by props, including imports. */
function referencedTypes(
  program: ts.Program,
  file: ts.SourceFile,
  api: ComponentApi[]
): TypeDefinition[] {
  const checker = program.getTypeChecker()
  const result = new Map<ts.Symbol, TypeDefinition>()
  const registryDir = path.join(ROOT, "registry") + path.sep
  function visitSymbol(symbol: ts.Symbol) {
    if (symbol.flags & ts.SymbolFlags.Alias)
      symbol = checker.getAliasedSymbol(symbol)
    if (result.has(symbol)) return
    const declarations = (symbol.declarations ?? []).filter(
      (d) =>
        (ts.isInterfaceDeclaration(d) || ts.isTypeAliasDeclaration(d)) &&
        path.resolve(d.getSourceFile().fileName).startsWith(registryDir)
    )
    if (!declarations.length) return
    result.set(symbol, {
      name: symbol.name,
      definition: declarations.map((d) => d.getText()).join("\n"),
    })
    function visit(node: ts.Node) {
      if (ts.isTypeReferenceNode(node)) {
        const target = checker.getSymbolAtLocation(node.typeName)
        if (target) visitSymbol(target)
      }
      if (ts.isExpressionWithTypeArguments(node)) {
        const target = checker.getSymbolAtLocation(node.expression)
        if (target) visitSymbol(target)
      }
      ts.forEachChild(node, visit)
    }
    declarations.forEach((d) => ts.forEachChild(d, visit))
  }
  const names = new Set(
    api.flatMap((part) =>
      part.props.flatMap((p) => p.type.match(/[A-Za-z_$][\w$]*/g) ?? [])
    )
  )
  for (const symbol of checker.getSymbolsInScope(
    file,
    ts.SymbolFlags.Type | ts.SymbolFlags.Alias
  )) {
    if (names.has(symbol.name)) visitSymbol(symbol)
  }
  return [...result.values()]
}

async function main() {
  const registry = JSON.parse(await fs.readFile(REGISTRY_JSON, "utf8"))
  const items = (
    registry.items as Array<{
      name: string
      type: string
      files: Array<{ path: string }>
    }>
  ).filter(
    (item) =>
      item.files.length > 0 &&
      (item.type === "registry:ui" || item.type === "registry:component")
  )

  const playgroundItems = [...items]
  for (const folder of ["components", "charts"]) {
    for (const file of (
      await fs.readdir(path.join(ROOT, "content/docs", folder))
    ).filter((file) => file.endsWith(".mdx"))) {
      const mdx = await fs.readFile(
        path.join(ROOT, "content/docs", folder, file),
        "utf8"
      )
      const name = /^component:\s*(.+)$/m.exec(mdx)?.[1].trim()
      if (name && !playgroundItems.some((item) => item.name === name)) {
        playgroundItems.push({
          name,
          type: "registry:ui",
          files: [
            {
              path: `registry/${folder === "charts" ? "charts" : "ui"}/${name}.tsx`,
            },
          ],
        })
      }
    }
  }
  const files = playgroundItems.map((item) =>
    path.join(ROOT, item.files[0].path)
  )
  const configPath = path.join(ROOT, "tsconfig.json")
  const config = ts.readConfigFile(configPath, ts.sys.readFile)
  if (config.error)
    throw new Error(
      ts.flattenDiagnosticMessageText(config.error.messageText, "\n")
    )
  const parsedConfig = ts.parseJsonConfigFileContent(
    config.config,
    ts.sys,
    ROOT
  )
  const program = ts.createProgram(files, parsedConfig.options)
  const docsByFile = new Map<string, docgen.ComponentDoc[]>()
  for (const doc of parser.parseWithProgramProvider(files, () => program)) {
    const file = path.resolve(doc.filePath)
    const docs = docsByFile.get(file) ?? []
    docs.push(doc)
    docsByFile.set(file, docs)
  }

  const propsMap: Record<string, unknown[]> = {}
  const apiMap: Record<
    string,
    { api: ComponentApi[]; types: TypeDefinition[] }
  > = {}
  const descriptionIssues: string[] = []
  for (const [index, item] of items.entries()) {
    const docs = docsByFile.get(path.resolve(files[index])) ?? []
    if (docs.length === 0) continue

    const exportName = pascalCase(item.name)
    const doc = docs.find((d) => d.displayName === exportName) ?? docs[0]
    // docgen also treats utility functions as components (e.g. parseColorValue
    // gets every String method as a prop). JSX component exports are capitalized.
    const api = docs
      .filter((part) => /^[A-Z]/.test(part.displayName))
      .map((part) => ({
        name: part.displayName,
        props: Object.values(part.props)
          .filter(apiProp)
          .map((prop) => apiMeta(item.name, prop)),
      }))
    apiMap[item.name] = {
      api,
      types: referencedTypes(
        program,
        program.getSourceFile(files[index])!,
        api
      ),
    }
    const props = Object.values(doc.props)
      .filter(playgroundProp)
      .map((prop) => {
        const derived = deriveControl(prop)
        const meta: Record<string, unknown> = {
          name: prop.name,
          type: derived.type,
          required: Boolean(prop.required),
          control: derived.control,
        }
        if (derived.options) meta.options = derived.options
        const dv = prop.defaultValue?.value
        if (dv != null && String(dv) !== "") meta.defaultValue = String(dv)
        const desc = getPropDescription(item.name, prop.name, prop.description)
        if (desc) meta.description = desc
        if (!desc || !/\p{Script=Han}/u.test(desc)) {
          descriptionIssues.push(`${item.name}.${prop.name}`)
        }
        return meta
      })
    propsMap[item.name] = props
  }

  if (descriptionIssues.length > 0) {
    throw new Error(
      `Missing Chinese prop descriptions: ${descriptionIssues.join(", ")}`
    )
  }

  const banner = `// AUTO-GENERATED by scripts/build-docgen.mts — do not edit by hand.\n`

  const propsContent =
    banner +
    `export type PropControl = "select" | "boolean" | "text" | "number"\n` +
    `export interface PropMeta {\n` +
    `  name: string\n` +
    `  type: string\n` +
    `  required: boolean\n` +
    `  control: PropControl\n` +
    `  options?: string[]\n` +
    `  defaultValue?: string\n` +
    `  description?: string\n` +
    `}\n\n` +
    `export const Props: Record<string, PropMeta[]> = ${JSON.stringify(propsMap, null, 2)}\n`
  await writeFileIfChanged(PROPS_FILE, propsContent)
  await writeFileIfChanged(
    PROPS_JSON_FILE,
    JSON.stringify(propsMap, null, 2) + "\n"
  )
  await writeFileIfChanged(
    API_JSON_FILE,
    JSON.stringify(apiMap, null, 2) + "\n"
  )

  const playgroundCount = await buildDemoPlaygrounds(
    docsByFile,
    playgroundItems,
    standalonePlaygroundConfigs
  )

  console.log(
    `✓ docgen: props for ${Object.keys(propsMap).length} component(s), ${playgroundCount} playground entry(ies)`
  )
}

main().catch((err) => {
  console.error("✗ docgen failed:\n", err)
  process.exit(1)
})
