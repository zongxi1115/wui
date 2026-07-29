import { createRequire } from "node:module"

import { Command } from "commander"

import { addCommand } from "./commands/add"
import { buildCommand } from "./commands/build"
import { initCommand } from "./commands/init"
import { listCommand } from "./commands/list"
import {
  themeApplyCommand,
  themeCreateCommand,
  themeInitCommand,
  themeListCommand,
} from "./commands/theme"
import { viewCommand } from "./commands/view"

// dist/index.js sits one level under the package root, so this resolves the
// published package.json — keeping --version in sync with what npm shipped.
const { version } = createRequire(import.meta.url)("../package.json") as {
  version: string
}

const program = new Command()

program
  .name("wui")
  .description("Pull shadcn-style components into your project on demand.")
  .version(version)

program
  .command("init")
  .description(
    "Initialize wui in the current project (writes wui.json + cn helper)"
  )
  .option("-c, --cwd <dir>", "working directory", process.cwd())
  .option("-r, --registry <url>", "default @wui registry URL template")
  .option("--skip-install", "do not install base dependencies", false)
  .option("-y, --yes", "use detected defaults without prompting", false)
  .option("--no-theme", "do not install the default theme")
  .action((opts) =>
    initCommand({
      cwd: opts.cwd,
      registry: opts.registry,
      skipInstall: opts.skipInstall,
      yes: opts.yes,
      theme: opts.theme,
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

const theme = program
  .command("theme")
  .description("Create and apply local theme scaffolds")

theme
  .command("init")
  .description("Apply the default WUI theme to the configured global CSS")
  .option("-c, --cwd <dir>", "working directory", process.cwd())
  .action((opts) => themeInitCommand({ cwd: opts.cwd }))

theme
  .command("create")
  .description("Create an editable local theme scaffold")
  .argument("[name]", "lowercase kebab-case theme name")
  .option("-c, --cwd <dir>", "working directory", process.cwd())
  .option("-b, --base <theme>", "base registry theme", "@wui/theme")
  .option("--primary <color>", "primary CSS color")
  .option("--radius <length>", "base CSS radius")
  .option("--mode <mode>", "both, light, or dark", "both")
  .option("--no-apply", "create the scaffold without applying it")
  .option("-o, --overwrite", "overwrite an existing local theme", false)
  .option("-y, --yes", "use defaults without prompting", false)
  .action((name, opts) =>
    themeCreateCommand(name, {
      cwd: opts.cwd,
      base: opts.base,
      primary: opts.primary,
      radius: opts.radius,
      mode: opts.mode,
      apply: opts.apply,
      overwrite: opts.overwrite,
      yes: opts.yes,
    })
  )

theme
  .command("list")
  .description("List local theme scaffolds")
  .option("-c, --cwd <dir>", "working directory", process.cwd())
  .action((opts) => themeListCommand({ cwd: opts.cwd }))

theme
  .command("apply")
  .description("Apply a local or registry theme")
  .argument("<theme>", "local name, @namespace/name, URL, or local JSON")
  .option("-c, --cwd <dir>", "working directory", process.cwd())
  .action((selectedTheme, opts) =>
    themeApplyCommand(selectedTheme, { cwd: opts.cwd })
  )

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
