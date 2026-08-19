"use client"

import * as React from "react"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/registry/ui/collapsible"
import { Input } from "@/registry/ui/input"
import { Button } from "@/registry/ui/button"
import { SlidersIcon, KeyRoundIcon, ShieldAlertIcon } from "lucide-react"

export default function CollapsibleCard() {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <div className="w-full max-w-lg rounded-xl border bg-card p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-semibold">Webhook 事件推送</h4>
          <p className="text-xs text-muted-foreground mt-0.5">
            当工作空间产生关键变更时自动向指定 URL 发送 HTTP POST 请求。
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-medium">接收端点 URL</label>
        <Input
          placeholder="https://api.yourdomain.com/hooks"
          defaultValue="https://ci.infra.internal/hooks/v1/deploy"
        />
      </div>

      <Collapsible open={isOpen} onOpenChange={setIsOpen} className="rounded-lg border">
        <CollapsibleTrigger className="p-3 bg-muted/20 text-xs">
          <div className="flex items-center gap-2">
            <SlidersIcon className="size-3.5 text-muted-foreground" />
            <span className="font-medium">高级安全签名与重试策略配置</span>
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="p-4 space-y-4 border-t text-xs">
            <div className="space-y-1.5">
              <label className="font-medium flex items-center gap-1.5">
                <KeyRoundIcon className="size-3.5 text-muted-foreground" />
                HMAC 密钥签名 (Secret)
              </label>
              <Input
                type="password"
                defaultValue="whsec_98f82a10be74f10a"
                className="font-mono text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-medium flex items-center gap-1.5">
                <ShieldAlertIcon className="size-3.5 text-muted-foreground" />
                重试策略
              </label>
              <p className="text-muted-foreground">
                开启指数退避重试，在目标端点返回 5xx 时最多尝试 5 次重试。
              </p>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>

      <div className="flex justify-end gap-2 pt-2 border-t">
        <Button size="sm" variant="outline">
          发送测试 Ping
        </Button>
        <Button size="sm">保存配置</Button>
      </div>
    </div>
  )
}
