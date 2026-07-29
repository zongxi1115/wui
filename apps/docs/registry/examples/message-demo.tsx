"use client"

import { Button } from "@/registry/ui/button"
import { MessageProvider, useMessage } from "@/registry/ui/message"

export default function MessageDemo() {
  return (
    <MessageProvider>
      <MessageTypeButtons />
    </MessageProvider>
  )
}

function MessageTypeButtons() {
  const message = useMessage()

  return (
    <div className="flex w-full max-w-xl flex-wrap justify-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => message.info("A new version is available.")}
      >
        Info
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => message.success("Changes saved successfully.")}
      >
        Success
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => message.warning("Storage space is running low.")}
      >
        Warning
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => message.error("The request could not be completed.")}
      >
        Error
      </Button>
    </div>
  )
}
