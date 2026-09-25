"use client"

import * as React from "react"

import { Input } from "@/registry/ui/input"
import { Slider } from "@/registry/ui/slider"
import { Watermark } from "@/registry/ui/watermark"

export default function WatermarkPlayground() {
  const [content, setContent] = React.useState("仅供内部评审")
  const [rotate, setRotate] = React.useState(-22)
  const [opacity, setOpacity] = React.useState(0.15)

  return (
    <div className="grid w-full max-w-2xl gap-6 sm:grid-cols-[200px_1fr]">
      <div className="space-y-5">
        <Input
          size="sm"
          aria-label="水印文字"
          placeholder="水印文字"
          value={content}
          onChange={(event) => setContent(event.target.value)}
        />
        <label className="block">
          <span className="text-muted-foreground flex justify-between text-xs">
            旋转角度
            <span className="text-foreground tabular-nums">{rotate}°</span>
          </span>
          <Slider
            variant="expand"
            showValue="never"
            min={-60}
            max={60}
            value={[rotate]}
            onValueChange={([value]) => setRotate(value)}
            aria-label="旋转角度"
          />
        </label>
        <label className="block">
          <span className="text-muted-foreground flex justify-between text-xs">
            不透明度
            <span className="text-foreground tabular-nums">
              {Math.round(opacity * 100)}%
            </span>
          </span>
          <Slider
            variant="expand"
            showValue="never"
            min={0.05}
            max={0.4}
            step={0.01}
            value={[opacity]}
            onValueChange={([value]) => setOpacity(value)}
            aria-label="不透明度"
          />
        </label>
      </div>

      <Watermark
        content={content}
        rotate={rotate}
        opacity={opacity}
        gap={[64, 64]}
        className="overflow-hidden rounded-lg border"
      >
        <div className="p-6">
          <h3 className="font-semibold">供应商准入评估报告</h3>
          <p className="text-muted-foreground mt-1 text-xs">采购部 · 第 2 版</p>
          <p className="text-muted-foreground mt-4 text-sm leading-6">
            本次共评估 6 家候选供应商，综合交付周期、质量抽检合格率与报价三项指标，
            建议将排名前两位的供应商纳入年度框架协议，其余进入观察名单。
          </p>
        </div>
      </Watermark>
    </div>
  )
}
