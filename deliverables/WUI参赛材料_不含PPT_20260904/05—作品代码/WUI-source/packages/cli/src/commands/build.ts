import { promises as fs } from "node:fs"
import path from "node:path"
import { z } from "zod"

import { registryItemSchema } from "../registry/schema"
import { logger } from "../utils/logger"

const registrySchema = z.object({
  name: z.string(),
  homepage: z.string().optional(),
  items: z.array(registryItemSchema),
})

export interface BuildOptions {
  cwd: string
  output: string
  registryFile: string
}

export async function buildCommand(opts: BuildOptions): Promise<void> {
  const cwd = path.resolve(opts.cwd)
  const registry = registrySchema.parse(
    JSON.parse(await fs.readFile(path.join(cwd, opts.registryFile), "utf8"))
  )

  const outDir = path.join(cwd, opts.output)
  await fs.rm(outDir, { recursive: true, force: true })
  await fs.mkdir(outDir, { recursive: true })

  const index: Array<Record<string, unknown>> = []
  for (const item of registry.items) {
    const files = await Promise.all(
      item.files.map(async (f) => ({
        ...f,
        content:
          f.content ?? (await fs.readFile(path.join(cwd, f.path), "utf8")),
      }))
    )
    const output = {
      $schema: "https://ui.shadcn.com/schema/registry-item.json",
      ...item,
      files,
    }
    await fs.writeFile(
      path.join(outDir, `${item.name}.json`),
      JSON.stringify(output, null, 2) + "\n",
      "utf8"
    )
    index.push({
      name: item.name,
      type: item.type,
      title: item.title ?? item.name,
      description: item.description ?? "",
    })
  }

  await fs.writeFile(
    path.join(outDir, "index.json"),
    JSON.stringify(
      { name: registry.name, homepage: registry.homepage, items: index },
      null,
      2
    ) + "\n",
    "utf8"
  )

  logger.success(
    `✓ Built ${registry.items.length} item(s) → ${opts.output}/*.json`
  )
}
