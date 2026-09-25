import {
  CodeBlock,
  CodeBlockActions,
  CodeBlockBody,
  CodeBlockCopy,
  CodeBlockHeader,
  CodeBlockTab,
  CodeBlockTabs,
} from "@/registry/ui/code-block"

const files = [
  {
    name: "route.ts",
    code: `import { verifySignature } from "@/lib/webhook"

export async function POST(request: Request) {
  const payload = await request.text()
  const event = verifySignature(payload, request.headers)

  if (event.type === "payment.succeeded") {
    await markOrderPaid(event.data.orderId)
  }

  return Response.json({ received: true })
}`,
  },
  {
    name: "webhook.ts",
    code: `import { createHmac, timingSafeEqual } from "node:crypto"

export function verifySignature(payload: string, headers: Headers) {
  const signature = headers.get("x-signature") ?? ""
  const expected = createHmac("sha256", process.env.WEBHOOK_SECRET!)
    .update(payload)
    .digest("hex")

  if (!timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) {
    throw new Error("Invalid signature")
  }
  return JSON.parse(payload)
}`,
  },
  {
    name: ".env",
    code: `WEBHOOK_SECRET=whsec_3f9a0c1e
PAYMENT_API_BASE=https://api.example.com/v1`,
  },
]

export default function CodeBlockTabsDemo() {
  return (
    <CodeBlock defaultValue="route.ts" className="w-full max-w-xl">
      <CodeBlockHeader>
        <CodeBlockTabs aria-label="文件">
          {files.map((file) => (
            <CodeBlockTab key={file.name} value={file.name}>
              {file.name}
            </CodeBlockTab>
          ))}
        </CodeBlockTabs>
        <CodeBlockActions>
          <CodeBlockCopy />
        </CodeBlockActions>
      </CodeBlockHeader>
      {files.map((file) => (
        <CodeBlockBody key={file.name} value={file.name} code={file.code} />
      ))}
    </CodeBlock>
  )
}
