"use client"

import * as React from "react"

import { Button } from "@/registry/ui/button"
import { Alert } from "@/registry/ui/alert"

export default function AlertDismissible() {
  const [visible, setVisible] = React.useState(true)

  return (
    <div className="grid w-full max-w-lg gap-3">
      <Alert
        visible={visible}
        onVisibleChange={setVisible}
        closable
        title="Notifications paused"
      >
        You will not receive updates until tomorrow morning.
      </Alert>
      {!visible ? (
        <Button
          variant="outline"
          size="sm"
          className="w-fit"
          onClick={() => setVisible(true)}
        >
          Show alert
        </Button>
      ) : null}
    </div>
  )
}
