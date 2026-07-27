import { promises as fs } from "node:fs"
import path from "node:path"

import { Index } from "@/registry/__index__"

/** Read the primary source file of a registry item or example by name. */
export async function getRegistrySource(
  name: string
): Promise<{ code: string; file: string | null }> {
  const entry = Index[name]
  if (!entry || entry.files.length === 0) {
    return { code: "", file: null }
  }
  const rel = entry.files[0].path
  const abs = path.join(process.cwd(), rel)
  try {
    const code = await fs.readFile(abs, "utf8")
    return { code, file: rel }
  } catch {
    return { code: "", file: rel }
  }
}
