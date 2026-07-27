"use client"

import * as React from "react"

import { Slider } from "@/registry/ui/slider"

export default function SliderExpand() {
  const [value, setValue] = React.useState([72])

  return (
    <div className="w-full max-w-sm space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium">Timeline</span>
        <span className="tabular-nums text-muted-foreground">{value[0]}%</span>
      </div>
      <Slider
        variant="expand"
        value={value}
        onValueChange={setValue}
        formatValue={(current) => `${current}%`}
        aria-label="Timeline position"
      />
      <p className="text-xs text-muted-foreground">Hover or focus to expand the track to the thumb height.</p>
    </div>
  )
}
