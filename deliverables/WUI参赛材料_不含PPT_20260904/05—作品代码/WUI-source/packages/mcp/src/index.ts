/**
 * wui-mcp — stdio MCP server exposing the wui component library to LLM agents.
 *
 *   pnpm dlx @wui-design/mcp@latest                                  # the public registry
 *   pnpm dlx @wui-design/mcp@latest --registry https://host/r        # a self-hosted one
 *   pnpm dlx @wui-design/mcp@latest --dir ./apps/docs/public/r       # a local checkout
 */
import { createRequire } from "node:module"

import { Server } from "@modelcontextprotocol/sdk/server/index.js"
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js"
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js"

import {
  callTool,
  createFileLoader,
  createRemoteLoader,
  DEFAULT_REGISTRY_URL,
  Registry,
  tools,
} from "./core/index"

function flag(name: string): string | undefined {
  const i = process.argv.indexOf(`--${name}`)
  if (i !== -1 && process.argv[i + 1]) return process.argv[i + 1]
  const inline = process.argv.find((a) => a.startsWith(`--${name}=`))
  return inline?.slice(name.length + 3)
}

const dir = flag("dir") ?? process.env.WUI_REGISTRY_DIR
const url = flag("registry") ?? process.env.WUI_REGISTRY_URL ?? DEFAULT_REGISTRY_URL
const registry = new Registry(dir ? createFileLoader(dir) : createRemoteLoader(url))

// dist/index.js sits one level under the package root, so this resolves the
// published package.json — keeping the advertised version in sync with npm.
const { version } = createRequire(import.meta.url)("../package.json") as {
  version: string
}

const server = new Server(
  { name: "wui", version },
  { capabilities: { tools: {} } }
)

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: tools.map(({ name, description, inputSchema }) => ({
    name,
    description,
    inputSchema,
  })),
}))

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { text, isError } = await callTool(
    request.params.name,
    (request.params.arguments ?? {}) as Record<string, unknown>,
    registry
  )
  return { content: [{ type: "text", text }], isError }
})

await server.connect(new StdioServerTransport())
// stdout is the transport — diagnostics must go to stderr.
console.error(`wui mcp ready (${dir ? `dir:${dir}` : url})`)
