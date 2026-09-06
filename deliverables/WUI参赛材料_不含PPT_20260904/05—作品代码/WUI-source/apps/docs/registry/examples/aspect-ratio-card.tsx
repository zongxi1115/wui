"use client"

import { PlayIcon } from "lucide-react"

import { AspectRatio } from "@/registry/ui/aspect-ratio"
import { Badge } from "@/registry/ui/badge"

export default function AspectRatioCard() {
  return (
    <div className="w-full max-w-sm overflow-hidden rounded-xl border bg-card text-card-foreground shadow-xs transition-all hover:shadow-md">
      {/* 16:9 视频封面与时长浮层 */}
      <AspectRatio ratio={16 / 9} className="bg-muted">
        <img
          src="/wui/demo/field-notes/coastal-hill.jpg"
          alt="Next.js 15 全栈实战课程"
          className="size-full object-cover transition-transform duration-300 hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end justify-between p-3">
          <Badge variant="secondary" className="bg-black/60 text-white backdrop-blur-xs border-0 text-[10px]">
            全高清 4K
          </Badge>
          <span className="rounded bg-black/70 px-1.5 py-0.5 font-mono text-[10px] text-white">
            18:24
          </span>
        </div>
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="flex size-10 items-center justify-center rounded-full bg-white/90 text-black shadow-md backdrop-blur-xs">
            <PlayIcon className="size-4 fill-current ml-0.5" />
          </div>
        </div>
      </AspectRatio>

      {/* 视频元数据 */}
      <div className="p-4 space-y-2">
        <h3 className="font-semibold text-sm line-clamp-1">
          Next.js 15 全栈架构与性能调优指南
        </h3>
        <p className="text-xs text-muted-foreground line-clamp-2">
          深入剖析 Server Components 与流式 SSR 渲染原理，以及如何在复杂生产环境中实现极致性能。
        </p>
        <div className="pt-2 flex items-center justify-between text-[11px] text-muted-foreground border-t">
          <span>讲师：Alex Zhang</span>
          <span>2.4k 次播放</span>
        </div>
      </div>
    </div>
  )
}
