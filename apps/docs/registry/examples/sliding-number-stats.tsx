"use client"

import * as React from "react"
import { Activity, ArrowDownRight, ArrowUpRight, RefreshCw, Users, Zap } from "lucide-react"

import { Button } from "@/registry/ui/button"
import { SlidingNumber } from "@/registry/ui/sliding-number"

export default function SlidingNumberStats() {
  const [activeUsers, setActiveUsers] = React.useState(24580)
  const [requestsPerSec, setRequestsPerSec] = React.useState(1842)
  const [avgLatency, setAvgLatency] = React.useState(24.8)

  const handleSimulateTraffic = () => {
    setActiveUsers((prev) => prev + Math.floor((Math.random() - 0.4) * 450))
    setRequestsPerSec((prev) => prev + Math.floor((Math.random() - 0.4) * 120))
    setAvgLatency((prev) => Number((prev + (Math.random() - 0.5) * 4).toFixed(1)))
  }

  return (
    <div className="flex w-full max-w-2xl flex-col gap-5 rounded-xl border border-border bg-card p-6 shadow-xs">
      <div className="flex items-center justify-between border-b border-border pb-3">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          实时遥测指标监控面板
        </span>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleSimulateTraffic}
          className="gap-1.5 text-xs"
        >
          <RefreshCw className="size-3" />
          模拟实时流量波动
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {/* Card 1 */}
        <div className="space-y-2 rounded-lg border border-border bg-muted/20 p-4">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">在线活跃用户</span>
            <Users className="size-4 text-primary" />
          </div>
          <div className="font-mono text-2xl font-bold tracking-tight text-foreground">
            <SlidingNumber value={activeUsers} />
          </div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400">
            <ArrowUpRight className="size-3" />
            <span>+12.4% vs 上周</span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="space-y-2 rounded-lg border border-border bg-muted/20 p-4">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">请求速率 (RPS)</span>
            <Zap className="size-4 text-amber-500" />
          </div>
          <div className="font-mono text-2xl font-bold tracking-tight text-foreground">
            <SlidingNumber value={requestsPerSec} />
            <span className="text-xs font-normal text-muted-foreground ml-1">/s</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400">
            <ArrowUpRight className="size-3" />
            <span>+4.2% 负载增长</span>
          </div>
        </div>

        {/* Card 3 */}
        <div className="space-y-2 rounded-lg border border-border bg-muted/20 p-4">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">P99 平均延迟</span>
            <Activity className="size-4 text-blue-500" />
          </div>
          <div className="font-mono text-2xl font-bold tracking-tight text-foreground">
            <SlidingNumber value={avgLatency} />
            <span className="text-xs font-normal text-muted-foreground ml-1">ms</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400">
            <ArrowDownRight className="size-3" />
            <span>-1.8ms 性能优化</span>
          </div>
        </div>
      </div>
    </div>
  )
}
