/**
 * Streamable-HTTP MCP endpoint — the zero-install way to point an agent at this
 * registry:
 *
 *   claude mcp add --transport http wui https://<site>/api/mcp
 *
 * Stateless: every request is self-contained, so no session store is needed and
 * a plain JSON response is returned instead of an SSE stream (both are allowed
 * by the spec). Tool definitions and handlers are shared with the stdio server
 * in packages/mcp.
 */
import path from "node:path"

import { callTool, createFileLoader, Registry, tools } from "@wui-design/mcp/core"

export const dynamic = "force-dynamic"

const PROTOCOL_VERSION = "2025-06-18"
const SUPPORTED_PROTOCOLS = new Set([PROTOCOL_VERSION, "2025-03-26", "2024-11-05"])

const registry = new Registry(
  createFileLoader(path.join(process.cwd(), "public", "r"))
)

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Mcp-Protocol-Version, Mcp-Session-Id",
}

type JsonRpcId = string | number | null

interface JsonRpcRequest {
  jsonrpc: "2.0"
  id?: JsonRpcId
  method: string
  params?: Record<string, unknown>
}

function result(id: JsonRpcId, value: unknown) {
  return { jsonrpc: "2.0" as const, id, result: value }
}

function error(id: JsonRpcId, code: number, message: string) {
  return { jsonrpc: "2.0" as const, id, error: { code, message } }
}

async function handle(req: JsonRpcRequest): Promise<unknown | null> {
  const id = req.id ?? null

  switch (req.method) {
    case "initialize": {
      const asked = String(req.params?.protocolVersion ?? "")
      return result(id, {
        protocolVersion: SUPPORTED_PROTOCOLS.has(asked) ? asked : PROTOCOL_VERSION,
        capabilities: { tools: { listChanged: false } },
        serverInfo: { name: "wui", version: "0.1.0" },
        instructions:
          "wui 组件库。写任何用到 wui 组件的代码前，先调用 wui_overview 了解约定，再用 wui_get_component 获取准确的 props。",
      })
    }

    case "ping":
      return result(id, {})

    case "tools/list":
      return result(id, {
        tools: tools.map(({ name, description, inputSchema }) => ({
          name,
          description,
          inputSchema,
        })),
      })

    case "tools/call": {
      const name = String(req.params?.name ?? "")
      const args = (req.params?.arguments ?? {}) as Record<string, unknown>
      const { text, isError } = await callTool(name, args, registry)
      return result(id, { content: [{ type: "text", text }], isError })
    }

    default:
      // Notifications (no id) need no reply — `notifications/initialized` etc.
      if (req.id === undefined) return null
      return error(id, -32601, `Method not found: ${req.method}`)
  }
}

export async function POST(request: Request) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return Response.json(error(null, -32700, "Parse error"), {
      status: 400,
      headers: CORS,
    })
  }

  const batch = Array.isArray(body) ? body : [body]
  const replies = (
    await Promise.all(batch.map((m) => handle(m as JsonRpcRequest)))
  ).filter((r) => r !== null)

  // An all-notification payload gets an empty 202, per the transport spec.
  if (!replies.length) return new Response(null, { status: 202, headers: CORS })

  return Response.json(Array.isArray(body) ? replies : replies[0], {
    headers: CORS,
  })
}

/** The spec allows a server with no server-initiated messages to refuse GET. */
export function GET() {
  return new Response("Method Not Allowed", { status: 405, headers: CORS })
}

export function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS })
}
