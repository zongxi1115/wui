"use client"

import * as React from "react"
import { RefreshCwIcon } from "lucide-react"

import { Button } from "@/registry/ui/button"
import { ConfirmDialog } from "@/registry/components/confirm-dialog"

export default function ConfirmDialogAsync() {
  return (
    <ConfirmDialog
      trigger={
        <Button variant="outline">
          <RefreshCwIcon />
          回滚服务版本
        </Button>
      }
      title="确认回滚至上一稳定版本？"
      description="回滚操作将重启集群中运行的 12 个微服务容器，预计需要 30 秒服务预热。"
      confirmLabel="开始回滚"
      cancelLabel="放弃"
      variant="default"
      onConfirm={async () => {
        // 模拟调用远端回滚 API，ConfirmDialog 将自动切换为 loading 状态
        await new Promise((resolve) => setTimeout(resolve, 1500))
      }}
    />
  )
}
