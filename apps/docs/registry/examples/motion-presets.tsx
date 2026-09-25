"use client"

import * as React from "react"
import { RotateCcwIcon } from "lucide-react"

import { Button } from "@/registry/ui/button"
import { Motion, type MotionPreset } from "@/registry/ui/motion"

const presets: MotionPreset[] = [
  "fade",
  "scale",
  "slide-up",
  "slide-down",
  "slide-left",
  "slide-right",
  "pop",
  "blur",
  "blur-up",
  "zoom-in",
  "zoom-out",
  "flip",
]

export default function MotionPresets() {
  const [key, setKey] = React.useState(0)

  return (
    <div className="flex w-full max-w-xl flex-col gap-4">
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
        {presets.map((preset, index) => (
          <button
            key={`${preset}-${key}`}
            type="button"
            onClick={() => setKey((k) => k + 1)}
            className="bg-muted/50 hover:bg-muted focus-visible:ring-ring/50 flex h-20 items-center justify-center rounded-md outline-none transition-colors focus-visible:ring-[3px]"
          >
            <Motion
              preset={preset}
              delay={index * 0.05}
              transition="spring"
              className="bg-background rounded-md border px-3 py-1.5 font-mono text-xs shadow-xs"
            >
              {preset}
            </Motion>
          </button>
        ))}
      </div>
      <Button
        variant="outline"
        size="sm"
        className="self-center"
        onClick={() => setKey((k) => k + 1)}
      >
        <RotateCcwIcon />
        全部重播
      </Button>
    </div>
  )
}
