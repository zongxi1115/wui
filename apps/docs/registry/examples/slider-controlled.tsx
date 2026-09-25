"use client"

import * as React from "react"

import { Button } from "@/registry/ui/button"
import { Slider } from "@/registry/ui/slider"

const presets = [75, 100, 125, 150]

export default function SliderControlled() {
  const [value, setValue] = React.useState([100])

  return (
    <div className="grid w-full max-w-sm gap-4">
      <div className="flex items-center justify-between">
        <span id="display-scale-label" className="text-sm font-medium">
          界面缩放
        </span>
        <span className="text-muted-foreground text-sm tabular-nums">{value[0]}%</span>
      </div>

      <Slider
        aria-labelledby="display-scale-label"
        value={value}
        onValueChange={setValue}
        min={50}
        max={200}
        step={5}
        marks={presets}
        formatValue={(current) => `${current}%`}
      />

      <div className="flex items-center gap-1">
        <span className="text-muted-foreground mr-auto text-xs">快速设置</span>
        {presets.map((preset) => (
          <Button
            key={preset}
            size="sm"
            variant={value[0] === preset ? "secondary" : "ghost"}
            aria-pressed={value[0] === preset}
            className="h-7 px-2 text-xs tabular-nums"
            onClick={() => setValue([preset])}
          >
            {preset}%
          </Button>
        ))}
      </div>
    </div>
  )
}
