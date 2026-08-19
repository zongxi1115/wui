"use client"

import * as React from "react"
import { Volume2Icon, VolumeXIcon } from "lucide-react"
import { Slider } from "@/registry/ui/slider"

export default function SliderDemo() {
  const [volume, setVolume] = React.useState([65])

  return (
    <div className="w-full max-w-sm space-y-3 rounded-lg border border-border bg-card p-4 text-card-foreground shadow-xs">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">主音量调节</span>
        <span className="text-xs font-semibold tabular-nums text-muted-foreground">
          {volume[0]}%
        </span>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setVolume([0])}
          className="text-muted-foreground hover:text-foreground transition-colors"
          aria-label="静音"
        >
          {volume[0] === 0 ? (
            <VolumeXIcon className="size-4 shrink-0" />
          ) : (
            <Volume2Icon className="size-4 shrink-0" />
          )}
        </button>

        <Slider
          value={volume}
          onValueChange={setVolume}
          max={100}
          step={1}
          formatValue={(val) => `${val}%`}
          aria-label="音量大小"
        />
      </div>
    </div>
  )
}
