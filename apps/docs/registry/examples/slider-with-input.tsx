"use client"

import * as React from "react"

import { InputNumber } from "@/registry/ui/input-number"
import { Slider } from "@/registry/ui/slider"

export default function SliderWithInput() {
  const [radius, setRadius] = React.useState(12)

  return (
    <div className="grid w-full max-w-sm gap-4">
      <span id="corner-radius-label" className="text-sm font-medium">
        卡片圆角
      </span>

      <div className="flex items-center gap-4">
        <Slider
          aria-labelledby="corner-radius-label"
          value={[radius]}
          onValueChange={([next]) => setRadius(next)}
          min={0}
          max={32}
          step={1}
          formatValue={(current) => `${current}px`}
          className="flex-1"
        />
        <InputNumber
          aria-labelledby="corner-radius-label"
          value={radius}
          onValueChange={(next) => setRadius(next ?? 0)}
          min={0}
          max={32}
          size="sm"
          suffix="px"
          wrapperClassName="w-28 shrink-0"
        />
      </div>

      <div className="bg-muted/40 flex h-28 items-center justify-center rounded-md border border-dashed">
        <div
          className="bg-background size-16 border shadow-xs transition-[border-radius] duration-200 ease-out"
          style={{ borderRadius: radius }}
        />
      </div>
    </div>
  )
}
