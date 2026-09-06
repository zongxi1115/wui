"use client"

import * as React from "react"
import { ArrowRightIcon } from "lucide-react"

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/registry/ui/carousel"
import { Badge } from "@/registry/ui/badge"
import { Button } from "@/registry/ui/button"

const CARDS = [
  {
    title: "Vibe UI Next-Gen 设计系统",
    category: "Design System",
    desc: "极致打磨的 80+ 现代化组件与 15+ 业务场景模板，开箱即用。",
    image: "/wui/demo/field-notes/coastal-hill.jpg",
  },
  {
    title: "AI Agent 流式工作流编排器",
    category: "AI Platform",
    desc: "基于可视化节点连线的智能体自主编排引擎，支持工具链自动调用。",
    image: "/wui/demo/field-notes/silver-grass.jpg",
  },
  {
    title: "全自动化云原生发布平台",
    category: "DevOps",
    desc: "无缝对接 Kubernetes 集群，支持金丝雀灰度与秒级故障回滚。",
    image: "/wui/demo/field-notes/concrete-stairs.jpg",
  },
  {
    title: "实时分布式监控与链路追踪",
    category: "Observability",
    desc: "全链路毫秒级拓扑分析，智能定位性能瓶颈与异常调用栈。",
    image: "/wui/demo/field-notes/cliff-horizon.jpg",
  },
]

export default function CarouselCards() {
  const [current, setCurrent] = React.useState(0)

  return (
    <div className="w-full max-w-3xl space-y-4">
      <Carousel
        loop
        onIndexChange={setCurrent}
        className="w-full px-12"
        aria-label="精选产品架构方案"
      >
        <CarouselContent className="-ml-4">
          {CARDS.map((card, index) => (
            <CarouselItem key={card.title} className="pl-4 md:basis-1/2">
              <div className="group overflow-hidden rounded-xl border bg-card text-card-foreground shadow-xs transition-all hover:shadow-md">
                <div className="aspect-video w-full overflow-hidden bg-muted">
                  <img
                    src={card.image}
                    alt={card.title}
                    className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="text-[10px]">
                      {card.category}
                    </Badge>
                    <span className="text-[11px] text-muted-foreground tabular-nums">
                      {index + 1} / {CARDS.length}
                    </span>
                  </div>
                  <h3 className="font-semibold text-sm line-clamp-1 group-hover:text-primary transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                    {card.desc}
                  </p>
                  <Button variant="ghost" size="sm" className="h-7 px-0 text-xs text-primary gap-1">
                    <span>了解更多</span>
                    <ArrowRightIcon className="size-3" />
                  </Button>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>

      {/* 底部指示圆点 */}
      <div className="flex justify-center gap-1.5">
        {CARDS.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === current ? "w-6 bg-primary" : "w-1.5 bg-muted-foreground/30"
            }`}
          />
        ))}
      </div>
    </div>
  )
}
