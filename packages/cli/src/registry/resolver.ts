import { fetchItem, isLocalJson, isUrl, resolveAddress } from "./fetcher"
import type { Config, RegistryItem } from "./schema"

export interface ResolveResult {
  /** Unique items in dependency-first order. */
  items: RegistryItem[]
  dependencies: Set<string>
  devDependencies: Set<string>
}

/**
 * Recursively resolve components and their `registryDependencies`, de-duping
 * by item name. Bare dependency names are resolved against the same registry
 * (URL) as their parent when possible, otherwise the configured default.
 */
export async function resolveTree(
  addresses: string[],
  config: Config
): Promise<ResolveResult> {
  const items: RegistryItem[] = []
  const seen = new Set<string>()
  const dependencies = new Set<string>()
  const devDependencies = new Set<string>()

  async function visit(address: string, parentUrl?: string): Promise<void> {
    let addr = address
    // A bare dependency name inherits its parent's registry location.
    if (
      parentUrl &&
      !isUrl(address) &&
      !isLocalJson(address) &&
      !address.startsWith("@")
    ) {
      addr = new URL(`./${address}.json`, parentUrl).toString()
    }

    const resolved = safeResolve(addr, config)
    const item = await fetchItem(addr, config)

    if (seen.has(item.name)) return
    seen.add(item.name)

    for (const dep of item.registryDependencies ?? []) {
      await visit(dep, resolved.url ?? parentUrl)
    }
    for (const d of item.dependencies ?? []) dependencies.add(d)
    for (const d of item.devDependencies ?? []) devDependencies.add(d)

    items.push(item)
  }

  for (const address of addresses) {
    await visit(address)
  }

  return { items, dependencies, devDependencies }
}

function safeResolve(address: string, config: Config): { url?: string; file?: string } {
  try {
    return resolveAddress(address, config)
  } catch {
    return {}
  }
}
