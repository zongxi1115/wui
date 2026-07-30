# @wui-design/mcp

An [MCP](https://modelcontextprotocol.io) server that exposes the
[wui](https://ui.wzx.wang) component library — real props, usage rules, and
working examples — to LLM coding agents, so they stop guessing your API.

## Install

Remote (zero install, recommended):

```bash
claude mcp add --transport http wui https://ui.wzx.wang/api/mcp
```

Over stdio:

```bash
claude mcp add wui -- pnpm dlx @wui-design/mcp@latest
```

<details>
<summary>Cursor / Windsurf / other clients (<code>mcp.json</code>)</summary>

```json
{
  "mcpServers": {
    "wui": { "command": "pnpm", "args": ["dlx", "@wui-design/mcp@latest"] }
  }
}
```

</details>

## Tools

| Tool | Returns |
| --- | --- |
| `wui_overview` | The rules an agent must follow when writing wui code |
| `wui_list_components` | Every component, with its description and categories |
| `wui_get_component` | One component's props, variants, and usage notes |
| `wui_get_component_source` | The full source files, as the CLI would write them |
| `wui_get_example` | A named, runnable example |
| `wui_get_theme_tokens` | The design-token contract (CSS variables) |

## Pointing it elsewhere

Defaults to the public registry. Override with a flag or an env var:

```bash
pnpm dlx @wui-design/mcp@latest --registry https://your-host/r     # a self-hosted registry
pnpm dlx @wui-design/mcp@latest --dir ./apps/docs/public/r         # a local checkout
```

| Flag | Env var |
| --- | --- |
| `--registry <url>` | `WUI_REGISTRY_URL` |
| `--dir <path>` | `WUI_REGISTRY_DIR` |

## Note on `@wui-design/mcp/core`

The `./core` subpath ships as **TypeScript source** so that the docs site and
this stdio server share one implementation without a build step between them.
If you import it directly, your bundler must transpile it (in Next.js, add
`transpilePackages: ["@wui-design/mcp"]`). The default entry (`@wui-design/mcp`) is compiled
JavaScript and has no such requirement.

## License

MIT
