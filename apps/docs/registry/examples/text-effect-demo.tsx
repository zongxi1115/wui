"use client"

import * as React from "react"
import { RotateCw } from "lucide-react"

import { Button } from "@/registry/ui/button"
import { TextEffect } from "@/registry/ui/text-effect"

export default function TextEffectDemo() {
  const [trigger, setTrigger] = React.useState(true)

  function replay() {
    setTrigger(false)
    window.setTimeout(() => setTrigger(true), 100)
  }

  return (
    <div className="flex w-full max-w-md flex-col items-center justify-center gap-6 rounded-xl border border-border bg-card p-8 text-center shadow-xs">
      <div className="space-y-2">
        <TextEffect
          as="h3"
          per="char"
          preset="fade-in-blur"
          trigger={trigger}
          className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
        >
          Crafted with Motion
        </TextEffect>
        <TextEffect
          as="p"
          per="word"
          preset="fade"
          delay={0.3}
          trigger={trigger}
          className="text-sm leading-relaxed text-muted-foreground"
        >
          Elevate typography with progressive entrance animations that engage
          users seamlessly.
        </TextEffect>
      </div>

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={replay}
        className="gap-1.5 text-xs font-medium"
      >
        <RotateCw className="size-3.5" />
        重新播放 Replay
      </Button>
    </div>
  )
}
