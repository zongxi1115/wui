"use client"

import * as React from "react"
import { Volume2Icon } from "lucide-react"

import { Slider } from "@/registry/ui/slider"

export default function SliderDemo() {
  const [volume, setVolume] = React.useState([62])

  return (
    <div className="w-full max-w-sm space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="flex items-center gap-2 font-medium">
          <Volume2Icon className="size-4" />
          Output volume
        </span>
        <span className="tabular-nums text-muted-foreground">{volume[0]}%</span>
      </div>
      <Slider
        value={volume}
        onValueChange={setVolume}
        formatValue={(value) => `${value}%`}
        aria-label="Output volume"
      />
      <p className="text-xs text-muted-foreground">Hover the track, then drag or use the arrow keys.</p>
    </div>
  )
}
