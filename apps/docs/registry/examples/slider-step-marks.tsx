"use client"

import * as React from "react"
import { Slider } from "@/registry/ui/slider"

export default function SliderStepMarks() {
  const [storage, setStorage] = React.useState([256])
  const marks = [64, 128, 256, 512, 1024]

  return (
    <div className="w-full max-w-sm space-y-4">
      <div className="flex items-center justify-between">
        <label htmlFor="storage-slider" className="text-sm font-medium">
          云存储容量配额
        </label>
        <span className="text-xs font-semibold tabular-nums text-foreground">
          {storage[0] >= 1024 ? `${storage[0] / 1024} TB` : `${storage[0]} GB`}
        </span>
      </div>

      <Slider
        id="storage-slider"
        value={storage}
        onValueChange={setStorage}
        min={64}
        max={1024}
        step={64}
        marks={marks}
        formatValue={(val) => (val >= 1024 ? "1TB" : `${val}G`)}
      />

      <div className="flex justify-between px-0.5 text-[10px] tabular-nums text-muted-foreground">
        {marks.map((mark) => (
          <span key={mark}>{mark >= 1024 ? "1TB" : `${mark}G`}</span>
        ))}
      </div>
    </div>
  )
}
