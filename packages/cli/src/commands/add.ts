import { promises as fs } from "node:fs"
import path from "node:path"

import { resolveTree } from "../registry/resolver"
import { applyTransforms } from "../registry/transform"
import { applyRegistryCssVars } from "../registry/css-vars"
import type { Config, RegistryItem, RegistryItemFile } from "../registry/schema"
import { aliasToPath, readConfig, resolveBaseDir } from "../utils/config"
import { detectPackageManager, runInstall } from "../utils/pm"
import { logger } from "../utils/logger"

export interface AddOptions {
  cwd: string
  overwrite?: boolean
  dryRun?: boolean
  skipInstall?: boolean
}

export async function addCommand(
  components: string[],
  opts: AddOptions
): Promise<void> {
  const cwd = path.resolve(opts.cwd)
  const config = await readConfig(cwd)
  if (!config) {
    logger.error(`No wui.json found. Run "wui init" first.`)
    process.exitCode = 1
    return
  }
  if (components.length === 0) {
    logger.error(`Specify at least one component, e.g. wui add @wui/button`)
    process.exitCode = 1
    return
  }

  logger.step(`Resolving ${components.join(", ")}…`)
  const { items, dependencies, devDependencies } = await resolveTree(
    components,
    config
  )
  logger.dim(
    `  resolved ${items.length} item(s): ${items.map((i) => i.name).join(", ")}`
  )

  const baseDir = await resolveBaseDir(cwd)
  const deps = [...dependencies]
  const devDeps = [...devDependencies]

  if (opts.dryRun) {
    if (deps.length || devDeps.length) {
      logger.dim(`  would install: ${[...deps, ...devDeps].join(", ")}`)
    }
  } else if (!opts.skipInstall) {
    const pm = await detectPackageManager(cwd)
    if (deps.length) {
      logger.step(`Installing ${deps.length} dependencies with ${pm}…`)
      await runInstall(pm, deps, false, cwd)
    }
    if (devDeps.length) {
      logger.step(`Installing ${devDeps.length} devDependencies with ${pm}…`)
      await runInstall(pm, devDeps, true, cwd)
    }
  }

  await applyRegistryCssVars(cwd, config, items, {
    dryRun: opts.dryRun,
    onLog: (message) =>
      opts.dryRun ? logger.dim(message) : logger.success(message),
  })

  let written = 0
  for (const item of items) {
    for (const file of item.files) {
      if (file.content == null) {
        logger.warn(`  ${item.name}: ${file.path} has no content, skipped`)
        continue
      }
      const target = resolveTarget(item, file, config, baseDir)
      const abs = path.join(cwd, target)
      if ((await fileExists(abs)) && !opts.overwrite) {
        logger.dim(`  • ${target} exists, skipped (use --overwrite)`)
        continue
      }
      const content = applyTransforms(file.content, config)
      if (opts.dryRun) {
        logger.dim(`  would write ${target}`)
        continue
      }
      await fs.mkdir(path.dirname(abs), { recursive: true })
      await fs.writeFile(abs, content, "utf8")
      logger.success(`  ✓ ${target}`)
      written++
    }
  }

  if (!opts.dryRun) logger.success(`\nDone — wrote ${written} file(s).`)
}

function fileExists(p: string): Promise<boolean> {
  return fs.access(p).then(
    () => true,
    () => false
  )
}

function resolveTarget(
  item: RegistryItem,
  file: RegistryItemFile,
  config: Config,
  baseDir: string
): string {
  if (file.target) return resolveTargetAlias(file.target, config, baseDir)

  const base = basename(file.path)
  const type = file.type || item.type
  const isUtils = /^utils\.(ts|tsx)$/.test(base)

  if (type === "registry:lib" && isUtils) {
    return aliasToPath(config.aliases.utils, baseDir) + extOf(base)
  }

  switch (type) {
    case "registry:ui":
      return path.join(aliasToPath(config.aliases.ui, baseDir), base)
    case "registry:lib":
      return path.join(aliasToPath(config.aliases.lib, baseDir), base)
    case "registry:hook":
      return path.join(aliasToPath(config.aliases.hooks, baseDir), base)
    default:
      return path.join(aliasToPath(config.aliases.components, baseDir), base)
  }
}

function resolveTargetAlias(target: string, config: Config, baseDir: string): string {
  const { aliases } = config
  if (target.startsWith("@ui/"))
    return path.join(aliasToPath(aliases.ui, baseDir), target.slice(4))
  if (target.startsWith("@components/"))
    return path.join(aliasToPath(aliases.components, baseDir), target.slice(12))
  if (target.startsWith("@hooks/"))
    return path.join(aliasToPath(aliases.hooks, baseDir), target.slice(7))
  if (target.startsWith("@lib/"))
    return path.join(aliasToPath(aliases.lib, baseDir), target.slice(5))
  if (target.startsWith("~/")) return target.slice(2)
  return target
}

function basename(p: string): string {
  return p.split(/[\\/]/).pop() ?? p
}

function extOf(file: string): string {
  const i = file.lastIndexOf(".")
  return i >= 0 ? file.slice(i) : ""
}
