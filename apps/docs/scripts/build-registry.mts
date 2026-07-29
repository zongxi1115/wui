/**
 * build-registry.mts
 * ------------------------------------------------------------------
 * Turns the `registry.json` manifest + `registry/` source folder into:
 *   1. public/r/<name>.json  — flattened, shadcn-compatible registry items
 *                              with the source files inlined as strings.
 *                              This is what the `wui` CLI (and `npx shadcn`)
 *                              fetch over HTTP.
 *   2. public/r/index.json   — a lightweight list of items for discovery
 *                              (`wui list`).
 *   3. registry/__index__.tsx     — metadata index (name -> files/meta),
 *                                    consumed by <ComponentSource />.
 *   4. registry/__components__.tsx — name -> React.lazy(() => import(...))
 *                                    for every example, consumed by
 *                                    <ComponentPreview />.
 *
 * Run with: pnpm --filter docs registry:build   (tsx scripts/build-registry.mts)
 */
import { promises as fs } from "node:fs"
import path from "node:path"
import { z } from "zod"

const ROOT = process.cwd() // apps/docs
const REGISTRY_JSON = path.join(ROOT, "registry.json")
const EXAMPLES_DIR = path.join(ROOT, "registry", "examples")
const OUT_DIR = path.join(ROOT, "public", "r")
const INDEX_FILE = path.join(ROOT, "registry", "__index__.tsx")
const COMPONENTS_FILE = path.join(ROOT, "registry", "__components__.tsx")

// ---------------------------------------------------------------------------
// Schema (a shadcn-compatible subset of registry-item.json)
// ---------------------------------------------------------------------------
const registryItemFileSchema = z.object({
  path: z.string(),
  type: z.string(),
  target: z.string().optional(),
})

const registryItemSchema = z.object({
  name: z.string(),
  type: z.string(),
  title: z.string().optional(),
  description: z.string().optional(),
  author: z.string().optional(),
  dependencies: z.array(z.string()).optional(),
  devDependencies: z.array(z.string()).optional(),
  registryDependencies: z.array(z.string()).optional(),
  files: z.array(registryItemFileSchema),
  cssVars: z.record(z.string(), z.record(z.string(), z.string())).optional(),
  css: z.record(z.string(), z.unknown()).optional(),
  docs: z.string().optional(),
  categories: z.array(z.string()).optional(),
  meta: z.record(z.string(), z.unknown()).optional(),
})

const registrySchema = z.object({
  name: z.string(),
  homepage: z.string().optional(),
  items: z.array(registryItemSchema),
})

type RegistryItem = z.infer<typeof registryItemSchema>

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
async function readSource(relPath: string): Promise<string> {
  const abs = path.join(ROOT, relPath)
  return fs.readFile(abs, "utf8")
}

function toPosix(p: string): string {
  return p.split(path.sep).join("/")
}

async function writeFileIfChanged(file: string, content: string) {
  try {
    if ((await fs.readFile(file, "utf8")) === content) return
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error
  }

  await fs.writeFile(file, content, "utf8")
}

