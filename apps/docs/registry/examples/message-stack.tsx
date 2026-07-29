"use client"

import * as React from "react"

import { Button } from "@/registry/ui/button"
import { MessageProvider, useMessage } from "@/registry/ui/message"

const feedback = [
  ["info", "New comments are available."],
  ["success", "Changes saved successfully."],
  ["warning", "Storage space is running low."],
  ["error", "The request could not be completed."],
] as const

export default function MessageStack() {
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
  const index = React.useRef(0)

  function addMessage() {
    const [variant, description] = feedback[index.current % feedback.length]
    index.current += 1
    message[variant](description)
  }

  return (
    <div className="flex flex-wrap justify-center gap-2">
      <Button variant="outline" onClick={addMessage}>
        Add message
      </Button>
      <Button variant="ghost" onClick={() => message.clear()}>
        Clear all
      </Button>
    </div>
  )
}
