import { promises as fs } from "node:fs"
import path from "node:path"

import type { Config, RegistryItem } from "./schema"

const TOKEN_BLOCK_START = "/* wui:tokens:start */"
const TOKEN_BLOCK_END = "/* wui:tokens:end */"
const CSS_VAR_GROUPS = ["light", "dark", "theme"] as const

type CssVarGroup = (typeof CSS_VAR_GROUPS)[number]
type CssVarMap = Record<CssVarGroup, Record<string, string>>

export interface ApplyRegistryCssVarsOptions {
  dryRun?: boolean
  onLog?: (message: string) => void
}

/** Merge registry token contributions in dependency order; later items win. */
export function mergeRegistryCssVars(items: RegistryItem[]): CssVarMap {
  const merged: CssVarMap = { light: {}, dark: {}, theme: {} }

  for (const item of items) {
    for (const [group, variables] of Object.entries(item.cssVars ?? {})) {
      if (!CSS_VAR_GROUPS.includes(group as CssVarGroup)) {
        throw new Error(
          `${item.name}: unsupported cssVars group "${group}". Use light, dark, or theme.`
        )
      }
      Object.assign(merged[group as CssVarGroup], variables)
    }
  }

  return merged
}

// Tailwind v4 resolves bare `border`/`outline` utilities to `currentColor`
// instead of a neutral grey, so any component that relies on a plain `border`
// would render a near-black edge. This canonical base reset maps those bare
// utilities back to the theme tokens (matching shadcn's default globals.css),
// which is what keeps unstyled borders subtle across every component.
const BASE_LAYER = [
  "@layer base {",
  "  * {",
  "    @apply border-border outline-ring/50;",
  "  }",
  "  body {",
  "    @apply bg-background text-foreground;",
  "  }",
  "}",
].join("\n")

export function renderRegistryCssVars(cssVars: CssVarMap): string {
  const parts = [
    TOKEN_BLOCK_START,
    "@custom-variant dark (&:is(.dark *));",
    "",
    renderRule(":root", cssVars.light),
    "",
    renderRule(".dark", cssVars.dark),
    "",
    renderRule("@theme inline", cssVars.theme),
  ]
  // Only emit the reset when the theme registers the color mappings it applies;
  // a partial theme without them would otherwise fail to compile.
  if (cssVars.theme["color-border"]) {
    parts.push("", BASE_LAYER)
  }
  parts.push(TOKEN_BLOCK_END)
  return parts.join("\n")
}

export function upsertRegistryCssVars(content: string, block: string): string {
  const start = content.indexOf(TOKEN_BLOCK_START)
  const end = content.indexOf(TOKEN_BLOCK_END)

  if (start >= 0 || end >= 0) {
    if (start < 0 || end < start) {
      throw new Error("Invalid wui token markers in the configured Tailwind CSS file.")
    }
    const afterEnd = end + TOKEN_BLOCK_END.length
    return `${content.slice(0, start)}${block}${content.slice(afterEnd)}`
  }

  const prefix = content.trimEnd()
  return `${prefix}${prefix ? "\n\n" : ""}${block}\n`
}

export async function applyRegistryCssVars(
  cwd: string,
  config: Config,
  items: RegistryItem[],
  options: ApplyRegistryCssVarsOptions = {}
): Promise<boolean> {
  const cssVars = mergeRegistryCssVars(items)
  const hasVariables = CSS_VAR_GROUPS.some(
    (group) => Object.keys(cssVars[group]).length > 0
  )
  if (!hasVariables) return false

  if (!config.tailwind.cssVariables) {
    throw new Error("WUI components require tailwind.cssVariables to be enabled.")
  }

  const cssPath = path.resolve(cwd, config.tailwind.css)
  const relativeCssPath = path.relative(cwd, cssPath)
  if (relativeCssPath.startsWith("..") || path.isAbsolute(relativeCssPath)) {
    throw new Error("tailwind.css must resolve inside the project directory.")
  }

  let current: string
  try {
    current = await fs.readFile(cssPath, "utf8")
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error
    current = '@import "tailwindcss";\n'
  }

  const next = upsertRegistryCssVars(current, renderRegistryCssVars(cssVars))
  if (next === current) return false

  if (options.dryRun) {
    options.onLog?.(`  would update ${relativeCssPath}`)
    return true
  }

  await fs.mkdir(path.dirname(cssPath), { recursive: true })
  await fs.writeFile(cssPath, next, "utf8")
  options.onLog?.(`  updated ${relativeCssPath}`)
  return true
}

function renderRule(selector: string, variables: Record<string, string>): string {
  const declarations = Object.entries(variables).map(
    ([name, value]) => `  --${name.replace(/^--/, "")}: ${value};`
  )
  return `${selector} {\n${declarations.join("\n")}\n}`
}
