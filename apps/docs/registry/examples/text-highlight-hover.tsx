"use client"

import * as React from "react"
import { ArrowUpRightIcon } from "lucide-react"

import { TextHighlight } from "@/registry/ui/text-highlight"

const guides = [
  { title: "五分钟搭建第一个工作区", meta: "入门 · 5 分钟" },
  { title: "用自动化替代重复的周报整理", meta: "进阶 · 12 分钟" },
  { title: "为外部协作者配置最小权限", meta: "安全 · 8 分钟" },
]

function GuideLink({ title, meta }: { title: string; meta: string }) {
  const [active, setActive] = React.useState(false)

  return (
    <a
      href="#"
      onClick={(event) => event.preventDefault()}
      onPointerEnter={() => setActive(true)}
      onPointerLeave={() => setActive(false)}
      onFocus={() => setActive(true)}
      onBlur={() => setActive(false)}
      className="flex items-center justify-between gap-4 rounded-sm py-3 outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
    >
      <span className="flex flex-col gap-0.5">
        <TextHighlight
          active={active}
          variant="underline"
          duration={0.45}
          className="w-fit text-sm font-medium"
        >
          {title}
        </TextHighlight>
        <span className="text-xs text-muted-foreground">{meta}</span>
      </span>
      <ArrowUpRightIcon
        data-active={active ? "" : undefined}
        className="size-4 text-muted-foreground transition-transform duration-300 data-active:-translate-y-0.5 data-active:translate-x-0.5 data-active:text-foreground"
      />
    </a>
  )
}

export default function TextHighlightHover() {
  return (
    <ul className="flex w-full max-w-md flex-col divide-y border-y">
      {guides.map((guide) => (
        <li key={guide.title}>
          <GuideLink title={guide.title} meta={guide.meta} />
        </li>
      ))}
    </ul>
  )
}
