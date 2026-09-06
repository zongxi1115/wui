"use client"

import * as React from "react"
import { CpuIcon, LayersIcon, ShieldCheckIcon } from "lucide-react"
import { SpotlightCard } from "@/registry/ui/spotlight-card"

export default function SpotlightCardColors() {
  return (
    <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-3">
      <SpotlightCard
        color="rgba(16, 185, 129, 0.18)"
        radius={200}
        className="rounded-xl border bg-card p-5 shadow-xs"
      >
        <div className="flex size-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500">
          <ShieldCheckIcon className="size-5" />
        </div>
        <h4 className="mt-3 text-sm font-semibold">端到端数据加密</h4>
        <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
          全链路密文存储与传输，满足金融级合规与隐私安全标准。
        </p>
      </SpotlightCard>

      <SpotlightCard
        color="rgba(139, 92, 246, 0.18)"
        radius={200}
        className="rounded-xl border bg-card p-5 shadow-xs"
      >
        <div className="flex size-9 items-center justify-center rounded-lg bg-violet-500/10 text-violet-500">
          <CpuIcon className="size-5" />
        </div>
        <h4 className="mt-3 text-sm font-semibold">智能推理引擎</h4>
        <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
          基于异构算力的高吞吐并行推理，毫秒级响应海量并发。
        </p>
      </SpotlightCard>

      <SpotlightCard
        color="rgba(14, 165, 233, 0.18)"
        radius={200}
        className="rounded-xl border bg-card p-5 shadow-xs"
      >
        <div className="flex size-9 items-center justify-center rounded-lg bg-sky-500/10 text-sky-500">
          <LayersIcon className="size-5" />
        </div>
        <h4 className="mt-3 text-sm font-semibold">弹性多租户架构</h4>
        <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
          资源按需分配与动态隔离，保障高可用与低延迟体验。
        </p>
      </SpotlightCard>
    </div>
  )
}
