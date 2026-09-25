"use client"

import * as React from "react"

import { VelocityMarquee } from "@/registry/ui/velocity-marquee"

const services = ["品牌策略", "产品设计", "动效系统", "前端工程", "设计运营"]

export default function VelocityMarqueeDemo() {
  const container = React.useRef<HTMLDivElement>(null)

  return (
    <div
      ref={container}
      className="h-[24rem] w-full overflow-y-auto overflow-x-hidden rounded-b-lg"
    >
      <div className="flex h-[48rem] flex-col justify-center gap-2 py-24">
        <p className="text-muted-foreground mb-6 px-6 text-sm sm:px-10">
          上下滚动这个区域：滚得越快，文字跑得越快，并随方向掉头。
        </p>

        <VelocityMarquee
          container={container}
          baseSpeed={48}
          sensitivity={0.14}
          maxBoost={320}
          skew={8}
          gap={40}
        >
          {services.map((service) => (
            <span
              key={service}
              className="flex items-center gap-10 text-5xl font-semibold tracking-tight whitespace-nowrap sm:text-6xl"
            >
              {service}
              <span className="bg-foreground size-2 rounded-full" />
            </span>
          ))}
        </VelocityMarquee>

        <VelocityMarquee
          container={container}
          reverse
          baseSpeed={36}
          sensitivity={0.14}
          maxBoost={320}
          skew={8}
          gap={40}
        >
          {services.map((service) => (
            <span
              key={service}
              className="text-muted-foreground/40 text-5xl font-semibold tracking-tight whitespace-nowrap sm:text-6xl"
            >
              {service}
            </span>
          ))}
        </VelocityMarquee>
      </div>
    </div>
  )
}
