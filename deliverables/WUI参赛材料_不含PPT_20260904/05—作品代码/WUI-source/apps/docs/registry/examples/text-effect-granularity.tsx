"use client"

import * as React from "react"
import { RotateCw } from "lucide-react"

import { Button } from "@/registry/ui/button"
import { TextEffect } from "@/registry/ui/text-effect"

export default function TextEffectGranularity() {
  const [trigger, setTrigger] = React.useState(true)

  const replay = () => {
    setTrigger(false)
    window.setTimeout(() => setTrigger(true), 80)
  }

  return (
    <div className="flex w-full max-w-xl flex-col gap-6 rounded-xl border border-border bg-card p-6 shadow-xs">
      <div className="space-y-4 divide-y divide-border">
        {/* Character Granularity */}
        <div className="space-y-1.5 pt-2 first:pt-0">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              按字符拆分 (per="char")
            </span>
            <span className="text-[11px] text-muted-foreground">适合短标题与核心品牌词</span>
          </div>
          <TextEffect
            as="h4"
            per="char"
            preset="fade-in-blur"
            speedReveal={1.2}
            trigger={trigger}
            className="text-lg font-semibold tracking-tight text-foreground"
          >
            Next-generation Design System
          </TextEffect>
        </div>

        {/* Word Granularity */}
        <div className="space-y-1.5 pt-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              按单词拆分 (per="word")
            </span>
            <span className="text-[11px] text-muted-foreground">适合句子与标语</span>
          </div>
          <TextEffect
            as="p"
            per="word"
            preset="slide"
            trigger={trigger}
            className="text-sm font-medium text-foreground"
          >
            Empower developers with accessible, high-performance UI components.
          </TextEffect>
        </div>

        {/* Line Granularity */}
        <div className="space-y-1.5 pt-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              按行拆分 (per="line")
            </span>
            <span className="text-[11px] text-muted-foreground">适合多行列表或诗意排版</span>
          </div>
          <TextEffect
            as="div"
            per="line"
            preset="fade-in-blur"
            speedReveal={0.8}
            trigger={trigger}
            className="text-xs leading-relaxed text-muted-foreground"
          >
            {`1. 统一设计语言与类型系统\n2. 深度内置无障碍 WAI-ARIA 规范\n3. 极致优化的 60FPS 丝滑微动效`}
          </TextEffect>
        </div>
      </div>

      <div className="flex justify-end border-t border-border pt-3">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={replay}
          className="gap-1.5 text-xs"
        >
          <RotateCw className="size-3" />
          同时重播
        </Button>
      </div>
    </div>
  )
}
