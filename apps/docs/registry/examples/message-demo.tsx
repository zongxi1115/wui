"use client"

import { Button } from "@/registry/ui/button"
import {
  MessageProvider,
  useMessage,
  type MessagePosition,
} from "@/registry/ui/message"

const positions: Array<{ value: MessagePosition; label: string }> = [
  { value: "top-left", label: "Top left" },
  { value: "top", label: "Top" },
  { value: "top-right", label: "Top right" },
  { value: "bottom-left", label: "Bottom left" },
  { value: "bottom", label: "Bottom" },
  { value: "bottom-right", label: "Bottom right" },
]

export default function MessageDemo() {
  return (
    <MessageProvider>
      <MessagePositionButtons />
    </MessageProvider>
  )
}

function MessagePositionButtons() {
  const message = useMessage()

  return (
    <div className="grid w-full max-w-md grid-cols-3 gap-2">
      {positions.map((position) => (
        <Button
          key={position.value}
          variant="outline"
          size="sm"
          onClick={() =>
            message.success("Your changes have been saved.", {
              title: position.label,
              position: position.value,
            })
          }
        >
          {position.label}
        </Button>
      ))}
    </div>
  )
}
