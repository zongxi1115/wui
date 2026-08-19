"use client"

import * as React from "react"
import { Slider } from "@/registry/ui/slider"

export default function SliderRange() {
  const [priceRange, setPriceRange] = React.useState<number[]>([150, 650])

  return (
    <div className="w-full max-w-sm space-y-4 rounded-lg border border-border bg-card p-4 text-card-foreground shadow-xs">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">价格区间筛选</span>
        <span className="text-xs font-semibold tabular-nums text-primary">
          ¥ {priceRange[0]} - ¥ {priceRange[1]}
        </span>
      </div>

      <Slider
        value={priceRange}
        onValueChange={setPriceRange}
        min={0}
        max={1000}
        step={10}
        formatValue={(val) => `¥${val}`}
        aria-label="价格区间"
      />

      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>最低: ¥0</span>
        <span>最高: ¥1,000+</span>
      </div>
    </div>
  )
}
