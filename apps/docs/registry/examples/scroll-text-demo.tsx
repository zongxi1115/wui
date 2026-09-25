"use client"

import * as React from "react"

import { ScrollText } from "@/registry/ui/scroll-text"

export default function ScrollTextDemo() {
  const container = React.useRef<HTMLDivElement>(null)

  return (
    <div
      ref={container}
      className="h-[26rem] w-full overflow-y-auto rounded-b-lg"
    >
      <div className="mx-auto flex max-w-2xl flex-col px-6">
        <p className="text-muted-foreground flex h-[13rem] items-end pb-6 text-sm">
          我们的信条 — 向下滚动
        </p>
        <ScrollText
          container={container}
          offset={["start 0.9", "end 0.5"]}
          className="text-2xl leading-snug font-semibold tracking-tight sm:text-3xl"
        >
          好的工具应该安静。它不打断你的思路，不要求你记住复杂的规则，只在你需要的时候出现，然后退到一旁，让作品本身被看见。
        </ScrollText>
        <p className="text-muted-foreground h-[18rem] pt-8 text-sm">
          — 写在第一个版本发布之前
        </p>
      </div>
    </div>
  )
}
