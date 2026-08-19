"use client"

import * as React from "react"
import { CheckCircle2, Compass } from "lucide-react"

import { ScrollProgress } from "@/registry/ui/scroll-progress"

export default function ScrollProgressSteps() {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const targetSectionRef = React.useRef<HTMLDivElement>(null)

  return (
    <div className="flex w-full max-w-lg flex-col gap-4 rounded-xl border border-border bg-card p-6 shadow-xs">
      <div className="flex items-center justify-between border-b border-border pb-3">
        <div className="flex items-center gap-2">
          <Compass className="size-4 text-primary" />
          <div>
            <h4 className="text-xs font-semibold text-foreground">
              核心技术章节进度监听 (Target Tracking)
            </h4>
            <span className="text-[10px] text-muted-foreground">
              仅监听特定章节在视口中的通过比例
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 rounded-full border border-border bg-muted/30 px-2.5 py-1">
          <span className="text-[10px] font-medium text-muted-foreground">章节完成</span>
          <ScrollProgress
            container={containerRef}
            target={targetSectionRef}
            variant="circle"
            size={24}
            strokeWidth={3}
            className="text-foreground"
            trackClassName="text-muted"
            indicatorClassName="text-primary"
            offset={["start end", "end start"]}
          />
        </div>
      </div>

      <div
        ref={containerRef}
        className="h-48 overflow-y-auto rounded-lg border border-border bg-muted/10 p-4 space-y-6 [scrollbar-width:thin]"
      >
        <div className="space-y-1 text-xs text-muted-foreground">
          <div className="font-semibold text-foreground">01. 概述与前言</div>
          <p>请向下滚动进入重点核心章节，观察右上角环形进度条的联动响应。</p>
        </div>

        {/* Target monitored section */}
        <div
          ref={targetSectionRef}
          className="rounded-lg border border-primary/30 bg-primary/5 p-4 space-y-2 text-xs"
        >
          <div className="flex items-center gap-1.5 font-semibold text-primary">
            <CheckCircle2 className="size-3.5" />
            <span>02. 核心架构深度解析 (被监听目标)</span>
          </div>
          <p className="leading-relaxed text-muted-foreground">
            本章节包含异步批处理流水线、GPU 硬件加速层以及零拷贝内存布局的详细实现细节。
          </p>
          <p className="leading-relaxed text-muted-foreground">
            当本卡片进入视口下边缘开始计算，直到完全离开视口上边缘时达到 100%。
          </p>
        </div>

        <div className="space-y-1 text-xs text-muted-foreground">
          <div className="font-semibold text-foreground">03. 结语与附录</div>
          <p>核心章节已通过，文档阅读完毕。</p>
        </div>
      </div>
    </div>
  )
}
