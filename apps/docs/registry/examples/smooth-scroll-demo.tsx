"use client"

import * as React from "react"
import { useLenis } from "lenis/react"
import { motion, useMotionValue } from "motion/react"

import { SmoothScroll } from "@/registry/ui/smooth-scroll"

const articles = [
  {
    tag: "设计系统",
    title: "为什么我们把圆角从 16px 收回到 8px",
    summary:
      "大圆角在营销页很讨喜，放进高密度的后台界面却显得松散。我们用两周时间回收了 40 个组件的圆角规范。",
    meta: "陈默 · 6 分钟",
  },
  {
    tag: "动效",
    title: "弹簧参数的直觉：刚度、阻尼与质量",
    summary:
      "把弹簧当作三个旋钮来理解：刚度决定快慢，阻尼决定是否回弹，质量决定手感的轻重。",
    meta: "林知夏 · 9 分钟",
  },
  {
    tag: "工程",
    title: "滚动驱动动画的性能清单",
    summary:
      "只动 transform 与 opacity，避免在滚动回调里 setState，把测量放进 ResizeObserver。",
    meta: "周屿 · 7 分钟",
  },
  {
    tag: "研究",
    title: "用户真的会注意到 120Hz 吗",
    summary:
      "我们让 32 位参与者盲测了三种滚动曲线，结论比预想得更微妙：惯性比帧率更影响感知。",
    meta: "许然 · 11 分钟",
  },
  {
    tag: "可访问性",
    title: "尊重“减少动态效果”不等于关掉一切",
    summary:
      "保留状态变化的反馈，去掉位移与缩放，是大多数场景下更稳妥的降级策略。",
    meta: "陈默 · 5 分钟",
  },
  {
    tag: "设计系统",
    title: "一套 Token 如何同时服务亮色与暗色",
    summary:
      "语义化命名让主题切换只改一处，组件代码里不再出现任何具体色值。",
    meta: "林知夏 · 8 分钟",
  },
]

function Feed() {
  return (
    <ol className="divide-y">
      {articles.map((article, index) => (
        <li key={article.title} className="flex gap-4 px-5 py-5">
          <span className="text-muted-foreground w-5 pt-0.5 font-mono text-xs tabular-nums">
            {String(index + 1).padStart(2, "0")}
          </span>
          <div className="min-w-0 space-y-1.5">
            <p className="text-muted-foreground text-xs">{article.tag}</p>
            <h4 className="text-sm leading-snug font-medium">
              {article.title}
            </h4>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {article.summary}
            </p>
            <p className="text-muted-foreground/80 text-xs">{article.meta}</p>
          </div>
        </li>
      ))}
    </ol>
  )
}

function LenisProgress() {
  const progress = useMotionValue(0)
  useLenis((lenis) => progress.set(lenis.progress))

  return (
    <motion.div
      aria-hidden="true"
      className="bg-foreground sticky top-0 z-10 h-0.5 origin-left"
      style={{ scaleX: progress }}
    />
  )
}

function PanelHeader({ title, hint }: { title: string; hint: string }) {
  return (
    <div className="bg-background flex items-center justify-between border-b px-5 py-3">
      <span className="text-sm font-medium">{title}</span>
      <span className="text-muted-foreground text-xs">{hint}</span>
    </div>
  )
}

export default function SmoothScrollDemo() {
  return (
    <div className="bg-border grid w-full gap-px overflow-hidden rounded-b-lg md:grid-cols-2">
      <div className="bg-background">
        <PanelHeader title="原生滚动" hint="浏览器默认" />
        <div className="h-[24rem] overflow-y-auto">
          <Feed />
        </div>
      </div>
      <div className="bg-background">
        <PanelHeader title="SmoothScroll" hint="Lenis 惯性插值" />
        <SmoothScroll
          root={false}
          options={{ lerp: 0.08, wheelMultiplier: 0.9 }}
          className="h-[24rem] overflow-y-auto"
        >
          <LenisProgress />
          <Feed />
        </SmoothScroll>
      </div>
    </div>
  )
}
