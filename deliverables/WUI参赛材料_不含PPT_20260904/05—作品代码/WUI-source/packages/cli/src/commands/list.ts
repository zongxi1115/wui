import path from "node:path"

import { fetchRegistryIndex } from "../registry/index"
import { readConfig } from "../utils/config"
import { logger } from "../utils/logger"

export interface ListOptions {
  cwd: string
  namespace: string
}

export async function listCommand(opts: ListOptions): Promise<void> {
  const cwd = path.resolve(opts.cwd)
  const config = await readConfig(cwd)
  if (!config) {
    logger.error(`No wui.json found. Run "wui init" first.`)
    process.exitCode = 1
    return
  }
  const template = config.registries[opts.namespace]
  if (!template) {
    logger.error(`Unknown registry "${opts.namespace}".`)
    process.exitCode = 1
    return
  }

  const data = await fetchRegistryIndex(template)
  logger.info(`Components in ${opts.namespace}:`)
  for (const item of data.items) {
    logger.info(`  ${item.name.padEnd(18)} ${item.description ?? ""}`)
  }
}
