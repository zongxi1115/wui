import { promises as fs } from "node:fs"
import path from "node:path"

import { applyRegistryCssVars } from "../registry/css-vars"
import { fetchItem } from "../registry/fetcher"
import { configSchema, type Config } from "../registry/schema"
import {
  aliasToPath,
  readConfig,
  resolveBaseDir,
  writeConfig,
} from "../utils/config"
import { detectPackageManager, runInstall } from "../utils/pm"
import { ask, isInteractive } from "../utils/interactive"
import { logger } from "../utils/logger"

const CN_UTILS = `import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
`

export interface InitOptions {
  cwd: string
  registry?: string
  skipInstall?: boolean
  yes?: boolean
  theme?: boolean
}

export async function initCommand(opts: InitOptions): Promise<void> {
  const cwd = path.resolve(opts.cwd)
  const existingConfig = await readConfig(cwd)
  let installTheme = opts.theme !== false
  let themeMode: "both" | "light" | "dark" = "both"

  if (existingConfig) {
    logger.warn(`wui.json already exists — leaving it untouched.`)
  } else {
    const defaults = await detectInitDefaults(cwd)
    let values = {
      rsc: defaults.rsc,
      css: defaults.css,
      ui: defaults.ui,
      baseColor: "neutral",
      installTheme,
      themeMode,
    }

    if (!opts.yes && isInteractive()) {
      logger.info(`\nWUI project setup\n`)
      const answers = await ask<
        | "rsc"
        | "css"
        | "ui"
        | "baseColor"
        | "installTheme"
        | "themeMode"
        | "confirm"
      >([
        {
          type: "confirm",
          name: "rsc",
          message: "Use React Server Components?",
          initial: defaults.rsc,
        },
        {
          type: "text",
          name: "css",
          message: "Global CSS file",
          initial: defaults.css,
          validate: (value) =>
            Boolean(String(value).trim()) || "Enter a CSS file path",
        },
        {
          type: "text",
          name: "ui",
          message: "UI components alias",
          initial: defaults.ui,
          validate: (value) =>
            Boolean(String(value).trim()) || "Enter a component alias",
        },
        {
          type: "select",
          name: "baseColor",
          message: "Base color",
          initial: 0,
          choices: ["neutral", "zinc", "slate", "stone"].map((value) => ({
            title: value[0].toUpperCase() + value.slice(1),
            value,
          })),
        },
        {
          type: opts.theme === false ? null : "confirm",
          name: "installTheme",
          message: "Install the default WUI theme?",
          initial: true,
        },
        {
          type: (_previous, answers) =>
            answers.installTheme ? "select" : null,
          name: "themeMode",
          message: "Theme modes",
          initial: 0,
          choices: [
            { title: "Light + dark", value: "both" },
            { title: "Light only", value: "light" },
            { title: "Dark only", value: "dark" },
          ],
        },
        {
          type: "confirm",
          name: "confirm",
          message: "Create the configuration with these settings?",
          initial: true,
        },
      ])
      if (!answers || !answers.confirm) {
        logger.warn("Cancelled.")
        return
      }
      values = {
        rsc: Boolean(answers.rsc),
        css: String(answers.css),
        ui: String(answers.ui),
        baseColor: String(answers.baseColor),
        installTheme:
          opts.theme === false ? false : Boolean(answers.installTheme),
        themeMode: (answers.themeMode ?? "both") as typeof themeMode,
      }
    }
    installTheme = values.installTheme
    themeMode = values.themeMode

    const config: Config = configSchema.parse({
      $schema: "https://ui.wzx.wang/schema.json",
      style: "default",
      rsc: values.rsc,
      tsx: true,
      tailwind: {
        css: values.css,
        baseColor: values.baseColor,
        cssVariables: true,
      },
      aliases: {
        components: "@/components",
        ui: values.ui,
        lib: "@/lib",
        hooks: "@/hooks",
        utils: "@/lib/utils",
      },
      registries: {
        "@wui": opts.registry ?? "https://ui.wzx.wang/r/{name}.json",
      },
    })
    await writeConfig(cwd, config)
    logger.success(`✓ Wrote wui.json`)
  }

  const config = (await readConfig(cwd))!
  const baseDir = await resolveBaseDir(cwd)
  const utilsPath = aliasToPath(config.aliases.utils, baseDir) + ".ts"
  const utilsAbs = path.join(cwd, utilsPath)
  try {
    await fs.access(utilsAbs)
    logger.dim(`• ${utilsPath} already exists, skipped`)
  } catch {
    await fs.mkdir(path.dirname(utilsAbs), { recursive: true })
    await fs.writeFile(utilsAbs, CN_UTILS, "utf8")
    logger.success(`✓ Wrote ${utilsPath}`)
  }

  if (installTheme) {
    logger.step("Installing the WUI theme…")
    const theme = await fetchItem("@wui/theme", config)
    if (themeMode !== "both" && theme.cssVars) {
      theme.cssVars = {
        ...theme.cssVars,
        ...(themeMode === "light" ? { dark: {} } : { light: {} }),
      }
    }
    await applyRegistryCssVars(cwd, config, [theme], {
      onLog: (message) => logger.success(message),
    })
  }

  if (!opts.skipInstall) {
    const pm = await detectPackageManager(cwd)
    logger.step(`Installing base dependencies with ${pm}…`)
    await runInstall(
      pm,
      ["clsx", "tailwind-merge", "class-variance-authority"],
      false,
      cwd
    )
  }

  logger.success(`\nDone. Add a component with:  wui add @wui/button`)
}

async function detectInitDefaults(cwd: string): Promise<{
  rsc: boolean
  css: string
  ui: string
}> {
  const candidates = [
    "app/globals.css",
    "src/app/globals.css",
    "src/index.css",
    "src/globals.css",
  ]
  let css = candidates[0]
  for (const candidate of candidates) {
    try {
      await fs.access(path.join(cwd, candidate))
      css = candidate
      break
    } catch {
      // Keep looking.
    }
  }
  return {
    rsc: css.startsWith("app/") || css.includes("/app/"),
    css,
    ui: "@/components/ui",
  }
}
