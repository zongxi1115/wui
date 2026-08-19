"use client"

import * as React from "react"
import { CheckIcon, XIcon, ShieldAlertIcon } from "lucide-react"

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

  const handleApprove = () => {
    setStatus("running")
    setTimeout(() => {
      setStatus("success")
    }, 1500)
  }

  const handleDeny = () => {
    setStatus("denied")
  }

  const handleReset = () => {
    setStatus("approval")
  }

  return (
    <div className="w-full max-w-xl mx-auto space-y-4">
      <div className="text-xs text-muted-foreground mb-1">
        当 AI Agent 尝试执行具有副作用的高风险操作时，通过 <code>approval</code> 状态要求用户确认：
      </div>

      <AiTool status={status} defaultOpen={true}>
        <AiToolTrigger name="rotate_production_api_key" />
        <AiToolContent>
          <AiToolSection>
            <AiToolLabel>调用参数</AiToolLabel>
            <AiToolCode>{`{
  "service": "stripe_payment_gateway",
  "environment": "production",
  "gracePeriodHours": 24,
  "revokeOldKey": true
}`}</AiToolCode>
          </AiToolSection>

          {status === "approval" && (
            <AiToolSection className="bg-warning/5 border-t border-warning/20">
              <div className="flex items-center gap-2 text-xs font-semibold text-warning-foreground mb-2">
                <ShieldAlertIcon className="size-4 text-warning" />
                <span>高危操作：此操作将重新生成生产环境支付密钥，并于 24 小时后废弃旧密钥。</span>
              </div>
              <div className="flex items-center gap-2 mt-3">
                <Button size="sm" variant="default" onClick={handleApprove}>
                  <CheckIcon className="size-3.5 mr-1" />
                  批准执行
                </Button>
                <Button size="sm" variant="outline" onClick={handleDeny}>
                  <XIcon className="size-3.5 mr-1" />
                  拒绝操作
                </Button>
              </div>
            </AiToolSection>
          )}

          {status === "running" && (
            <AiToolSection>
              <AiToolLabel>执行中</AiToolLabel>
              <span className="text-xs text-muted-foreground">正在连接密钥管理服务 (KMS) 进行安全轮换…</span>
            </AiToolSection>
          )}

          {status === "success" && (
            <AiToolSection>
              <AiToolLabel>执行结果</AiToolLabel>
              <div className="space-y-1">
                <div className="text-xs text-success font-medium">密钥轮换成功！</div>
                <AiToolCode>{`{
  "keyId": "key_prod_89f02c91a",
  "status": "active",
  "validUntil": "2027-08-19T14:30:00Z"
}`}</AiToolCode>
              </div>
            </AiToolSection>
          )}

          {status === "denied" && (
            <AiToolSection>
              <AiToolLabel>处理结果</AiToolLabel>
              <span className="text-xs text-muted-foreground">用户已拒绝执行该高危工具调用，已中止流程。</span>
            </AiToolSection>
          )}
        </AiToolContent>
      </AiTool>

      {status !== "approval" && (
        <Button size="sm" variant="ghost" className="text-xs" onClick={handleReset}>
          重置为等待审批状态
        </Button>
      )}
    </div>
  )
}
