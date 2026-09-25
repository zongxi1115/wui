"use client"

import * as React from "react"
import { RotateCcwIcon } from "lucide-react"

import { Button } from "@/registry/ui/button"
import {
  AiTool,
  AiToolCode,
  AiToolContent,
  AiToolLabel,
  AiToolSection,
  AiToolTrigger,
  type AiToolStatus,
} from "@/registry/ui/ai-tool"

export default function AiToolApproval() {
  const [status, setStatus] = React.useState<AiToolStatus>("approval")

  React.useEffect(() => {
    if (status !== "running") return
    const timer = window.setTimeout(() => setStatus("success"), 1600)
    return () => window.clearTimeout(timer)
  }, [status])

  return (
    <div className="mx-auto w-full max-w-xl space-y-3">
      <AiTool status={status} defaultOpen>
        <AiToolTrigger name="rotate_api_key" />
        <AiToolContent>
          <AiToolSection>
            <AiToolLabel>调用参数</AiToolLabel>
            <AiToolCode>{`{
  "service": "payment-gateway",
  "environment": "production",
  "gracePeriodHours": 24,
  "revokeOldKey": true
}`}</AiToolCode>
          </AiToolSection>

          {status === "approval" ? (
            <AiToolSection className="bg-warning-subtle">
              <p className="text-xs leading-5 text-foreground">
                将重新生成生产环境支付密钥，旧密钥在 24 小时后失效。执行前需要你的确认。
              </p>
              <div className="mt-3 flex items-center gap-2">
                <Button size="sm" onClick={() => setStatus("running")}>
                  批准执行
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setStatus("denied")}
                >
                  拒绝
                </Button>
              </div>
            </AiToolSection>
          ) : null}

          {status === "running" ? (
            <AiToolSection className="text-xs text-muted-foreground">
              正在通过密钥管理服务轮换密钥…
            </AiToolSection>
          ) : null}

          {status === "success" ? (
            <AiToolSection>
              <AiToolLabel>执行结果</AiToolLabel>
              <AiToolCode>{`{
  "keyId": "key_prod_89f02c91a",
  "status": "active",
  "oldKeyExpiresAt": "2026-09-27T14:30:00Z"
}`}</AiToolCode>
            </AiToolSection>
          ) : null}

          {status === "denied" ? (
            <AiToolSection className="text-xs text-muted-foreground">
              已拒绝本次调用，Agent 将改为输出手动操作步骤。
            </AiToolSection>
          ) : null}
        </AiToolContent>
      </AiTool>

      {status === "success" || status === "denied" ? (
        <Button size="sm" variant="ghost" onClick={() => setStatus("approval")}>
          <RotateCcwIcon />
          重新演示
        </Button>
      ) : null}
    </div>
  )
}
