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
        重置组织访问令牌
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
        <div className="border-warning-border bg-warning-subtle rounded-md border px-3 py-2.5 text-sm">
          <p className="text-warning flex items-center gap-1.5 font-medium">
            <AlertCircleIcon className="size-4 shrink-0" />
            影响范围
          </p>
          <ul className="text-muted-foreground mt-1.5 list-disc space-y-0.5 pl-5">
            <li>38 个正在运行的微服务实例</li>
            <li>5 条生产环境流水线任务</li>
          </ul>
        </div>
      </ConfirmDialog>
    </div>
  )
}
