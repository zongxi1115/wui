import { promises as fs } from "node:fs"
import path from "node:path"

import { registryItemSchema, type Config, type RegistryItem } from "./schema"

export function isUrl(value: string): boolean {
  return /^https?:\/\//.test(value)
}

export function isLocalJson(value: string): boolean {
  return (
    value.endsWith(".json") &&
    (value.startsWith(".") ||
      value.startsWith("/") ||
      /^[a-zA-Z]:[\\/]/.test(value))
  )
}

/** Resolve a component address into a fetchable URL or local file path. */
export function resolveAddress(
  address: string,
  config: Config
): { url?: string; file?: string } {
  if (isUrl(address)) return { url: address }
  if (isLocalJson(address)) return { file: address }

  if (address.startsWith("@")) {
    const slash = address.indexOf("/")
    if (slash === -1) {
      throw new Error(`Invalid registry address "${address}". Use @namespace/name.`)
    }
    const ns = address.slice(0, slash)
    const name = address.slice(slash + 1)
    const template = config.registries[ns]
    if (!template) {
      throw new Error(
        `Unknown registry namespace "${ns}". Add it to wui.json → "registries".`
      )
    }
    return { url: template.replace("{name}", name) }
  }

  // Bare name → default registry (@wui, else the first configured one).
  const template =
    config.registries["@wui"] ?? Object.values(config.registries)[0]
  if (!template) {
    throw new Error(
      `No registry configured. Add one to wui.json → "registries".`
    )
  }
  return { url: template.replace("{name}", address) }
}

export async function fetchItem(
  address: string,
  config: Config
): Promise<RegistryItem> {
  const { url, file } = resolveAddress(address, config)
  let raw: string
  if (file) {
    raw = await fs.readFile(path.resolve(file), "utf8")
  } else if (url) {
    const res = await fetch(url)
    if (!res.ok) {
      throw new Error(`Failed to fetch ${url} (HTTP ${res.status})`)
    }
    raw = await res.text()
  } else {
    throw new Error(`Could not resolve "${address}".`)
  }
  return registryItemSchema.parse(JSON.parse(raw))
}
