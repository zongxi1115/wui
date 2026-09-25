"use client"

import * as React from "react"

import { ScrollText } from "@/registry/ui/scroll-text"

export default function ScrollTextBlur() {
  const container = React.useRef<HTMLDivElement>(null)

  return (
    <div
      ref={container}
      className="h-[22rem] w-full overflow-y-auto rounded-b-lg"
    >
      <div className="flex flex-col items-center px-6 pt-44 pb-52 text-center">
        <ScrollText
          as="h3"
          container={container}
          mode="blur"
          per="char"
          overlap={2}
          offset={["start 0.9", "start 0.4"]}
          className="text-4xl font-semibold tracking-tight sm:text-5xl"
        >
          专注，从这里开始
        </ScrollText>
        <ScrollText
          container={container}
          mode="blur"
          offset={["start 0.9", "start 0.5"]}
          className="text-muted-foreground mt-4 max-w-sm text-sm leading-6"
        >
          专注模式会隐去当前段落之外的一切，让注意力只停留在正在写的句子上。
        </ScrollText>
      </div>
    </div>
  )
}
