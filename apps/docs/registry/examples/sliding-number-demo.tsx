"use client"

import * as React from "react"

import { Slider } from "@/registry/ui/slider"
import { SlidingNumber } from "@/registry/ui/sliding-number"

export default function SlidingNumberDemo() {
  const [seats, setSeats] = React.useState([24])
  const count = seats[0] ?? 0
  const total = count * 39

  return (
    <div className="w-full max-w-sm">
      <div className="flex items-end justify-between">
        <div>
          <p className="text-muted-foreground text-xs">团队席位</p>
          <p className="mt-1 text-2xl font-semibold tabular-nums">
            <SlidingNumber value={count} />
            <span className="text-muted-foreground ml-1 text-sm font-normal">
              人
            </span>
          </p>
        </div>
        <div className="text-right">
          <p className="text-muted-foreground text-xs">每月费用</p>
          <p className="mt-1 text-2xl font-semibold tabular-nums">
            ¥<SlidingNumber value={total.toLocaleString("en-US")} />
          </p>
        </div>
      </div>
      <Slider
        value={seats}
        onValueChange={setSeats}
        min={1}
        max={200}
        step={1}
        showValue="never"
        aria-label="团队席位"
        className="mt-5"
      />
      <p className="text-muted-foreground mt-3 text-xs">
        拖动滑块：数值增大时每一位向上滚动，减小时向下滚动。
      </p>
    </div>
  )
}
