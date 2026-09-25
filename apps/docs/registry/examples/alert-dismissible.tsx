"use client"

import * as React from "react"
import { RotateCcwIcon } from "lucide-react"

import { Alert, type AlertVariant } from "@/registry/ui/alert"
import { Button } from "@/registry/ui/button"

const notices: Array<{
  id: string
  variant: AlertVariant
  title: string
  description: string
}> = [
  {
    id: "maintenance",
    variant: "info",
    title: "计划维护",
    description: "本周日 02:00 起数据库将切换为只读，预计持续 30 分钟。",
  },
  {
    id: "quota",
    variant: "warning",
    title: "存储即将用尽",
    description: "对象存储已使用 88%，建议清理 30 天前的构建产物。",
  },
  {
    id: "invoice",
    variant: "success",
    title: "发票已开具",
    description: "9 月账单的电子发票已发送至财务邮箱。",
  },
]

export default function AlertDismissible() {
  const [dismissed, setDismissed] = React.useState<string[]>([])

  return (
    <div className="w-full max-w-lg">
      {notices.map((notice) => (
        <Alert
          key={notice.id}
          closable
          variant={notice.variant}
          title={notice.title}
          visible={!dismissed.includes(notice.id)}
          onVisibleChange={(visible) => {
            if (!visible) setDismissed((current) => [...current, notice.id])
          }}
          // 间距放在 Alert 内部，收起时随高度一起过渡，避免残留空隙。
          className="mb-3"
        >
          {notice.description}
        </Alert>
      ))}
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground text-xs">
          已关闭 {dismissed.length} / {notices.length} 条提示
        </p>
        <Button
          variant="ghost"
          size="sm"
          disabled={dismissed.length === 0}
          onClick={() => setDismissed([])}
        >
          <RotateCcwIcon />
          全部恢复
        </Button>
      </div>
    </div>
  )
}
