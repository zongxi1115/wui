"use client"

import * as React from "react"
import { Slider } from "@/registry/ui/slider"
import { Input } from "@/registry/ui/input"

export default function SliderWithInput() {
  const [value, setValue] = React.useState([48])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const num = Number(e.target.value)
    if (!isNaN(num) && num >= 0 && num <= 100) {
      setValue([num])
    }
  }

  return (
    <div className="w-full max-w-sm space-y-3 rounded-lg border border-border bg-card p-4 text-card-foreground shadow-xs">
      <div className="flex items-center justify-between">
        <label htmlFor="radius-slider" className="text-sm font-medium">
          元素圆角半径 (Border Radius)
        </label>
      </div>

      <div className="flex items-center gap-4">
        <Slider
          id="radius-slider"
          value={value}
          onValueChange={setValue}
          min={0}
          max={100}
          step={1}
          formatValue={(val) => `${val}px`}
          className="flex-1"
        />

        <div className="w-20 shrink-0">
          <Input
            type="number"
            min={0}
            max={100}
            value={value[0]}
            onChange={handleInputChange}
            visualSize="sm"
            endContent={<span className="text-xs text-muted-foreground">px</span>}
            aria-label="圆角精确数值"
          />
        </div>
      </div>

      <div className="flex items-center justify-center pt-2">
        <div
          className="size-16 border-2 border-dashed border-primary bg-primary/10 transition-all duration-150"
          style={{ borderRadius: `${value[0]}px` }}
        />
      </div>
    </div>
  )
}
