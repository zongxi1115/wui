# @wui-design/cli

Pull [wui](https://ui.wzx.wang) components into your project on demand.

Components are **copied into your codebase**, not installed as a dependency —
you own the source and can edit it freely. The registry follows the shadcn
`registry-item.json` schema, so the official `shadcn` CLI works against it too.

## Usage

```bash
pnpm dlx @wui-design/cli@latest init          # interactive project and theme setup
pnpm dlx @wui-design/cli@latest add button    # copies button (+ its deps) into your project
```

Or install it globally and use the shorter `wui` binary:

```bash
pnpm add --global @wui-design/cli
wui add @wui/button @wui/card
```

## Commands

| Command                   | What it does                                                                                                           |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `wui init`                | Interactively configures aliases and theme settings, writes `wui.json`, creates `cn()`, and installs base dependencies |
| `wui add [components...]` | Opens a component picker when no names are supplied, then resolves dependencies and writes the files                   |
| `wui theme init`          | Applies the default WUI theme to the configured global CSS file                                                        |
| `wui theme create [name]` | Creates an editable local theme scaffold and optionally applies it                                                     |
| `wui theme list`          | Lists the built-in presets and local theme scaffolds                                                                   |
| `wui theme apply <theme>` | Applies a built-in preset, local theme name, or Registry theme address                                                 |
| `wui list`                | Lists the components available in a registry                                                                           |
| `wui view <component>`    | Shows the details of a single registry item                                                                            |
| `wui build`               | Compiles a `registry.json` manifest into distributable JSON (for publishing your own registry)                         |

### Useful flags

```bash
wui init --yes                   # use detected defaults without prompting
wui init --no-theme             # initialize without writing theme tokens
wui add                         # interactively select one or more components
wui add button --dry-run        # print what would happen, write nothing
wui add button --overwrite      # replace files that already exist
wui add button --skip-install   # don't touch package.json
wui init --registry https://your-host/r/{name}.json   # point at your own registry
```

## Preset themes

The CLI ships with ready-made preset themes you can apply without any registry
access. Run `wui theme list` to see them, then apply one:

```bash
wui theme apply ocean     # deep blue
wui theme apply violet    # vivid purple
wui theme apply emerald   # fresh green
wui theme apply rose      # warm pink-red
wui theme apply amber     # bright gold
wui theme apply slate     # muted blue-grey
```

Each preset carries the full light + dark token surface, so applying one swaps
the managed WUI token block in place. You can also use a preset as the starting
point for a custom scaffold with `wui theme create <name> --base <preset>`.

## Theme scaffolds

Create a named theme from a preset (or the WUI Registry theme), edit the
generated JSON, and apply it again whenever needed:

```bash
wui theme create my-brand --base ocean
wui theme apply my-brand
```

Theme scaffolds live in `themes/<name>.json` and use the same `cssVars` contract
as Registry theme items. The `apply` command updates the managed WUI token block
in the global CSS file configured by `wui.json`.

## Component addresses

`add` and `view` accept any of these:

```bash
wui add button                              # bare name → the default registry
wui add @wui/button                         # explicit namespace
wui add https://your-host/r/button.json     # a direct URL
wui add ./local/button.json                 # a local file
```

Namespaces are configured in `wui.json` → `registries`, so you can mix several
registries in one project:

```json
{
  "registries": {
    "@wui": "https://ui.wzx.wang/r/{name}.json",
    "@acme": "https://acme.internal/r/{name}.json"
  }
}
```

Where files land is controlled by `wui.json` → `aliases` (`ui`, `components`,
`lib`, `hooks`, `utils`). The `@/` alias is resolved from your `tsconfig.json`
`paths`, falling back to `src/` and then the project root.

## License

MIT
