"use client"

import * as React from "react"

import { Button } from "@/registry/ui/button"
import { TextEffect } from "@/registry/ui/text-effect"

export default function TextEffectDemo() {
  const [trigger, setTrigger] = React.useState(true)

  function replay() {
    setTrigger(false)
    window.setTimeout(() => setTrigger(true), 120)
  }

  return (
    <div className="flex flex-col items-center gap-6 text-center">
      <TextEffect
        as="h3"
        per="char"
        preset="fade-in-blur"
        trigger={trigger}
        className="text-3xl font-semibold tracking-tight"
      >
        Motion with purpose.
      </TextEffect>
      <Button type="button" variant="outline" size="sm" onClick={replay}>
        Replay
      </Button>
    </div>
  )
}
