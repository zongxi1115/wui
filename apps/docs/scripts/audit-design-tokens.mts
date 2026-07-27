import { promises as fs } from "node:fs"
import path from "node:path"

type CssVars = Record<"light" | "dark" | "theme", Record<string, string>>

interface RegistryItem {
  name: string
  type: string
  registryDependencies?: string[]
  cssVars?: CssVars
}

interface RegistryManifest {
  items: RegistryItem[]
}

const ROOT = process.cwd()
const REGISTRY_FILE = path.join(ROOT, "registry.json")
const GLOBAL_CSS_FILE = path.join(ROOT, "app", "global.css")
const SOURCE_DIRS = [
  path.join(ROOT, "registry", "ui"),
  path.join(ROOT, "registry", "components"),
]

const REQUIRED_SEMANTIC_TOKENS = [
  "background",
  "foreground",
  "card",
  "card-foreground",
  "popover",
  "popover-foreground",
  "primary",
  "primary-foreground",
  "secondary",
  "secondary-foreground",
  "muted",
  "muted-foreground",
  "accent",
  "accent-foreground",
  "destructive",
  "destructive-foreground",
  "info",
  "info-foreground",
  "success",
  "success-foreground",
  "warning",
  "warning-foreground",
  "border",
  "input",
  "ring",
  "overlay",
  "shine",
] as const

const FOREGROUND_PAIRS = [
  "card",
  "popover",
  "primary",
  "secondary",
  "muted",
  "accent",
  "destructive",
  "info",
  "success",
  "warning",
] as const

const RAW_COLOR_UTILITY =
  /(?:bg|text|border|ring|outline|fill|stroke)-(?:white|black|slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)(?:-[0-9]{2,3})?(?:\/[0-9]{1,3})?\b/
const CSS_COLOR_LITERAL = /#[0-9a-f]{3,8}\b|(?:rgb|hsl|oklch|oklab)\(/i

async function main() {
  const errors: string[] = []
  const registry = JSON.parse(
    await fs.readFile(REGISTRY_FILE, "utf8")
  ) as RegistryManifest
  const theme = registry.items.find((item) => item.name === "theme")
  const utils = registry.items.find((item) => item.name === "utils")

  if (!theme || theme.type !== "registry:theme" || !theme.cssVars) {
    errors.push('registry.json must define a "theme" item with type registry:theme and cssVars.')
  }

  if (!utils?.registryDependencies?.includes("theme")) {
    errors.push('The "utils" registry item must depend on "theme" so visual components inherit tokens.')
  }

  if (theme?.cssVars) {
    auditThemeShape(theme.cssVars, errors)
    await auditGlobalCssMirror(theme.cssVars, errors)
  }

  await auditComponentSources(errors)

  if (errors.length > 0) {
    console.error(`Design token audit failed with ${errors.length} issue(s):`)
    for (const error of errors) console.error(`- ${error}`)
    process.exitCode = 1
    return
  }

  console.log("Design token audit passed.")
}

function auditThemeShape(cssVars: CssVars, errors: string[]) {
  const lightKeys = Object.keys(cssVars.light).sort()
  const darkKeys = Object.keys(cssVars.dark).sort()

  if (lightKeys.join("\n") !== darkKeys.join("\n")) {
    const onlyLight = lightKeys.filter((key) => !darkKeys.includes(key))
    const onlyDark = darkKeys.filter((key) => !lightKeys.includes(key))
    if (onlyLight.length) errors.push(`Theme keys only in light: ${onlyLight.join(", ")}.`)
    if (onlyDark.length) errors.push(`Theme keys only in dark: ${onlyDark.join(", ")}.`)
  }

  for (const token of REQUIRED_SEMANTIC_TOKENS) {
    if (!(token in cssVars.light)) errors.push(`Missing light token: ${token}.`)
    if (!(token in cssVars.dark)) errors.push(`Missing dark token: ${token}.`)
    const themeKey = `color-${token}`
    if (cssVars.theme[themeKey] !== `var(--${token})`) {
      errors.push(`Missing or invalid Tailwind mapping: ${themeKey}.`)
    }
  }

  for (const token of FOREGROUND_PAIRS) {
    const foreground = `${token}-foreground`
    if (!(foreground in cssVars.light) || !(foreground in cssVars.dark)) {
      errors.push(`${token} must provide the ${foreground} pair in both themes.`)
    }
  }

  for (const radius of ["sm", "md", "lg", "xl"]) {
    if (!(`radius-${radius}` in cssVars.theme)) {
      errors.push(`Missing radius mapping: radius-${radius}.`)
    }
  }
}

async function auditGlobalCssMirror(cssVars: CssVars, errors: string[]) {
  const css = await fs.readFile(GLOBAL_CSS_FILE, "utf8")
  const mirror: CssVars = {
    light: parseCssDeclarations(css, /:root\s*\{([^}]*)\}/s),
    dark: parseCssDeclarations(css, /\.dark\s*\{([^}]*)\}/s),
    theme: parseCssDeclarations(css, /@theme\s+inline\s*\{([^}]*)\}/s),
  }

  for (const group of ["light", "dark", "theme"] as const) {
    for (const [token, value] of Object.entries(cssVars[group])) {
      if (normalizeCssValue(mirror[group][token]) !== normalizeCssValue(value)) {
        errors.push(
          `global.css ${group}.${token} does not match registry theme (${mirror[group][token] ?? "missing"}).`
        )
      }
    }
  }
}

async function auditComponentSources(errors: string[]) {
  const files = (
    await Promise.all(SOURCE_DIRS.map((directory) => listSourceFiles(directory)))
  ).flat()

  for (const file of files) {
    const lines = (await fs.readFile(file, "utf8")).split(/\r?\n/)
    lines.forEach((line, index) => {
      if (line.includes("wui-token-audit-allow")) return
      const rawUtility = line.match(RAW_COLOR_UTILITY)?.[0]
      if (rawUtility) {
        errors.push(`${toProjectPath(file)}:${index + 1} uses raw color utility ${rawUtility}.`)
      }
      const literal = line.match(CSS_COLOR_LITERAL)?.[0]
      if (literal) {
        errors.push(`${toProjectPath(file)}:${index + 1} uses CSS color literal ${literal}.`)
      }
    })
  }
}

async function listSourceFiles(directory: string): Promise<string[]> {
  const entries = await fs.readdir(directory, { withFileTypes: true })
  const files = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = path.join(directory, entry.name)
      if (entry.isDirectory()) return listSourceFiles(fullPath)
      return /\.tsx?$/.test(entry.name) ? [fullPath] : []
    })
  )
  return files.flat()
}

function parseCssDeclarations(
  css: string,
  blockPattern: RegExp
): Record<string, string> {
  const block = css.match(blockPattern)?.[1] ?? ""
  const declarations: Record<string, string> = {}
  for (const match of block.matchAll(/--([a-z0-9-]+)\s*:\s*([^;]+);/gi)) {
    declarations[match[1]] = match[2].trim()
  }
  return declarations
}

function normalizeCssValue(value: string | undefined): string {
  return value?.replace(/\s+/g, " ").trim() ?? ""
}

function toProjectPath(file: string): string {
  return path.relative(ROOT, file).split(path.sep).join("/")
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
