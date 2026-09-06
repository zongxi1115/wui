"use client"

import * as React from "react"

import { Button } from "@/registry/ui/button"
import { MessageProvider, useMessage } from "@/registry/ui/message"

const feedbackList = [
  { variant: "info" as const, text: "发现 3 个待审查的拉取请求 (PR)。" },
  { variant: "success" as const, text: "已成功推送到远程分支 origin/main。" },
  { variant: "warning" as const, text: "分支存在 1 处未解决的合并冲突。" },
  { variant: "destructive" as const, text: "自动化集成测试 (CI) 校验未通过。" },
]

export default function MessageStackDemo() {
  return (
    <MessageProvider
      duration={0}
      maxCount={6}
      stacked
      maxVisibleMessages={3}
      scaleFactor={0.05}
      expandOnHover
      gap={8}
      dragThreshold={64}
    >
      <MessageStackControls />
    </MessageProvider>
  )
}

function MessageStackControls() {
  const message = useMessage()
  const count = React.useRef(0)

  function addNextMessage() {
    const item = feedbackList[count.current % feedbackList.length]
    count.current += 1

    message.open({
      variant: item.variant,
      description: `${item.text} (#${count.current})`,
      closable: true,
    })
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex flex-wrap justify-center gap-2">
        <Button variant="outline" size="sm" onClick={addNextMessage}>
          添加一条堆叠消息
        </Button>
        <Button variant="ghost" size="sm" onClick={() => message.clear()}>
          清空所有消息
        </Button>
      </div>
      <p className="text-xs text-muted-foreground text-center max-w-sm">
        💡 提示：将鼠标悬停在上方消息卡片堆上可展开为完整列表；向左或向右拖动可滑动移除最顶层消息。
      </p>
    </div>
  )
}
