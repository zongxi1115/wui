"use client"

import * as React from "react"

import {
  CodeBlock,
  CodeBlockActions,
  CodeBlockBody,
  CodeBlockCopy,
  CodeBlockHeader,
  CodeBlockTitle,
} from "@/registry/ui/code-block"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/registry/ui/tabs"

const code = `import { createHmac, timingSafeEqual } from "node:crypto"

export function verifySignature(payload: string, headers: Headers) {
  const signature = headers.get("x-signature") ?? ""
  const expected = createHmac("sha256", process.env.WEBHOOK_SECRET!)
    .update(payload)
    .digest("hex")

  if (!timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) {
    throw new Error("Invalid signature")
  }
  return JSON.parse(payload)
}`

const steps = [
  {
    value: "read",
    label: "读取签名",
    lines: [4],
    description: "从请求头取出支付平台附带的 x-signature，缺失时按空字符串处理，后续比对必然失败。",
  },
  {
    value: "compute",
    label: "计算摘要",
    lines: ["5-7"],
    description: "用只保存在服务端的 WEBHOOK_SECRET 对原始请求体做 HMAC-SHA256，得到期望签名。",
  },
  {
    value: "compare",
    label: "安全比对",
    lines: ["9-11"],
    description: "timingSafeEqual 以恒定耗时比较两段签名，避免攻击者通过响应时间逐位猜测。",
  },
]

export default function CodeBlockWalkthrough() {
  const [step, setStep] = React.useState(steps[0].value)
  const active = steps.find((item) => item.value === step) ?? steps[0]

  return (
    <div className="w-full max-w-xl">
      <Tabs value={step} onValueChange={setStep}>
        <TabsList>
          {steps.map((item, index) => (
            <TabsTrigger key={item.value} value={item.value}>
              <span className="text-muted-foreground tabular-nums">
                {index + 1}
              </span>
              {item.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {steps.map((item) => (
          <TabsContent
            key={item.value}
            value={item.value}
            className="mt-3 min-h-10 text-sm leading-5 text-muted-foreground"
          >
            {item.description}
          </TabsContent>
        ))}
      </Tabs>

      <CodeBlock
        variant="bordered"
        highlightLines={active.lines}
        className="mt-4"
      >
        <CodeBlockHeader>
          <CodeBlockTitle>lib/webhook.ts</CodeBlockTitle>
          <CodeBlockActions>
            <CodeBlockCopy />
          </CodeBlockActions>
        </CodeBlockHeader>
        <CodeBlockBody code={code} />
      </CodeBlock>
    </div>
  )
}
