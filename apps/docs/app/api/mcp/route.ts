import path from "node:path"
import { createFileLoader, Registry } from "@wui-design/mcp/core"
import { handleHttpRequest } from "@wui-design/mcp/http"

export const dynamic = "force-dynamic"

// Deployed artifacts are immutable for the lifetime of this server process.
const registry = new Registry(
  createFileLoader(path.join(process.cwd(), "public", "r")),
  { ttlMs: Infinity }
)

// This public, read-only registry is available to browser-based MCP clients.
const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Mcp-Protocol-Version, Mcp-Session-Id",
}

export async function POST(request: Request) {
  const response = await handleHttpRequest(request, registry)
  for (const [name, value] of Object.entries(CORS))
    response.headers.set(name, value)
  return response
}

/** No server-initiated messages: the transport permits refusing GET. */
export function GET() {
  return new Response("Method Not Allowed", {
    status: 405,
    headers: { ...CORS, Allow: "POST, OPTIONS" },
  })
}

export function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS })
}
