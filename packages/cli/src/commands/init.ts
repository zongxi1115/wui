import { promises as fs } from "node:fs"
import path from "node:path"

import { configSchema, type Config } from "../registry/schema"
import { aliasToPath, readConfig, resolveBaseDir, writeConfig } from "../utils/config"
import { detectPackageManager, runInstall } from "../utils/pm"
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
}

export async function initCommand(opts: InitOptions): Promise<void> {
  const cwd = path.resolve(opts.cwd)

  if (await readConfig(cwd)) {
    logger.warn(`wui.json already exists — leaving it untouched.`)
  } else {
    const config: Config = configSchema.parse({
      $schema: "https://wui.dev/schema.json",
      style: "default",
      rsc: true,
      tsx: true,
      tailwind: {
        css: "app/globals.css",
        baseColor: "neutral",
        cssVariables: true,
      },
      aliases: {
        components: "@/components",
        ui: "@/components/ui",
        lib: "@/lib",
        hooks: "@/hooks",
        utils: "@/lib/utils",
      },
      registries: {
        "@wui": opts.registry ?? "http://localhost:3000/r/{name}.json",
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

  if (!opts.skipInstall) {
    const pm = await detectPackageManager(cwd)
    logger.step(`Installing base dependencies with ${pm}…`)
    await runInstall(pm, ["clsx", "tailwind-merge", "class-variance-authority"], false, cwd)
  }

  logger.success(`\nDone. Add a component with:  wui add @wui/button`)
}
