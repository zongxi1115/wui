"use client"

import * as React from "react"
import { Trash2Icon } from "lucide-react"

import { Button } from "@/registry/ui/button"
import { ConfirmDialog } from "@/registry/components/confirm-dialog"

export default function ConfirmDialogDemo() {
  return (
    <ConfirmDialog
      trigger={
        <Button variant="destructive">
          <Trash2Icon />
          删除项目
        </Button>
      }
      title="确定要删除该项目吗？"
      description="此操作不可撤销。项目内的所有数据与历史构建记录都将被永久清理。"
      confirmLabel="确认删除"
      cancelLabel="取消"
      variant="destructive"
      onConfirm={() => {
        // 执行同步删除逻辑
      }}
    />
  )
}
