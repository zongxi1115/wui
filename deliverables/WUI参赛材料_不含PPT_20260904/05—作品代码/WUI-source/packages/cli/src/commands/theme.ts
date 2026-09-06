import { promises as fs } from "node:fs"
import path from "node:path"

import { applyRegistryCssVars } from "../registry/css-vars"
import { fetchItem, isLocalJson } from "../registry/fetcher"
import { getPreset, listPresets } from "../registry/presets"
import {
  registryItemSchema,
  type Config,
  type RegistryItem,
} from "../registry/schema"
import { readConfig } from "../utils/config"
import { ask, isInteractive } from "../utils/interactive"
import { logger } from "../utils/logger"

const THEMES_DIR = "themes"

export interface ThemeOptions {
  cwd: string
}

export interface ThemeCreateOptions extends ThemeOptions {
  base?: string
  yes?: boolean
  primary?: string
  radius?: string
  mode?: "both" | "light" | "dark"
  apply?: boolean
  overwrite?: boolean
}

export async function themeInitCommand(opts: ThemeOptions): Promise<void> {
  const { cwd, config } = await requireConfig(opts.cwd)
  logger.step("Loading the default WUI theme…")
  const item = await fetchItem("@wui/theme", config)
  await applyTheme(cwd, config, item)
  logger.success("\n✓ Default theme applied.")
}

export async function themeCreateCommand(
  name: string | undefined,
  opts: ThemeCreateOptions
): Promise<void> {
  const { cwd, config } = await requireConfig(opts.cwd)
  const base = opts.base ?? "@wui/theme"
  logger.step(`Loading base theme ${base}…`)
  const item = await loadTheme(base, cwd, config)
  const defaults = {
    primary: item.cssVars?.light?.primary ?? "oklch(0.205 0 0)",
    radius: item.cssVars?.light?.radius ?? "0.625rem",
  }
  let values = {
    name: name ?? "",
    primary: opts.primary ?? defaults.primary,
    radius: opts.radius ?? defaults.radius,
    mode: opts.mode ?? ("both" as const),
    apply: opts.apply !== false,
  }

  if (!opts.yes && isInteractive()) {
    const answers = await ask<
      "name" | "primary" | "radius" | "mode" | "apply" | "confirm"
    >([
      {
        type: name ? null : "text",
        name: "name",
        message: "Theme name",
        validate: validateThemeName,
      },
      {
        type: "text",
        name: "primary",
        message: "Primary color",
        initial: defaults.primary,
        validate: (value) =>
          Boolean(String(value).trim()) || "Enter a CSS color",
      },
      {
        type: "text",
        name: "radius",
        message: "Base radius",
        initial: defaults.radius,
        validate: (value) =>
          Boolean(String(value).trim()) || "Enter a CSS length",
      },
      {
        type: "select",
        name: "mode",
        message: "Theme modes",
        initial: 0,
        choices: [
          { title: "Light + dark", value: "both" },
          { title: "Light only", value: "light" },
          { title: "Dark only", value: "dark" },
        ],
      },
      {
        type: opts.apply === false ? null : "confirm",
        name: "apply",
        message: "Apply this theme now?",
        initial: true,
      },
      {
        type: "confirm",
        name: "confirm",
        message: "Create the theme scaffold?",
        initial: true,
      },
    ])
    if (!answers || !answers.confirm) {
      logger.warn("Cancelled.")
      return
    }
    values = {
      name: name ?? String(answers.name),
      primary: String(answers.primary),
      radius: String(answers.radius),
      mode: answers.mode as typeof values.mode,
      apply: opts.apply === false ? false : Boolean(answers.apply),
    }
  }

  const nameError = validateThemeName(values.name)
  if (nameError !== true) throw new Error(nameError)
  if (!["both", "light", "dark"].includes(values.mode)) {
    throw new Error(
      `Invalid theme mode "${values.mode}". Use both, light, or dark.`
    )
  }

  const cssVars = structuredClone(item.cssVars ?? {})
  for (const mode of ["light", "dark"] as const) {
    cssVars[mode] ??= {}
    cssVars[mode].primary = values.primary
    cssVars[mode].radius = values.radius
  }
  if (values.mode === "light") cssVars.dark = {}
  if (values.mode === "dark") cssVars.light = {}

  const scaffold = registryItemSchema.parse({
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: values.name,
    type: "registry:theme",
    title: `${toTitle(values.name)} Theme`,
    description: `Local WUI theme based on ${base}.`,
    files: [],
    cssVars,
  })
  const relative = path.join(THEMES_DIR, `${values.name}.json`)
  const target = path.join(cwd, relative)
  if (!opts.overwrite && (await fileExists(target))) {
    throw new Error(
      `${relative} already exists. Use --overwrite to replace it.`
    )
  }
  await fs.mkdir(path.dirname(target), { recursive: true })
  await fs.writeFile(target, `${JSON.stringify(scaffold, null, 2)}\n`, "utf8")
  logger.success(`✓ Created ${relative}`)

  if (values.apply) {
    await applyTheme(cwd, config, scaffold)
    logger.success(`✓ Applied ${values.name}`)
  }
}

