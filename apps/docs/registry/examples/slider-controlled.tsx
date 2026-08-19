"use client"

import * as React from "react"
import { Slider } from "@/registry/ui/slider"

export default function SliderControlled() {
  const [value, setValue] = React.useState([45])

  const presets = [0, 25, 50, 75, 100]

  return (
    <div className="w-full max-w-sm space-y-4">
      <div className="flex items-center justify-between">
        <label htmlFor="ctrl-slider" className="text-sm font-medium">
          屏幕缩放比例
        </label>
        <span className="rounded bg-muted px-2 py-0.5 font-mono text-xs font-semibold tabular-nums text-foreground">
          {value[0]}%
        </span>
      </div>

      <Slider
        id="ctrl-slider"
        value={value}
        onValueChange={setValue}
        min={0}
        max={100}
        step={1}
        formatValue={(val) => `${val}%`}
      />

      <div className="flex items-center gap-1.5 pt-1">
        <span className="text-xs text-muted-foreground mr-1">快速预设:</span>
        {presets.map((preset) => (
          <button
            key={preset}
            type="button"
            onClick={() => setValue([preset])}
            className={`rounded px-2 py-1 text-xs transition-colors ${
              value[0] === preset
                ? "bg-primary text-primary-foreground font-medium"
                : "border border-border bg-background hover:bg-muted"
            }`}
          >
            {preset}%
          </button>
        ))}
      </div>
    </div>
  )
}
