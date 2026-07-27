"use client"

import * as React from "react"

import { Button } from "@/registry/ui/button"
import { TextScramble } from "@/registry/ui/text-scramble"

export default function TextScrambleDemo() {
  const [trigger, setTrigger] = React.useState(true)

  function replay() {
    setTrigger(false)
    window.setTimeout(() => setTrigger(true), 50)
  }

  return (
    <Button
      type="button"
      variant="outline"
      className="h-auto flex-col items-start px-5 py-3 text-left"
      onClick={replay}
    >
      <span className="text-muted-foreground mb-2 block text-xs">
        Click to regenerate
      </span>
      <TextScramble as="span" trigger={trigger} characterSet="01#{}[]&*">
        Generating the interface...
      </TextScramble>
    </Button>
  )
}
