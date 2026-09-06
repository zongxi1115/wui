import { promises as fs } from "node:fs"
import path from "node:path"

import { configSchema, type Config } from "../registry/schema"

export const CONFIG_FILE = "wui.json"

export async function readConfig(cwd: string): Promise<Config | null> {
  try {
    const raw = await fs.readFile(path.join(cwd, CONFIG_FILE), "utf8")
    return configSchema.parse(JSON.parse(raw))
  } catch {
    return null
  }
}

export async function writeConfig(cwd: string, config: Config): Promise<void> {
  await fs.writeFile(
    path.join(cwd, CONFIG_FILE),
    JSON.stringify(config, null, 2) + "\n",
    "utf8"
  )
}

/** Determine the filesystem base directory that the `@/` alias maps to. */
export async function resolveBaseDir(cwd: string): Promise<string> {
  for (const file of ["tsconfig.json", "jsconfig.json"]) {
    try {
      const raw = await fs.readFile(path.join(cwd, file), "utf8")
      const stripped = raw
        .replace(/\/\*[\s\S]*?\*\//g, "")
        .replace(/(^|\s)\/\/.*$/gm, "")
      const json = JSON.parse(stripped)
      const paths: unknown = json?.compilerOptions?.paths?.["@/*"]
      if (Array.isArray(paths) && typeof paths[0] === "string") {
        const p = paths[0].replace(/^\.\//, "").replace(/\/\*$/, "")
        return p || "."
      }
    } catch {
      // ignore missing/invalid config
    }
  }
  try {
    if ((await fs.stat(path.join(cwd, "src"))).isDirectory()) return "src"
  } catch {
    // no src dir
  }
  return "."
}

/** Resolve an `@/...` alias to a filesystem path (relative to cwd, no extension). */
export function aliasToPath(alias: string, baseDir: string): string {
  const rel = alias.replace(/^@\//, "")
  return path.join(baseDir, rel)
}
