"use client"

import * as React from "react"

import { HorizontalScroll } from "@/registry/ui/horizontal-scroll"

const roadmap = [
  {
    quarter: "2026 Q1",
    status: "已发布",
    items: ["离线编辑", "评论提及通知", "导出 PDF"],
  },
  {
    quarter: "2026 Q2",
    status: "已发布",
    items: ["看板泳道", "自定义字段", "移动端重构"],
  },
  {
    quarter: "2026 Q3",
    status: "进行中",
    items: ["自动化规则", "数据看板", "审批流"],
  },
  {
    quarter: "2026 Q4",
    status: "计划中",
    items: ["私有化部署", "开放 API v2", "AI 摘要"],
  },
  {
    quarter: "2027 Q1",
    status: "探索中",
    items: ["多语言工作区", "插件市场"],
  },
]

export default function HorizontalScrollCards() {
  const container = React.useRef<HTMLDivElement>(null)

  return (
    <div
      ref={container}
      className="h-[22rem] w-full overflow-y-auto rounded-b-lg"
    >
      <HorizontalScroll
        container={container}
        scrollPadding={120}
        trackClassName="items-center px-6 sm:px-10"
      >
        <div className="w-56 shrink-0 pr-8">
          <h3 className="text-xl font-semibold tracking-tight">产品路线图</h3>
          <p className="text-muted-foreground mt-2 text-sm leading-6">
            向下滚动，沿时间线浏览。
          </p>
        </div>

        {roadmap.map((stage) => {
          const done = stage.status === "已发布"
          const active = stage.status === "进行中"

          return (
            <section key={stage.quarter} className="w-60 shrink-0">
              <div className="flex items-center">
                <span
                  className={
                    done || active
                      ? "bg-foreground size-2.5 shrink-0 rounded-full"
                      : "border-muted-foreground/50 bg-background size-2.5 shrink-0 rounded-full border"
                  }
                />
                <span
                  className={
                    done ? "bg-foreground h-px flex-1" : "bg-border h-px flex-1"
                  }
                />
              </div>
              <div className="pt-4 pr-6">
                <div className="flex items-center gap-2">
                  <p className="font-mono text-sm">{stage.quarter}</p>
                  <span
                    className={
                      active
                        ? "bg-foreground text-background rounded px-1.5 py-0.5 text-[11px]"
                        : "text-muted-foreground text-xs"
                    }
                  >
                    {stage.status}
                  </span>
                </div>
                <ul className="text-muted-foreground mt-3 space-y-1.5 text-sm">
                  {stage.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </section>
          )
        })}
      </HorizontalScroll>
    </div>
  )
}
