"use client"

import * as React from "react"

import { StickyStack, StickyStackItem } from "@/registry/ui/sticky-stack"

const features = [
  {
    index: "01",
    title: "文档",
    heading: "把想法写下来，团队就能接着写",
    description:
      "实时协作、行内评论与版本历史。每一次修改都有迹可循，不再需要在群里问“最新版是哪个”。",
    image:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=80",
  },
  {
    index: "02",
    title: "看板",
    heading: "让每个任务都有明确的下一步",
    description:
      "拖拽即可流转状态，负责人与截止日期一目了然。延期的卡片会自动浮到最上方。",
    image:
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=900&q=80",
  },
  {
    index: "03",
    title: "自动化",
    heading: "重复的事情，交给规则去做",
    description:
      "合并请求通过后自动关闭任务，周五下午自动生成周报。配置一次，每周省下几个小时。",
    image:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=900&q=80",
  },
]

export default function StickyStackDemo() {
  const container = React.useRef<HTMLDivElement>(null)

  return (
    <div
      ref={container}
      className="bg-muted/40 h-[28rem] w-full overflow-y-auto rounded-b-lg"
    >
      <div className="mx-auto max-w-3xl px-6 pt-10 pb-6">
        <p className="text-muted-foreground text-sm">一个工作区，三种能力</p>
        <h3 className="mt-2 text-2xl font-semibold tracking-tight">
          从记录到交付
        </h3>
      </div>

      <StickyStack
        container={container}
        top={16}
        gap={12}
        dim={0.5}
        className="mx-auto max-w-3xl px-6 pb-24"
      >
        {features.map((feature) => (
          <StickyStackItem
            key={feature.index}
            className="bg-background grid overflow-hidden rounded-lg border sm:grid-cols-[1fr_16rem]"
          >
            <div className="flex flex-col p-6">
              <div className="text-muted-foreground flex items-center gap-2 text-xs">
                <span className="font-mono">{feature.index}</span>
                <span>{feature.title}</span>
              </div>
              <h4 className="mt-6 text-lg font-semibold tracking-tight">
                {feature.heading}
              </h4>
              <p className="text-muted-foreground mt-2 text-sm leading-6">
                {feature.description}
              </p>
            </div>
            <img
              src={feature.image}
              alt={feature.title}
              className="bg-muted hidden h-full min-h-56 w-full object-cover sm:block"
            />
          </StickyStackItem>
        ))}
      </StickyStack>
    </div>
  )
}
