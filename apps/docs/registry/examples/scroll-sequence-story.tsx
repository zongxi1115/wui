"use client"

import * as React from "react"

import { ScrollSequence } from "@/registry/ui/scroll-sequence"

const chapters = [
  { value: "3 人", label: "2023 年，我们在一间咖啡馆里写下第一行代码。" },
  { value: "1.2 万", label: "第二年，第一批团队把工作流搬了进来。" },
  { value: "18 万", label: "今天，每周有 18 万人在这里完成他们的工作。" },
]

export default function ScrollSequenceStory() {
  const container = React.useRef<HTMLDivElement>(null)

  return (
    <div
      ref={container}
      className="h-[22rem] w-full overflow-y-auto rounded-b-lg"
    >
      <ScrollSequence
        container={container}
        effect="blur"
        stepLength={0.9}
        stepClassName="flex items-center justify-center px-6 pb-8"
      >
        {chapters.map((chapter) => (
          <div key={chapter.value} className="max-w-sm text-center">
            <p className="text-6xl font-semibold tracking-tight tabular-nums">
              {chapter.value}
            </p>
            <p className="text-muted-foreground mt-4 text-sm leading-6">
              {chapter.label}
            </p>
          </div>
        ))}
      </ScrollSequence>
    </div>
  )
}
