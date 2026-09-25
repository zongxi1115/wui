"use client"

import * as React from "react"

import { ScrollText } from "@/registry/ui/scroll-text"

export default function ScrollTextReveal() {
  const container = React.useRef<HTMLDivElement>(null)

  return (
    <div
      ref={container}
      className="h-[24rem] w-full overflow-y-auto rounded-b-lg"
    >
      <div className="mx-auto max-w-2xl px-6 pt-48 pb-56">
        <p className="text-muted-foreground mb-4 text-sm">年度回顾</p>
        <ScrollText
          container={container}
          mode="reveal"
          per="line"
          overlap={0.6}
          offset={["start 0.95", "end 0.6"]}
          className="text-3xl leading-tight font-semibold tracking-tight sm:text-4xl"
        >
          {"一年，\n我们发布了 48 个版本，\n回复了 3,200 条反馈，\n也删掉了 11 个功能。"}
        </ScrollText>
      </div>
    </div>
  )
}
