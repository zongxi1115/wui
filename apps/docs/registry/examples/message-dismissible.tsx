"use client"

import * as React from "react"

import { Button } from "@/registry/ui/button"
import { Message } from "@/registry/ui/message"

export default function MessageDismissible() {
  const [visible, setVisible] = React.useState(true)

  return (
    <div className="grid w-full max-w-lg gap-3">
      <Message
        visible={visible}
        onVisibleChange={setVisible}
        closable
        title="Notifications paused"
      >
        You will not receive updates until tomorrow morning.
      </Message>
      {!visible ? (
        <Button variant="outline" size="sm" className="w-fit" onClick={() => setVisible(true)}>
          Show message
        </Button>
      ) : null}
    </div>
  )
}
