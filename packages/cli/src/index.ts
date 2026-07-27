import { Command } from "commander"

import { addCommand } from "./commands/add"
import { buildCommand } from "./commands/build"
import { initCommand } from "./commands/init"
import { listCommand } from "./commands/list"
import { viewCommand } from "./commands/view"

const program = new Command()

program
  .name("wui")
  .description("Pull shadcn-style components into your project on demand.")
  .version("0.0.0")

program
  .command("init")
  .description("Initialize wui in the current project (writes wui.json + cn helper)")
  .option("-c, --cwd <dir>", "working directory", process.cwd())
  .option("-r, --registry <url>", "default @wui registry URL template")
  .option("--skip-install", "do not install base dependencies", false)
  .action((opts) =>
    initCommand({
      cwd: opts.cwd,
      registry: opts.registry,
      skipInstall: opts.skipInstall,
    })
  )

program
  .command("add")
  .description("Add components (resolves registry dependencies recursively)")
  .argument("[components...]", "names, @ns/name, URLs, or local .json files")
  .option("-c, --cwd <dir>", "working directory", process.cwd())
  .option("-o, --overwrite", "overwrite existing files", false)
  .option("--dry-run", "print actions without writing files", false)
  .option("--skip-install", "do not install npm dependencies", false)
  .action((components: string[], opts) =>
    addCommand(components, {
      cwd: opts.cwd,
      overwrite: opts.overwrite,
      dryRun: opts.dryRun,
      skipInstall: opts.skipInstall,
    })
  )

program
  .command("build")
  .description("Build a registry.json into distributable JSON files")
  .option("-c, --cwd <dir>", "working directory", process.cwd())
  .option("-o, --output <dir>", "output directory", "public/r")
  .option("-r, --registry-file <file>", "registry manifest", "registry.json")
  .action((opts) =>
    buildCommand({
      cwd: opts.cwd,
      output: opts.output,
      registryFile: opts.registryFile,
    })
  )

program
  .command("list")
  .description("List the components available in a registry")
  .option("-c, --cwd <dir>", "working directory", process.cwd())
  .option("-n, --namespace <ns>", "registry namespace", "@wui")
  .action((opts) => listCommand({ cwd: opts.cwd, namespace: opts.namespace }))

program
  .command("view")
  .description("Show details of a single registry item")
  .argument("<component>", "name, @ns/name, URL, or local .json file")
  .option("-c, --cwd <dir>", "working directory", process.cwd())
  .action((component: string, opts) =>
    viewCommand(component, { cwd: opts.cwd })
  )

program.parseAsync(process.argv).catch((err: unknown) => {
  console.error(err instanceof Error ? err.message : String(err))
  process.exit(1)
})
