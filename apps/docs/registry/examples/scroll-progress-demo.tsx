"use client"

import * as React from "react"

import { ScrollProgress } from "@/registry/ui/scroll-progress"

const sections = [
  {
    title: "从一个问题开始",
    body: [
      "每次评审动效，讨论最后都会落到同一个问题上：这个动画在帮用户理解什么？如果答案是“看起来更高级”，它多半可以删掉。",
      "动效最可靠的价值，是解释状态从哪里来、到哪里去。弹窗从触发按钮展开，列表项删除时让位，都是在替用户完成一次空间推理。",
    ],
  },
  {
    title: "时长与曲线",
    body: [
      "界面内的小变化控制在 150–250ms，跨越整个视口的转场可以放宽到 400ms 左右。更长的时长很少让体验更好，只会让操作更慢。",
      "进入使用减速曲线，离开使用加速曲线。弹簧适合跟手的交互，它天然处理了中途打断和速度继承。",
    ],
  },
  {
    title: "克制的清单",
    body: [
      "同一时刻只让一个主体运动；位移不超过元素自身尺寸；避免同时缩放、旋转和变色；所有动画都要能被“减少动态效果”关闭。",
      "最后，把动效参数收进 Token。当团队讨论的是 duration-fast 而不是 180ms，一致性就有了抓手。",
    ],
  },
]

export default function ScrollProgressDemo() {
  const container = React.useRef<HTMLDivElement>(null)
  const article = React.useRef<HTMLElement>(null)

  return (
    <div
      ref={container}
      className="relative h-[26rem] w-full overflow-y-auto rounded-b-lg"
    >
      <header className="bg-background sticky top-0 z-10 border-b">
        <div className="flex items-center justify-between gap-4 px-6 py-3">
          <div className="min-w-0">
            <p className="text-muted-foreground text-xs">设计笔记 · 第 12 期</p>
            <p className="truncate text-sm font-medium">写给产品团队的动效原则</p>
          </div>
          <ScrollProgress
            container={container}
            target={article}
            offset={["start start", "end end"]}
            variant="circle"
            size={32}
            strokeWidth={2.5}
            trackClassName="text-muted"
          />
        </div>
        <ScrollProgress
          container={container}
          target={article}
          offset={["start start", "end end"]}
          position="inline"
          className="absolute inset-x-0 -bottom-px h-px bg-transparent"
        />
      </header>

      <article ref={article} className="mx-auto max-w-2xl px-6 pt-8 pb-16">
        <h3 className="text-2xl font-semibold tracking-tight">
          写给产品团队的动效原则
        </h3>
        <p className="text-muted-foreground mt-2 text-sm">
          陈默 · 2026 年 9 月 · 阅读约 4 分钟
        </p>

        {sections.map((section) => (
          <section key={section.title} className="mt-8 space-y-3">
            <h4 className="font-medium">{section.title}</h4>
            {section.body.map((paragraph) => (
              <p
                key={paragraph}
                className="text-muted-foreground text-sm leading-7"
              >
                {paragraph}
              </p>
            ))}
          </section>
        ))}
      </article>
    </div>
  )
}
