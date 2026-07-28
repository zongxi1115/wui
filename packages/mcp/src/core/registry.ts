import type {
  ComponentDigest,
  ExampleEntry,
  Loader,
  Overview,
  RegistryIndex,
} from "./types"

export const DEFAULT_REGISTRY_URL = "https://wui.dev/r"

/** Reads digests over HTTP from a deployed docs site. */
export function createRemoteLoader(baseUrl: string): Loader {
  const base = baseUrl.replace(/\/$/, "")
  return async (relPath) => {
    const res = await fetch(`${base}/${relPath}`)
    if (!res.ok) {
      throw new Error(`GET ${base}/${relPath} → HTTP ${res.status}`)
    }
    return res.text()
  }
}

/**
 * Reads digests from a local `public/r` directory. `node:` imports are pulled
 * in lazily so bundling this module for a browser-ish target stays possible.
 */
export function createFileLoader(dir: string): Loader {
  return async (relPath) => {
    const [{ promises: fs }, path] = await Promise.all([
      import("node:fs"),
      import("node:path"),
    ])
    return fs.readFile(path.join(dir, ...relPath.split("/")), "utf8")
  }
}

/**
 * Caches parsed digests for the process lifetime. The registry is a build
 * artifact, so it cannot change under a running server.
 */
export class Registry {
  private cache = new Map<string, Promise<unknown>>()

  constructor(private loader: Loader) {}

  private read<T>(relPath: string): Promise<T> {
    let hit = this.cache.get(relPath)
    if (!hit) {
      hit = this.loader(relPath).then((raw) => JSON.parse(raw) as unknown)
      // Don't cache failures — a transient fetch error shouldn't be permanent.
      hit.catch(() => this.cache.delete(relPath))
      this.cache.set(relPath, hit)
    }
    return hit as Promise<T>
  }

  overview(): Promise<Overview> {
    return this.read<Overview>("llms/overview.json")
  }

  index(): Promise<RegistryIndex> {
    return this.read<RegistryIndex>("llms/index.json")
  }

  examples(): Promise<Record<string, ExampleEntry>> {
    return this.read<Record<string, ExampleEntry>>("llms/examples.json")
  }

  async component(name: string): Promise<ComponentDigest> {
    const known = await this.index()
    if (!known.items.some((i) => i.name === name)) {
      throw new NotFoundError(
        name,
        known.items.map((i) => i.name)
      )
    }
    return this.read<ComponentDigest>(`llms/${name}.json`)
  }

  /** The CLI-facing item, which inlines every source file. */
  async source(name: string): Promise<{
    name: string
    files: Array<{ path: string; content: string }>
  }> {
    await this.component(name) // validates the name, reuses the cached index
    return this.read(`${name}.json`)
  }

  async example(name: string): Promise<ExampleEntry> {
    const bank = await this.examples()
    const hit = bank[name]
    if (!hit) throw new NotFoundError(name, Object.keys(bank))
    return hit
  }
}

export class NotFoundError extends Error {
  constructor(name: string, candidates: string[]) {
    const near = nearest(name, candidates)
    super(
      `"${name}" not found.` +
        (near.length ? ` Did you mean: ${near.join(", ")}?` : "")
    )
    this.name = "NotFoundError"
  }
}

/** Cheap substring/prefix match — enough to recover from a plausible typo. */
function nearest(name: string, candidates: string[], limit = 5): string[] {
  const q = name.toLowerCase().replace(/[^a-z0-9]/g, "")
  if (!q) return candidates.slice(0, limit)
  const scored = candidates
    .map((c) => {
      const k = c.toLowerCase().replace(/[^a-z0-9]/g, "")
      if (k === q) return { c, score: 0 }
      if (k.startsWith(q) || q.startsWith(k)) return { c, score: 1 }
      if (k.includes(q) || q.includes(k)) return { c, score: 2 }
      const shared = [...new Set(q)].filter((ch) => k.includes(ch)).length
      return { c, score: shared >= q.length * 0.7 ? 3 : 99 }
    })
    .filter((s) => s.score < 99)
    .sort((a, b) => a.score - b.score)
  return scored.slice(0, limit).map((s) => s.c)
}
