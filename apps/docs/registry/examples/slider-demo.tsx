"use client"

import { SunDimIcon, SunIcon } from "lucide-react"

import { Slider } from "@/registry/ui/slider"

export default function SliderDemo() {
  const marks = [0, 20, 40, 60, 80, 100]

  return (
    <div className="w-full max-w-xs space-y-7">
      <Slider defaultValue={[40]} showValue="never" aria-label="基础滑块" />

      <Slider
        defaultValue={[40]}
        marks={marks}
        showValue="never"
        aria-label="带刻度的滑块"
      />

      <div className="flex items-center gap-2.5">
        <SunDimIcon className="size-4 shrink-0 text-muted-foreground" />
        <Slider defaultValue={[50]} showValue="never" aria-label="亮度" />
        <SunIcon className="size-4 shrink-0 fill-current" />
      </div>

      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        <span aria-hidden="true">A</span>
        <Slider defaultValue={[50]} showValue="never" aria-label="字号" />
        <span className="text-sm" aria-hidden="true">A</span>
      </div>

      <div>
        <Slider
          defaultValue={[40]}
          marks={marks}
          showValue="never"
          aria-label="带数值刻度的滑块"
        />
        <div className="flex justify-between px-px text-[9px] tabular-nums text-muted-foreground">
          {marks.map((mark) => (
            <span key={mark}>{mark}</span>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm font-medium">
          <SunIcon className="size-4 fill-current" />
          <span>Title</span>
        </div>
        <Slider defaultValue={[40]} showValue="never" aria-label="标题滑块" />
      </div>

      <Slider
        defaultValue={[40]}
        showValue="always"
        formatValue={(value) => `${value}%`}
        aria-label="显示当前值的滑块"
      />
    </div>
  )
}
