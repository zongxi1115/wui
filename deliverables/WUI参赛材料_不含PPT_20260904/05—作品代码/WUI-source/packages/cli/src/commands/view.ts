import path from "node:path"

import { fetchItem } from "../registry/fetcher"
import { readConfig } from "../utils/config"
import { logger } from "../utils/logger"

export async function viewCommand(
  component: string,
  opts: { cwd: string }
): Promise<void> {
  const cwd = path.resolve(opts.cwd)
  const config = await readConfig(cwd)
  if (!config) {
    logger.error(`No wui.json found. Run "wui init" first.`)
    process.exitCode = 1
    return
  }

  const item = await fetchItem(component, config)
  logger.info(`${item.name} (${item.type})`)
  if (item.description) logger.dim(`  ${item.description}`)
  if (item.registryDependencies?.length) {
    logger.info(`  registry deps: ${item.registryDependencies.join(", ")}`)
  }
  if (item.dependencies?.length) {
    logger.info(`  npm deps:      ${item.dependencies.join(", ")}`)
  }
  logger.info(`  files:         ${item.files.map((f) => f.path).join(", ")}`)
}
