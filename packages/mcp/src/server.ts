import packageInfo from "../package.json"
import { Server } from "@modelcontextprotocol/sdk/server/index.js"
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js"
import { callTool, toolDefinitions } from "./core/tools"
import type { Registry } from "./core/registry"

/** Both transports expose the same instructions, schemas and handlers. */
export function createMcpServer(registry: Registry) {
  const server = new Server(
    { name: "wui", version: packageInfo.version },
    {
      capabilities: { tools: { listChanged: false } },
      instructions:
        "wui 组件库。首次编写 wui 代码前调用 wui_overview，再用 wui_search_components、wui_get_component 和 wui_get_example 获取 API 与用法。",
    }
  )
  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: toolDefinitions,
  }))
  server.setRequestHandler(CallToolRequestSchema, async ({ params }) => {
    const { text, isError } = await callTool(
      params.name,
      params.arguments ?? {},
      registry
    )
    return { content: [{ type: "text", text }], isError }
  })
  return server
}
