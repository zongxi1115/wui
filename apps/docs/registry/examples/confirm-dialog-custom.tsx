"use client"

import * as React from "react"
import { AlertCircleIcon, ShieldAlertIcon } from "lucide-react"

import { Button } from "@/registry/ui/button"
import { ConfirmDialog } from "@/registry/components/confirm-dialog"

export default function ConfirmDialogCustom() {
  const [open, setOpen] = React.useState(false)

  return (
    <div className="flex flex-col items-center gap-4">
      <Button variant="outline" onClick={() => setOpen(true)}>
        <ShieldAlertIcon />
        重置组织访问令牌 (受控模式)
      </Button>

      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        title="强制重置所有活跃 Token？"
        description="重置后，所有正在连接的 SDK 客户端、开发机以及 CI/CD 流水线都将即刻失效并断开连接。"
        confirmLabel="强制重置"
        cancelLabel="暂不处理"
        variant="destructive"
        onConfirm={async () => {
          await new Promise((resolve) => setTimeout(resolve, 1000))
        }}
      >
        <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-600 dark:text-amber-400">
          <div className="flex items-start gap-2">
            <AlertCircleIcon className="mt-0.5 size-4 shrink-0" />
            <div className="space-y-1">
              <p className="font-semibold">影响范围评估：</p>
              <ul className="list-disc pl-4 space-y-0.5 text-muted-foreground">
                <li>38 个正在运行的微服务实例</li>
                <li>5 个生产环境流水线任务</li>
              </ul>
            </div>
          </div>
        </div>
      </ConfirmDialog>
    </div>
  )
}
