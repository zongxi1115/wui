import { WebStandardStreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js"
import type { Registry } from "./core/registry"
import { createMcpServer } from "./server"

/** One transport per request: SDK stateless transports cannot be reused. */
export async function handleHttpRequest(request: Request, registry: Registry) {
  let parsedBody: unknown
  try {
    parsedBody = await request.json()
  } catch {
    return Response.json(
      {
        jsonrpc: "2.0",
        id: null,
        error: { code: -32700, message: "Parse error: Invalid JSON" },
      },
      { status: 400 }
    )
  }
  // The SDK also accepts legacy batches. This endpoint uses one message per
  // POST, as specified by Streamable HTTP from protocol version 2025-06-18.
  if (Array.isArray(parsedBody)) {
    return Response.json(
      {
        jsonrpc: "2.0",
        id: null,
        error: {
          code: -32600,
          message: "Send one JSON-RPC message per POST request",
        },
      },
      { status: 400 }
    )
  }
  const server = createMcpServer(registry)
  const transport = new WebStandardStreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
    enableJsonResponse: true,
  })
  try {
    await server.connect(transport)
    return await transport.handleRequest(request, { parsedBody })
  } finally {
    // JSON responses are complete when handleRequest resolves; no SSE remains.
    await server.close()
  }
}
