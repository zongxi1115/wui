"use client"

import * as React from "react"
import { SparklesIcon, ZapIcon } from "lucide-react"
import { Glow } from "@/registry/ui/glow"

export default function GlowBadge() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-6 p-4">
      {/* 1. Rainbow Glow Pill */}
      <Glow
        variant="rainbow"
        spread={12}
        borderWidth={1}
        duration={3}
        className="rounded-full"
      >
        <div className="flex items-center gap-2 rounded-full bg-background px-4 py-1.5 text-xs font-medium text-foreground">
          <SparklesIcon className="size-3.5 text-primary" />
          <span>全新 AI 4.0 架构预览版上线</span>
        </div>
      </Glow>

      {/* 2. Solid Emerald Glow Pill */}
      <Glow
        variant="solid"
        color="oklch(0.7 0.18 150)"
        spread={14}
        borderWidth={1}
        pulse
        className="rounded-full"
      >
        <div className="flex items-center gap-2 rounded-full bg-background px-4 py-1.5 text-xs font-medium text-foreground">
          <span className="size-2 rounded-full bg-emerald-500" />
          <span>所有服务集群正常运行 (99.99%)</span>
        </div>
      </Glow>

      {/* 3. Solid Amber Glow Pill */}
      <Glow
        variant="solid"
        color="oklch(0.75 0.18 60)"
        spread={14}
        borderWidth={1}
        pulse
        duration={2}
        className="rounded-full"
      >
        <div className="flex items-center gap-2 rounded-full bg-background px-4 py-1.5 text-xs font-medium text-foreground">
          <ZapIcon className="size-3.5 text-amber-500" />
          <span>限时早鸟 5 折优惠</span>
        </div>
      </Glow>
    </div>
  )
}
