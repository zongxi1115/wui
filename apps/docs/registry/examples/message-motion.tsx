"use client"

import { Button } from "@/registry/ui/button"
import { MessageProvider, useMessage } from "@/registry/ui/message"

export default function MessageMotion() {
  return (
    <MessageProvider
      position="top-right"
      gap={12}
      motion={{ offset: 24, scale: 0.9, blur: 8, damping: 28, stiffness: 350 }}
    >
      <MessageMotionButton />
    </MessageProvider>
  )
}

function MessageMotionButton() {
  const message = useMessage()

  return (
    <Button
      variant="outline"
      onClick={() =>
        message.success("带高弹性物理弹簧微动效的提示消息", {
          opacity: 0.95,
          motion: { offset: 32, scale: 0.88, blur: 12 },
        })
      }
    >
      触发高弹性动效消息 (Top-Right)
    </Button>
  )
}
