"use client"

import * as React from "react"
import { Loader2Icon } from "lucide-react"

import { Button } from "@/registry/ui/button"
import { MessageProvider, useMessage } from "@/registry/ui/message"

export default function MessageDurationDemo() {
  return (
    <MessageProvider>
      <MessageDurationButtons />
    </MessageProvider>
  )
}

function MessageDurationButtons() {
  const message = useMessage()
  const [loading, setLoading] = React.useState(false)

  const handleAsyncAction = () => {
    setLoading(true)
    const id = message.open({
      description: (
        <span className="flex items-center gap-2">
          <Loader2Icon className="size-4 animate-spin text-primary" />
          正在导出数据报表，请稍候...
        </span>
      ),
      duration: 0,
      icon: false,
      closable: false,
    })

    setTimeout(() => {
      message.dismiss(id)
      message.success("报表导出完成，已自动触发下载！", { duration: 4000 })
      setLoading(false)
    }, 2500)
  }

  return (
    <div className="flex flex-wrap items-center justify-center gap-2.5">
      <Button
        variant="outline"
        size="sm"
        onClick={() =>
          message.info("此消息将在 6 秒后自动消失", { duration: 6000 })
        }
      >
        长延时 (6s)
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={() =>
          message.open({
            description: "此消息不会自动关闭，需手动点击关闭按钮。",
            duration: 0,
            closable: true,
            variant: "warning",
          })
        }
      >
        不自动消失 (duration: 0)
      </Button>

      <Button
        size="sm"
        disabled={loading}
        onClick={handleAsyncAction}
      >
        模拟异步流程
      </Button>
    </div>
  )
}
