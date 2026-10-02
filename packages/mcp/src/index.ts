/**
 * wui-mcp — stdio MCP server exposing the wui component library to LLM agents.
 *
 *   pnpm dlx @wui-design/mcp@latest                                  # the public registry
 *   pnpm dlx @wui-design/mcp@latest --registry https://host/r        # a self-hosted one
 *   pnpm dlx @wui-design/mcp@latest --dir ./apps/docs/public/r       # a local checkout
 */
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js"
import { createMcpServer } from "./server"

import {
  createFileLoader,
  createRemoteLoader,
  DEFAULT_REGISTRY_URL,
  Registry,
} from "./core/index"

function flag(name: string): string | undefined {
  const i = process.argv.indexOf(`--${name}`)
  if (i !== -1 && process.argv[i + 1]) return process.argv[i + 1]
  const inline = process.argv.find((a) => a.startsWith(`--${name}=`))
  return inline?.slice(name.length + 3)
}

const dir = flag("dir") ?? process.env.WUI_REGISTRY_DIR
const url =
  flag("registry") ?? process.env.WUI_REGISTRY_URL ?? DEFAULT_REGISTRY_URL
const registry = new Registry(
  dir ? createFileLoader(dir) : createRemoteLoader(url)
)

const server = createMcpServer(registry)

await server.connect(new StdioServerTransport())
// stdout is the transport — diagnostics must go to stderr.
console.error(`wui mcp ready (${dir ? `dir:${dir}` : url})`)
