"use client"

import { Button } from "@/registry/ui/button"
import { MessageProvider, useMessage } from "@/registry/ui/message"

export default function MessageMotion() {
  return (
    <MessageProvider
      position="top-right"
      gap={12}
      motion={{ offset: 24, scale: 0.92, blur: 10, damping: 30 }}
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
        message.success("Uploaded with custom motion.", {
          opacity: 0.82,
          motion: { initialOpacity: 0.2, exitOpacity: 0.1 },
        })
      }
    >
      Show custom message
    </Button>
  )
}
