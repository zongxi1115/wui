"use client"

import * as React from "react"

import { ScrollProgress } from "@/registry/ui/scroll-progress"

const projects = [
  { name: "山野露营品牌", type: "品牌识别", seed: "camp-brand" },
  { name: "城市骑行 App", type: "移动端", seed: "city-ride" },
  { name: "独立书店官网", type: "网站", seed: "book-store" },
  { name: "咖啡订阅小程序", type: "小程序", seed: "coffee-sub" },
  { name: "美术馆导览", type: "交互装置", seed: "museum-guide" },
  { name: "有机农场年报", type: "数据可视化", seed: "farm-report" },
]

export default function ScrollProgressVariants() {
  const scrollerRef = React.useRef<HTMLDivElement>(null)

  return (
    <div className="w-full max-w-2xl">
      <div className="mb-3 flex items-end justify-between">
        <div>
          <h4 className="font-medium">近期项目</h4>
          <p className="text-muted-foreground text-sm">横向滑动浏览</p>
        </div>
        <ScrollProgress
          container={scrollerRef}
          axis="x"
          variant="circle"
          size={36}
          strokeWidth={2.5}
          trackClassName="text-muted"
          indicatorClassName="text-[var(--chart-1)]"
        />
      </div>

      <div
        ref={scrollerRef}
        className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {projects.map((project) => (
          <figure key={project.name} className="w-52 shrink-0 snap-start">
            <img
              src={`https://picsum.photos/seed/${project.seed}/416/312`}
              alt={project.name}
              className="bg-muted aspect-[4/3] w-full rounded-md object-cover"
            />
            <figcaption className="mt-2">
              <p className="text-sm font-medium">{project.name}</p>
              <p className="text-muted-foreground text-xs">{project.type}</p>
            </figcaption>
          </figure>
        ))}
      </div>

      <ScrollProgress
        container={scrollerRef}
        axis="x"
        position="inline"
        className="h-1 rounded-full"
        trackClassName="bg-muted"
        indicatorClassName="bg-[var(--chart-1)]"
      />
    </div>
  )
}