export async function themeListCommand(opts: ThemeOptions): Promise<void> {
  const cwd = path.resolve(opts.cwd)
  const directory = path.join(cwd, THEMES_DIR)
  let entries: string[] = []
  try {
    entries = (await fs.readdir(directory)).filter((entry) =>
      entry.endsWith(".json")
    )
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error
  }
  logger.info("Built-in presets:")
  for (const preset of listPresets())
    logger.info(`  ${preset.name.padEnd(10)} ${preset.description}`)
  logger.dim(`\nApply one with: wui theme apply <name>`)

  if (entries.length === 0) {
    logger.dim(
      `\nNo local themes found. Create one with: wui theme create <name>`
    )
    return
  }
  logger.info("\nLocal themes:")
  for (const entry of entries.sort())
    logger.info(`  ${path.basename(entry, ".json")}`)
}

export async function themeApplyCommand(
  theme: string,
  opts: ThemeOptions
): Promise<void> {
  const { cwd, config } = await requireConfig(opts.cwd)
  const localPath = path.join(cwd, THEMES_DIR, `${theme}.json`)
  let item: RegistryItem
  const preset = getPreset(theme)
  if (await fileExists(localPath)) {
    item = registryItemSchema.parse(
      JSON.parse(await fs.readFile(localPath, "utf8"))
    )
  } else if (preset) {
    item = preset
  } else {
    item = await loadTheme(theme, cwd, config)
  }
  await applyTheme(cwd, config, item)
  logger.success(`\n✓ Applied theme ${item.name}.`)
}

async function requireConfig(
  inputCwd: string
): Promise<{ cwd: string; config: Config }> {
  const cwd = path.resolve(inputCwd)
  const config = await readConfig(cwd)
  if (!config) throw new Error(`No wui.json found. Run "wui init" first.`)
  return { cwd, config }
}

async function applyTheme(
  cwd: string,
  config: Config,
  item: RegistryItem
): Promise<void> {
  if (item.type !== "registry:theme") {
    throw new Error(`${item.name} is not a registry:theme item.`)
  }
  await applyRegistryCssVars(cwd, config, [item], {
    onLog: (message) => logger.success(message),
  })
}

async function loadTheme(
  address: string,
  cwd: string,
  config: Config
): Promise<RegistryItem> {
  if (isLocalJson(address)) {
    const file = path.isAbsolute(address) ? address : path.resolve(cwd, address)
    return registryItemSchema.parse(JSON.parse(await fs.readFile(file, "utf8")))
  }
  const preset = getPreset(address)
  if (preset) return preset
  return fetchItem(address, config)
}

function validateThemeName(value: unknown): true | string {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(String(value))
    ? true
    : "Use a lowercase kebab-case name, for example ocean-blue"
}

function toTitle(value: string): string {
  return value.replace(
    /(^|-)([a-z0-9])/g,
    (_match, _separator, letter: string) => letter.toUpperCase()
  )
}

function fileExists(file: string): Promise<boolean> {
  return fs.access(file).then(
    () => true,
    () => false
  )
}
