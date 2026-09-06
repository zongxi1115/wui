"use client"

import * as React from "react"

import { ScrollProgress } from "@/registry/ui/scroll-progress"

export default function ScrollProgressVariants() {
  const containerRef = React.useRef<HTMLDivElement>(null)

  return (
    <div className="flex w-full max-w-xl flex-col gap-5 rounded-xl border border-border bg-card p-6 shadow-xs">
      <div className="flex items-center justify-between border-b border-border pb-3">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          形态与自定义样式 (Variants & Styles)
        </span>
        <span className="text-xs text-muted-foreground">在下方区域滚动预览</span>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Variant 1: Gradient Inline Bar */}
        <div className="space-y-2 rounded-lg border border-border bg-muted/20 p-4">
          <div className="flex justify-between text-xs font-medium text-foreground">
            <span>双色渐变进度条</span>
            <span className="text-[10px] text-muted-foreground">h-1.5 gradient</span>
          </div>
          <ScrollProgress
            container={containerRef}
            position="inline"
            className="h-1.5 rounded-full bg-muted overflow-hidden"
            indicatorClassName="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"
          />
          <p className="text-[11px] text-muted-foreground">
            通过 indicatorClassName 传入自定义渐变类名。
          </p>
        </div>

        {/* Variant 2: Large Circular Badge */}
        <div className="space-y-2 rounded-lg border border-border bg-muted/20 p-4">
          <div className="flex items-center justify-between text-xs font-medium text-foreground">
            <span>环形仪表徽章</span>
            <ScrollProgress
              container={containerRef}
              variant="circle"
              size={36}
              strokeWidth={3.5}
              className="text-foreground"
              trackClassName="text-muted"
              indicatorClassName="text-emerald-500"
            />
          </div>
          <p className="text-[11px] text-muted-foreground">
            variant="circle" 适合悬浮在页面右下角作为返回顶部阅读器。
          </p>
        </div>
      </div>

      {/* Scrollable testing area */}
      <div
        ref={containerRef}
        className="h-32 overflow-y-auto rounded-lg border border-dashed border-border bg-muted/10 p-4 text-xs text-muted-foreground space-y-4 [scrollbar-width:thin]"
      >
        <p>↓ 向下滚动此区域以驱动上方两个进度条实时变动 ↓</p>
        <p>
          ScrollProgress 能够精确监听任何由 ref 指定的滚动容器，且利用 Motion
          弹簧滤波消除触控板回弹抖动。
        </p>
        <p>
          在移动端、长文章页与多步表单中，为用户提供时刻清晰的滚动阶段反馈。
        </p>
        <p className="font-semibold text-foreground">✓ 已经滚动到底部</p>
      </div>
    </div>
  )
}
