import {
  ArrowRightIcon,
  CpuIcon,
  RadioIcon,
  SparklesIcon,
} from "lucide-react"

import { Badge } from "@/registry/ui/badge"
import { Button } from "@/registry/ui/button"
import { Glow } from "@/registry/ui/glow"

export default function GlowDemo() {
  return (
    <div className="grid w-full grid-cols-1 gap-8 p-4 sm:grid-cols-2 sm:p-8">
      {/* 1. Rainbow Glow Variant */}
      <Glow spread={22} borderWidth={1.5} className="rounded-2xl">
        <div className="bg-card text-card-foreground flex h-full flex-col justify-between rounded-2xl p-6">
          <div>
            <div className="flex items-center justify-between">
              <div className="bg-primary/10 text-primary flex size-9 items-center justify-center rounded-xl">
                <SparklesIcon className="size-4" />
              </div>
              <Badge variant="outline" className="font-mono text-[10px]">
                FLAGSHIP AI
              </Badge>
            </div>

            <h4 className="mt-4 text-base font-semibold tracking-tight">
              Neural Inference Engine
            </h4>
            <p className="text-muted-foreground mt-2 text-xs leading-relaxed">
              Executes multi-step reasoning trees with real-time tool orchestration
              and speculative token decoding.
            </p>
          </div>

          <div className="mt-6 border-t pt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
                <CpuIcon className="size-3.5" />
                <span>140 TPS · 42ms</span>
              </div>
              <Button size="sm" className="h-8 gap-1.5 px-3 text-xs">
                Launch
                <ArrowRightIcon className="size-3.5" />
              </Button>
            </div>
          </div>
        </div>
      </Glow>

      {/* 2. Solid Glow Variant */}
      <Glow
        variant="solid"
        color="oklch(0.7 0.16 160)"
        spread={20}
        borderWidth={1.5}
        pulse
        className="rounded-2xl"
      >
        <div className="bg-card text-card-foreground flex h-full flex-col justify-between rounded-2xl p-6">
          <div>
            <div className="flex items-center justify-between">
              <div className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex size-9 items-center justify-center rounded-xl">
                <RadioIcon className="size-4" />
              </div>
              <div className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-mono text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                  HEALTHY
                </span>
              </div>
            </div>

            <h4 className="mt-4 text-base font-semibold tracking-tight">
              Edge Consensus Cluster
            </h4>
            <p className="text-muted-foreground mt-2 text-xs leading-relaxed">
              Distributed state sync with automated partition tolerance across
              12 global availability regions.
            </p>
          </div>

          <div className="mt-6 border-t pt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
                <span>12 Regions · Zero Loss</span>
              </div>
              <Button
                variant="secondary"
                size="sm"
                className="h-8 px-3 text-xs"
              >
                Telemetry
              </Button>
            </div>
          </div>
        </div>
      </Glow>
    </div>
  )
}
