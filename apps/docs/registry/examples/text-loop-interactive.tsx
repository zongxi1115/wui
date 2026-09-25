"use client"

import * as React from "react"
import { PauseIcon, PlayIcon } from "lucide-react"

import { Button } from "@/registry/ui/button"
import { TextLoop } from "@/registry/ui/text-loop"
import { cn } from "@/registry/lib/utils"

const reviews = [
  {
    author: "林晓",
    role: "运营负责人 · 青禾零售",
    quote: "审批从平均两天缩短到半天，门店采购终于不再卡在邮件里。",
  },
  {
    author: "周子墨",
    role: "前端工程师 · 远帆科技",
    quote: "键盘交互和焦点管理都已经做好，我们几乎没有再补无障碍问题。",
  },
  {
    author: "陈一凡",
    role: "产品经理 · 知行教育",
    quote: "报表可以直接推送到群里，周会前再也不用手动截图整理数据。",
  },
]

export default function TextLoopInteractive() {
  const [index, setIndex] = React.useState(0)
  const [playing, setPlaying] = React.useState(true)
  const [hovered, setHovered] = React.useState(false)

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="w-full max-w-md"
    >
      <TextLoop
        interval={3.5}
        trigger={playing && !hovered}
        onIndexChange={setIndex}
        className="w-full"
      >
        {reviews.map((item) => (
          <span key={item.author} className="block">
            <span className="block text-base leading-7">{item.quote}</span>
            <span className="text-muted-foreground mt-3 block text-sm">
              <span className="text-foreground font-medium">{item.author}</span>
              <span className="mx-2">·</span>
              {item.role}
            </span>
          </span>
        ))}
      </TextLoop>

      <div className="mt-5 flex items-center justify-between border-t pt-3">
        <div className="flex items-center gap-1.5" aria-hidden="true">
          {reviews.map((item, i) => (
            <span
              key={item.author}
              className={cn(
                "h-1 rounded-full transition-all duration-300",
                index === i ? "bg-foreground w-5" : "bg-border w-1.5"
              )}
            />
          ))}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground text-xs">
            {hovered ? "悬停暂停中" : playing ? "自动播放" : "已暂停"}
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="size-7"
            onClick={() => setPlaying((value) => !value)}
            aria-label={playing ? "暂停轮播" : "继续轮播"}
          >
            {playing ? <PauseIcon className="size-3.5" /> : <PlayIcon className="size-3.5" />}
          </Button>
        </div>
      </div>
    </div>
  )
}
