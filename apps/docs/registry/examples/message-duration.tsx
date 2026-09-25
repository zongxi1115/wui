"use client"

import * as React from "react"

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
  const [exporting, setExporting] = React.useState(false)

  const exportReport = () => {
    setExporting(true)
    const id = message.loading("正在导出 9 月经营报表…")

    window.setTimeout(() => {
      // 原地把加载消息变为成功消息，并按默认时长自动关闭。
      message.update(id, {
        variant: "success",
        description: "报表导出完成，已开始下载。",
      })
      setExporting(false)
    }, 2400)
  }

  return (
    <div className="flex flex-wrap items-center justify-center gap-2.5">
      <Button
        variant="outline"
        size="sm"
        onClick={() =>
          message.info("此消息将在 6 秒后关闭，悬停可暂停计时。", { duration: 6000 })
        }
      >
        停留 6 秒
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() =>
          message.warning("证书将在 3 天后过期，请尽快续期。", {
            duration: 0,
            closable: true,
          })
        }
      >
        不自动关闭
      </Button>
      <Button size="sm" disabled={exporting} onClick={exportReport}>
        导出报表
      </Button>
    </div>
  )
}
