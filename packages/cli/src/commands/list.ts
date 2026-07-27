import path from "node:path"

import { readConfig } from "../utils/config"
import { logger } from "../utils/logger"

interface RegistryIndex {
  items: Array<{ name: string; title?: string; description?: string }>
}

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

  const url = template.replace("{name}", "index")
  const res = await fetch(url)
  if (!res.ok) {
    logger.error(`Failed to fetch ${url} (HTTP ${res.status})`)
    process.exitCode = 1
    return
  }
  const data = (await res.json()) as RegistryIndex
  logger.info(`Components in ${opts.namespace}:`)
  for (const item of data.items) {
    logger.info(`  ${item.name.padEnd(18)} ${item.description ?? ""}`)
  }
}
