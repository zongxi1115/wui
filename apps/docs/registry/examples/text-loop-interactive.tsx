"use client"

import * as React from "react"
import { Pause, Play, Sparkles } from "lucide-react"

import { Button } from "@/registry/ui/button"
import { TextLoop } from "@/registry/ui/text-loop"

const testimonials = [
  {
    author: "Alex Rivers",
    role: "Staff Engineer @ Vercel",
    quote: "WUI cut our design system migration time in half. Flawless animations out of the box.",
  },
  {
    author: "Elena Rostova",
    role: "Design Lead @ Stripe",
    quote: "The accessibility guarantees and micro-interactions give our web app a native feel.",
  },
  {
    author: "David Chen",
    role: "CTO @ Supabase",
    quote: "Extensible, clean code with zero jank. Our engineering team loves working with it.",
  },
]

export default function TextLoopInteractive() {
  const [currentIndex, setCurrentIndex] = React.useState(0)
  const [isPlaying, setIsPlaying] = React.useState(true)
  const [isHovered, setIsHovered] = React.useState(false)

  const active = isPlaying && !isHovered

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="flex w-full max-w-lg flex-col gap-4 rounded-xl border border-border bg-card p-6 shadow-xs"
    >
      <div className="flex items-center justify-between border-b border-border pb-3">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
          <Sparkles className="size-3.5 text-primary" />
          <span>Customer Testimonials</span>
          {isHovered && (
            <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
              悬停已暂停
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Step indicator dots */}
          <div className="flex items-center gap-1">
            {testimonials.map((_, i) => (
              <span
                key={i}
                className={`size-1.5 rounded-full transition-all ${
                  currentIndex === i ? "w-4 bg-primary" : "bg-muted-foreground/30"
                }`}
              />
            ))}
          </div>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-6"
            onClick={() => setIsPlaying((prev) => !prev)}
            aria-label={isPlaying ? "暂停轮播" : "继续轮播"}
          >
            {isPlaying ? (
              <Pause className="size-3 text-muted-foreground" />
            ) : (
              <Play className="size-3 text-primary" />
            )}
          </Button>
        </div>
      </div>

      <div className="min-h-24">
        <TextLoop
          interval={3.5}
          trigger={active}
          onIndexChange={setCurrentIndex}
          className="w-full"
        >
          {testimonials.map((item, index) => (
            <div key={index} className="space-y-2">
              <p className="text-xs italic leading-relaxed text-foreground">
                "{item.quote}"
              </p>
              <div className="flex items-center gap-2 text-[11px]">
                <span className="font-semibold text-foreground">{item.author}</span>
                <span className="text-muted-foreground">•</span>
                <span className="text-muted-foreground">{item.role}</span>
              </div>
            </div>
          ))}
        </TextLoop>
      </div>
    </div>
  )
}
