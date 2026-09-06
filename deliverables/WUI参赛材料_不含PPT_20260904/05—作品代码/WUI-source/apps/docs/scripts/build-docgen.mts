/**
 * build-docgen.mts — parse component props from TypeScript types + TSDoc.
 *
 * Emits:
 *   registry/__props__.ts       — name -> PropMeta[] (type, default, description,
 *                                  and a derived control kind + enum options),
 *                                  consumed by <PropsTable> and <Playground>.
 *   registry/__props__.json      — the same map as plain data, consumed by
 *                                  scripts/build-llms.mts (no TS parsing needed).
 *   registry/__playground__.tsx  — name -> component, for the live playground.
 *
 * Uses react-docgen-typescript, filtering out inherited DOM props so only the
 * component's own (documented) props surface.
 */
import { promises as fs } from "node:fs"
import path from "node:path"
import * as docgen from "react-docgen-typescript"
import { getPropDescription } from "../lib/prop-descriptions"

const ROOT = process.cwd() // apps/docs
const REGISTRY_JSON = path.join(ROOT, "registry.json")
const PROPS_FILE = path.join(ROOT, "registry", "__props__.ts")
const PROPS_JSON_FILE = path.join(ROOT, "registry", "__props__.json")
const PLAYGROUND_FILE = path.join(ROOT, "registry", "__playground__.tsx")

// Components exposed in the interactive playground (must render standalone).
const PLAYGROUND: Array<{ name: string; file: string; export: string }> = [
  { name: "button", file: "registry/ui/button.tsx", export: "Button" },
]

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

const parser = docgen.withCustomConfig(path.join(ROOT, "tsconfig.json"), {
  savePropValueAsString: true,
  shouldExtractLiteralValuesFromEnum: true,
  shouldRemoveUndefinedFromOptional: true,
  propFilter: (prop) => {
    if (prop.name === "disabled") return true // keep this useful native prop
    // Hard-drop anything whose declaration lives in a dependency.
    if (prop.parent?.fileName.includes("node_modules")) return false
    const documented = (prop.description ?? "").trim().length > 0
    // Drop undocumented DOM/aria/event noise (mis-attributed inherited props).
    if (!documented && (DOMISH.test(prop.name) || DOM_GLOBALS.has(prop.name))) {
      return false
    }
    return true
  },
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
  return { control: "text", type: t.name }
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

  const files = items.map((item) => path.join(ROOT, item.files[0].path))
  const docsByFile = new Map<string, docgen.ComponentDoc[]>()
  for (const doc of parser.parse(files)) {
    const file = path.resolve(doc.filePath)
    const docs = docsByFile.get(file) ?? []
    docs.push(doc)
    docsByFile.set(file, docs)
  }

  const propsMap: Record<string, unknown[]> = {}
  const descriptionIssues: string[] = []
  for (const [index, item] of items.entries()) {
    const docs = docsByFile.get(path.resolve(files[index])) ?? []
    if (docs.length === 0) continue

    const exportName = pascalCase(item.name)
    const doc = docs.find((d) => d.displayName === exportName) ?? docs[0]
    const props = Object.values(doc.props).map((prop) => {
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

  const imports = PLAYGROUND.map(
    (p) => `import { ${p.export} } from "@/${p.file.replace(/\.tsx?$/, "")}"`
  ).join("\n")
  const entries = PLAYGROUND.map((p) => `  "${p.name}": ${p.export},`).join(
    "\n"
  )
  const playgroundContent =
    banner +
    `import type * as React from "react"\n${imports}\n\n` +
    `// eslint-disable-next-line @typescript-eslint/no-explicit-any\n` +
    `export const Playgrounds: Record<string, React.ComponentType<any>> = {\n${entries}\n}\n`
  await writeFileIfChanged(PLAYGROUND_FILE, playgroundContent)

  console.log(
    `✓ docgen: props for ${Object.keys(propsMap).length} component(s), ${PLAYGROUND.length} playground entry(ies)`
  )
}

main().catch((err) => {
  console.error("✗ docgen failed:\n", err)
  process.exit(1)
})
