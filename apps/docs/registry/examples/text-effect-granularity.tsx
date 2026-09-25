"use client"

import * as React from "react"
import { RotateCcwIcon } from "lucide-react"

import { Button } from "@/registry/ui/button"
import { TextEffect } from "@/registry/ui/text-effect"

export default function TextEffectGranularity() {
  const [key, setKey] = React.useState(0)

  return (
    <div className="w-full max-w-xl">
      <div key={key} className="divide-y border-y">
        <div className="grid gap-2 py-5 sm:grid-cols-[7rem_1fr]">
          <code className="text-muted-foreground text-xs">per=&quot;char&quot;</code>
          <TextEffect
            as="h4"
            per="char"
            preset="fade-in-blur"
            className="text-lg font-semibold tracking-tight"
          >
            Design System 2.0 正式发布
          </TextEffect>
        </div>
        <div className="grid gap-2 py-5 sm:grid-cols-[7rem_1fr]">
          <code className="text-muted-foreground text-xs">per=&quot;word&quot;</code>
          <TextEffect per="word" preset="slide" className="text-sm leading-6">
            Accessible components, tuned motion and 中文排版优化, all in one kit.
          </TextEffect>
        </div>
        <div className="grid gap-2 py-5 sm:grid-cols-[7rem_1fr]">
          <code className="text-muted-foreground text-xs">per=&quot;line&quot;</code>
          <TextEffect
            as="div"
            per="line"
            preset="blur-sm"
            speedReveal={0.8}
            className="text-muted-foreground gap-1 text-sm"
          >
            {`统一的设计语言与类型系统\n内置 WAI-ARIA 键盘交互规范\n克制、可降级的界面动效`}
          </TextEffect>
        </div>
      </div>
      <div className="mt-4 flex justify-end">
        <Button variant="ghost" size="sm" onClick={() => setKey((k) => k + 1)}>
          <RotateCcwIcon />
          全部重播
        </Button>
      </div>
    </div>
  )
}
