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
      description: `来自 ${label} (${position}) 的通知消息`,
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
        Top Left
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => trigger("top", "正上方")}
      >
        Top (默认)
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => trigger("top-right", "右上方")}
      >
        Top Right
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => trigger("bottom-left", "左下方")}
      >
        Bottom Left
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => trigger("bottom", "正下方")}
      >
        Bottom
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => trigger("bottom-right", "右下方")}
      >
        Bottom Right
      </Button>
    </div>
  )
}
