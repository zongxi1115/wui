"use client"

import * as React from "react"

import { ScrollExpand } from "@/registry/ui/scroll-expand"

export default function ScrollExpandDemo() {
  const container = React.useRef<HTMLDivElement>(null)

  return (
    <div
      ref={container}
      className="h-[28rem] w-full overflow-y-auto rounded-b-lg"
    >
      <div className="mx-auto max-w-2xl px-6 pt-12 pb-10 text-center">
        <p className="text-muted-foreground text-sm">影像计划 · 第四季</p>
        <h3 className="mt-2 text-3xl font-semibold tracking-tight">
          把山带回城市
        </h3>
        <p className="text-muted-foreground mx-auto mt-3 max-w-sm text-sm leading-6">
          向下滚动，画面会从卡片展开为全幅。
        </p>
      </div>

      <ScrollExpand
        container={container}
        scrollLength={2.2}
        inset={12}
        radius={12}
      >
        <div className="bg-muted relative size-full">
          <img
            src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1600&q=80"
            alt="日落时分的山谷"
            className="size-full object-cover"
          />
          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 bg-gradient-to-t from-black/60 to-transparent p-6 text-white sm:p-8">
            <div>
              <p className="text-sm text-white/70">摄影 · 许然</p>
              <p className="mt-1 text-xl font-semibold sm:text-2xl">
                日落前的最后十分钟
              </p>
            </div>
            <span className="font-mono text-xs text-white/70">35mm · f/8</span>
          </div>
        </div>
      </ScrollExpand>

      <div className="mx-auto max-w-2xl px-6 py-12">
        <p className="text-muted-foreground text-sm leading-7">
          展开完成后，画面随页面继续向上滚动离开。整个过程只改变 clip-path
          与 transform，不触发布局计算。
        </p>
      </div>
    </div>
  )
}
