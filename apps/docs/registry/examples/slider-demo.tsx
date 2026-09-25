"use client"

import * as React from "react"
import { Volume1Icon, Volume2Icon, VolumeXIcon } from "lucide-react"

import { Button } from "@/registry/ui/button"
import { Slider } from "@/registry/ui/slider"

export default function SliderDemo() {
  const [volume, setVolume] = React.useState([65])
  const lastAudible = React.useRef(65)
  const muted = volume[0] === 0
  const VolumeIcon = muted ? VolumeXIcon : volume[0] < 50 ? Volume1Icon : Volume2Icon

  return (
    <div className="flex w-full max-w-sm items-center gap-3">
      <Button
        variant="ghost"
        size="icon"
        className="size-8 shrink-0"
        aria-label={muted ? "取消静音" : "静音"}
        aria-pressed={muted}
        onClick={() => setVolume(muted ? [lastAudible.current] : [0])}
      >
        <VolumeIcon />
      </Button>
      <Slider
        value={volume}
        onValueChange={(next) => {
          setVolume(next)
          if (next[0] > 0) lastAudible.current = next[0]
        }}
        max={100}
        step={1}
        formatValue={(current) => `${current}%`}
        aria-label="音量"
      />
      <span className="text-muted-foreground w-9 shrink-0 text-right text-xs tabular-nums">
        {volume[0]}%
      </span>
    </div>
  )
}
