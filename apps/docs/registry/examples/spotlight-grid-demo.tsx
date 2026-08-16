import { Activity, Globe, Server, ShieldCheck, Zap } from "lucide-react"

import { Badge } from "@/registry/ui/badge"
import { Button } from "@/registry/ui/button"
import { SpotlightGrid } from "@/registry/ui/spotlight-grid"

export default function SpotlightGridDemo() {
  return (
    <SpotlightGrid
      className="relative w-full rounded-2xl border border-border bg-card p-8 text-card-foreground shadow-lg sm:p-10"
      pattern="grid"
      size={32}
      radius={240}
      patternColor="var(--primary)"
      baseOpacity={0.06}
    >
      <div className="relative z-10 space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <span className="relative flex size-2.5">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-500 opacity-75" />
              <span className="relative inline-flex size-2.5 rounded-full bg-emerald-500" />
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              320+ Edge Nodes Active
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="outline" className="gap-1 text-xs">
              <Globe className="size-3 text-sky-500" />
              Global Mesh
            </Badge>
            <Badge variant="outline" className="gap-1 text-xs">
              <ShieldCheck className="size-3 text-emerald-500" />
              DDoS Shield
            </Badge>
          </div>
        </div>

        <div>
          <h3 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Autonomous Cloud Infrastructure
          </h3>
          <p className="mt-2.5 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            Hover and move your cursor across the panel to inspect the active
            routing matrix. High-frequency traffic balances automatically in
            real time.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-border bg-background/80 p-4 backdrop-blur-md">
            <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
              <Zap className="size-3.5 text-amber-500" />
              p99 Latency
            </div>
            <div className="mt-2 text-2xl font-bold tracking-tight text-foreground">
              11.4 ms
            </div>
            <div className="mt-1 text-[11px] text-emerald-600 dark:text-emerald-400">
              ↓ 34% faster than baseline
            </div>
          </div>

          <div className="rounded-xl border border-border bg-background/80 p-4 backdrop-blur-md">
            <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
              <Activity className="size-3.5 text-sky-500" />
              Availability
            </div>
            <div className="mt-2 text-2xl font-bold tracking-tight text-foreground">
              99.995%
            </div>
            <div className="mt-1 text-[11px] text-muted-foreground">
              Zero downtime deployments
            </div>
          </div>

          <div className="rounded-xl border border-border bg-background/80 p-4 backdrop-blur-md">
            <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
              <Server className="size-3.5 text-indigo-500" />
              Throughput
            </div>
            <div className="mt-2 text-2xl font-bold tracking-tight text-foreground">
              4.2M req/s
            </div>
            <div className="mt-1 text-[11px] text-muted-foreground">
              Distributed edge compute
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <span className="text-xs text-muted-foreground">
            Move pointer to reveal coordinate grid
          </span>
          <Button size="sm" className="gap-2">
            Launch Cluster
          </Button>
        </div>
      </div>
    </SpotlightGrid>
  )
}
