"use client"

import { Button } from "@/registry/ui/button"
import { MessagePosition, MessageProvider, useMessage } from "@/registry/ui/message"

export default function MessagePositions() {
  return (
    <MessageProvider>
      <MessagePositionButtons />
    </MessageProvider>
  )
}

function MessagePositionButtons() {
  const message = useMessage()

  const trigger = (position: MessagePosition, label: string) => {
    message.open({
      position,
      description: `${label}弹出的消息（${position}）`,
      variant: "info",
    })
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-w-lg w-full">
      <Button
        variant="outline"
        size="sm"
        onClick={() => trigger("top-left", "左上方")}
      >
        左上
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => trigger("top", "正上方")}
      >
        顶部（默认）
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => trigger("top-right", "右上方")}
      >
        右上
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => trigger("bottom-left", "左下方")}
      >
        左下
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => trigger("bottom", "正下方")}
      >
        底部
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => trigger("bottom-right", "右下方")}
      >
        右下
      </Button>
    </div>
  )
}
