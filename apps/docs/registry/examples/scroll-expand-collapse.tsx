"use client"

import * as React from "react"

import { ScrollExpand } from "@/registry/ui/scroll-expand"

export default function ScrollExpandCollapse() {
  const container = React.useRef<HTMLDivElement>(null)

  return (
    <div
      ref={container}
      className="h-[26rem] w-full overflow-y-auto rounded-b-lg"
    >
      <ScrollExpand
        container={container}
        direction="collapse"
        scrollLength={1.8}
        inset={14}
        radius={12}
      >
        <div className="bg-muted relative size-full">
          <img
            src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1600&q=80"
            alt="阳光穿过森林"
            className="size-full object-cover"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/25 text-center text-white">
            <p className="text-sm text-white/80">森林疗愈 · 周末营</p>
            <p className="mt-2 text-3xl font-semibold tracking-tight">
              向下滚动
            </p>
          </div>
        </div>
      </ScrollExpand>

      <div className="mx-auto max-w-xl px-6 py-12">
        <h4 className="font-semibold">两天一夜，离开屏幕</h4>
        <p className="text-muted-foreground mt-2 text-sm leading-7">
          封面从全幅收缩为画框，把注意力交还给接下来的正文。适合作为长文或活动页的开场：先给出氛围，再进入信息。
        </p>
      </div>
    </div>
  )
}
