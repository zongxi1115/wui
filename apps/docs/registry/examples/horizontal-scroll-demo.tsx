"use client"

import * as React from "react"

import { HorizontalScroll } from "@/registry/ui/horizontal-scroll"

const works = [
  {
    title: "北岸美术馆",
    meta: "文化空间 · 杭州",
    year: "2026",
    image:
      "https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "松间茶室",
    meta: "室内设计 · 莫干山",
    year: "2025",
    image:
      "https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "云栖办公园区",
    meta: "办公空间 · 深圳",
    year: "2025",
    image:
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "临湖书房",
    meta: "住宅改造 · 苏州",
    year: "2024",
    image:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=900&q=80",
  },
]

export default function HorizontalScrollDemo() {
  const container = React.useRef<HTMLDivElement>(null)

  return (
    <div
      ref={container}
      className="h-[26rem] w-full overflow-y-auto rounded-b-lg"
    >
      <HorizontalScroll
        container={container}
        trackClassName="items-center gap-6 px-6 sm:px-10"
      >
        <div className="flex w-64 shrink-0 flex-col gap-3">
          <p className="text-muted-foreground text-sm">精选作品 2024–2026</p>
          <h3 className="text-3xl font-semibold tracking-tight">
            空间里的
            <br />
            安静与秩序
          </h3>
          <p className="text-muted-foreground text-sm leading-6">
            继续向下滚动，纵向滚动会被转换为横向浏览。
          </p>
        </div>

        {works.map((work, index) => (
          <figure key={work.title} className="w-[18rem] shrink-0 sm:w-[22rem]">
            <img
              src={work.image}
              alt={work.title}
              className="bg-muted aspect-[4/3] w-full rounded-md object-cover"
            />
            <figcaption className="mt-3 flex items-baseline justify-between gap-4">
              <div>
                <p className="font-medium">{work.title}</p>
                <p className="text-muted-foreground text-sm">{work.meta}</p>
              </div>
              <span className="text-muted-foreground font-mono text-xs">
                {String(index + 1).padStart(2, "0")} / {work.year}
              </span>
            </figcaption>
          </figure>
        ))}
      </HorizontalScroll>

      <div className="text-muted-foreground flex h-40 items-center justify-center text-sm">
        浏览结束，页面恢复纵向滚动
      </div>
    </div>
  )
}
