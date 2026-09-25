"use client"

import * as React from "react"
import { motion } from "motion/react"

import { cn } from "@/registry/lib/utils"
import { ScrollSnap, ScrollSnapItem } from "@/registry/ui/scroll-snap"

const slides = [
  {
    kicker: "第一章",
    title: "清晨五点的湖面",
    body: "风还没醒，水面像一块没有打磨过的镜子。",
    image:
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1400&q=80",
  },
  {
    kicker: "第二章",
    title: "穿过雾里的松林",
    body: "能见度只有十米，脚下的路是唯一的参照。",
    image:
      "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1400&q=80",
  },
  {
    kicker: "第三章",
    title: "山顶的星轨",
    body: "零下九度，我们等了四个小时，只为这一张照片。",
    image:
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1400&q=80",
  },
]

export default function ScrollSnapDemo() {
  const [active, setActive] = React.useState(0)
  const rootRef = React.useRef<HTMLDivElement>(null)

  return (
    <div className="relative h-[26rem] w-full overflow-hidden rounded-b-lg">
      <ScrollSnap
        ref={rootRef}
        hideScrollbar
        onActiveChange={setActive}
        className="h-full"
      >
        {slides.map((slide, index) => (
          <ScrollSnapItem
            key={slide.title}
            stop
            className="relative flex h-full items-end overflow-hidden"
          >
            <img
              src={slide.image}
              alt={slide.title}
              className="bg-muted absolute inset-0 size-full object-cover"
            />
            <div className="absolute inset-0 bg-black/35" />
            <motion.div
              className="relative p-8 text-white sm:p-10"
              initial={false}
              animate={
                active === index
                  ? { opacity: 1, y: 0, filter: "blur(0px)" }
                  : { opacity: 0, y: 24, filter: "blur(6px)" }
              }
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="text-sm text-white/70">{slide.kicker}</p>
              <h3 className="mt-1 text-3xl font-semibold tracking-tight">
                {slide.title}
              </h3>
              <p className="mt-2 max-w-sm text-sm leading-6 text-white/80">
                {slide.body}
              </p>
            </motion.div>
          </ScrollSnapItem>
        ))}
      </ScrollSnap>

      <div className="absolute top-1/2 right-5 flex -translate-y-1/2 flex-col gap-2">
        {slides.map((slide, index) => (
          <button
            key={slide.title}
            type="button"
            aria-label={`跳转到${slide.kicker}`}
            aria-current={active === index}
            onClick={() =>
              rootRef.current?.scrollTo({
                top: index * rootRef.current.clientHeight,
                behavior: "smooth",
              })
            }
            className="flex h-6 w-3 items-center justify-center"
          >
            <span
              className={cn(
                "w-1 rounded-full bg-white transition-all duration-300",
                active === index ? "h-6 opacity-100" : "h-1.5 opacity-50"
              )}
            />
          </button>
        ))}
      </div>
    </div>
  )
}