async function expandDirectoryFiles(item: RegistryItem): Promise<RegistryItem> {
  const includeDirectory = item.meta?.includeDirectory
  const targetDirectory = item.meta?.targetDirectory

  if (typeof includeDirectory !== "string") return item
  if (typeof targetDirectory !== "string") {
    throw new Error(
      `Registry item "${item.name}" uses meta.includeDirectory without meta.targetDirectory`
    )
  }

  const registryRoot = path.resolve(ROOT, "registry")
  const sourceDirectory = path.resolve(ROOT, includeDirectory)
  if (!sourceDirectory.startsWith(`${registryRoot}${path.sep}`)) {
    throw new Error(
      `Generated registry files must stay inside registry/: ${includeDirectory}`
    )
  }
  if (
    path.isAbsolute(targetDirectory) ||
    targetDirectory.split(/[\\/]/).includes("..")
  ) {
    throw new Error(`Invalid generated target directory: ${targetDirectory}`)
  }

  const entries = (await fs.readdir(sourceDirectory, { withFileTypes: true }))
    .filter((entry) => entry.isFile())
    .filter((entry) => /\.(?:md|ts|tsx|txt)$/.test(entry.name))
    .sort((a, b) => a.name.localeCompare(b.name))

  return {
    ...item,
    files: entries.map((entry) => ({
      path: toPosix(path.join(includeDirectory, entry.name)),
      type: /\.(?:ts|tsx)$/.test(entry.name) ? "registry:ui" : "registry:file",
      target: toPosix(path.join(targetDirectory, entry.name)),
    })),
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  const raw = JSON.parse(await fs.readFile(REGISTRY_JSON, "utf8"))
  const registry = registrySchema.parse(raw)
  const registryItems = await Promise.all(
    registry.items.map(expandDirectoryFiles)
  )

  // Remove stale registry JSON without deleting independently generated
  // subdirectories such as public/r/llms.
  await fs.mkdir(OUT_DIR, { recursive: true })
  const previousOutputs = await fs.readdir(OUT_DIR, { withFileTypes: true })
  await Promise.all(
    previousOutputs
      .filter((entry) => entry.isFile() && entry.name.endsWith(".json"))
      .map((entry) => fs.unlink(path.join(OUT_DIR, entry.name)))
  )

  // --- 1 + 2. Build public/r/<name>.json and the discovery index. ---------
  const indexEntries: Record<string, unknown> = {}
  const discovery: Array<Record<string, unknown>> = []

  for (const item of registryItems) {
    const files = await Promise.all(
      item.files.map(async (f) => {
        const content = await readSource(f.path)

        if (f.type === "registry:asset" && f.target?.startsWith("public/")) {
          const publicRoot = path.resolve(ROOT, "public")
          const previewTarget = path.resolve(ROOT, f.target)
          if (!previewTarget.startsWith(`${publicRoot}${path.sep}`)) {
            throw new Error(
              `Asset target must stay inside public/: ${f.target}`
            )
          }
          await fs.mkdir(path.dirname(previewTarget), { recursive: true })
          await fs.copyFile(path.resolve(ROOT, f.path), previewTarget)
        }

        return {
          path: toPosix(f.path),
          type: f.type,
          ...(f.target ? { target: toPosix(f.target) } : {}),
          content,
        }
      })
    )

    const output: RegistryItem & { $schema: string; files: unknown[] } = {
      $schema: "https://ui.shadcn.com/schema/registry-item.json",
      ...item,
      files,
    }

    await fs.writeFile(
      path.join(OUT_DIR, `${item.name}.json`),
      JSON.stringify(output, null, 2) + "\n",
      "utf8"
    )

    discovery.push({
      name: item.name,
      type: item.type,
      title: item.title ?? item.name,
      description: item.description ?? "",
      registryDependencies: item.registryDependencies ?? [],
    })

    indexEntries[item.name] = {
      name: item.name,
      type: item.type,
      title: item.title,
      description: item.description,
      registryDependencies: item.registryDependencies ?? [],
      files: item.files.map((f) => ({
        path: toPosix(f.path),
        type: f.type,
        ...(f.target ? { target: toPosix(f.target) } : {}),
      })),
    }
  }

  await fs.writeFile(
    path.join(OUT_DIR, "index.json"),
    JSON.stringify(
      { name: registry.name, homepage: registry.homepage, items: discovery },
      null,
      2
    ) + "\n",
    "utf8"
  )

  // --- 3 + 4. Scan examples and emit the __index__ / __components__ pair. --
  const exampleFiles = (await fs.readdir(EXAMPLES_DIR))
    .filter((f) => f.endsWith(".tsx"))
    .sort()

  const lazyLines: string[] = []
  for (const file of exampleFiles) {
    const name = file.replace(/\.tsx$/, "")
    const relPath = `registry/examples/${file}`
    indexEntries[name] = {
      name,
      type: "registry:example",
      files: [{ path: relPath, type: "registry:example" }],
    }
    lazyLines.push(
      `  "${name}": React.lazy(() => import("@/registry/examples/${name}")),`
    )
  }

  const banner = `// AUTO-GENERATED by scripts/build-registry.mts — do not edit by hand.\n`

  const indexContent =
    banner +
    `export type RegistryIndexFile = { path: string; type: string; target?: string }\n` +
    `export type RegistryIndexEntry = {\n` +
    `  name: string\n` +
    `  type: string\n` +
    `  title?: string\n` +
    `  description?: string\n` +
    `  registryDependencies?: string[]\n` +
    `  files: RegistryIndexFile[]\n` +
    `}\n\n` +
    `export const Index: Record<string, RegistryIndexEntry> = ${JSON.stringify(
      indexEntries,
      null,
      2
    )}\n`

  await writeFileIfChanged(INDEX_FILE, indexContent)

  const componentsContent =
    banner +
    `import * as React from "react"\n\n` +
    `type LazyComponent = React.LazyExoticComponent<React.ComponentType>\n\n` +
    `export const Components: Record<string, LazyComponent> = {\n` +
    lazyLines.join("\n") +
    `\n}\n`

  await writeFileIfChanged(COMPONENTS_FILE, componentsContent)

  // --- Report -------------------------------------------------------------
  console.log(
    `✓ registry built: ${registryItems.length} items, ${exampleFiles.length} examples`
  )
  console.log(`  → ${toPosix(path.relative(ROOT, OUT_DIR))}/*.json`)
  console.log(`  → ${toPosix(path.relative(ROOT, INDEX_FILE))}`)
  console.log(`  → ${toPosix(path.relative(ROOT, COMPONENTS_FILE))}`)
}

main().catch((err) => {
  console.error("✗ registry build failed:\n", err)
  process.exit(1)
})
