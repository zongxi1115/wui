"use client"

import * as React from "react"

import { Slider } from "@/registry/ui/slider"

export default function SliderExpand() {
  const [value, setValue] = React.useState([38])

  return (
    <div className="w-full max-w-xs space-y-4">
      <Slider
        value={value}
        onValueChange={setValue}
        formatValue={(current) => `${current}%`}
        aria-label="可交互状态"
      />
      <Slider defaultValue={[38]} showValue="never" disabled aria-label="禁用状态" />
      <Slider
        defaultValue={[25, 70]}
        showValue="never"
        aria-label="范围选择"
      />
    </div>
  )
}
