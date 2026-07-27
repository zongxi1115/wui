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

export function renderRegistryCssVars(cssVars: CssVarMap): string {
  return [
    TOKEN_BLOCK_START,
    "@custom-variant dark (&:is(.dark *));",
    "",
    renderRule(":root", cssVars.light),
    "",
    renderRule(".dark", cssVars.dark),
    "",
    renderRule("@theme inline", cssVars.theme),
    TOKEN_BLOCK_END,
  ].join("\n")
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
