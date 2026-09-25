"use client"

import * as React from "react"
import { CpuIcon, MemoryStickIcon, MoreHorizontalIcon, ServerIcon } from "lucide-react"

import { Badge } from "@/registry/ui/badge"
import { Button } from "@/registry/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/registry/ui/card"
import { Progress } from "@/registry/ui/progress"

export default function CardBusiness() {
  const [restarting, setRestarting] = React.useState(false)
  const [cpu, setCpu] = React.useState(42)
  const memory = restarting ? 12 : 43

  React.useEffect(() => {
    if (restarting) {
      const timer = window.setTimeout(() => setRestarting(false), 2400)
      return () => window.clearTimeout(timer)
    }
    const timer = window.setInterval(() => {
      setCpu((current) =>
        Math.min(88, Math.max(18, current + Math.round((Math.random() - 0.5) * 18)))
      )
    }, 1600)
    return () => window.clearInterval(timer)
  }, [restarting])

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="bg-muted text-muted-foreground flex size-9 items-center justify-center rounded-md">
            <ServerIcon className="size-4" />
          </div>
          <div className="min-w-0">
            <CardTitle className="font-mono text-sm tracking-normal">
              api-gateway-sh-01
            </CardTitle>
            <CardDescription className="text-xs">
              华东 2（上海）· c7.2xlarge · 10.0.12.84
            </CardDescription>
          </div>
        </div>
        <CardAction>
          <Button variant="ghost" size="icon" className="text-muted-foreground size-8" aria-label="更多操作">
            <MoreHorizontalIcon />
          </Button>
        </CardAction>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground flex items-center gap-1.5">
              <CpuIcon className="size-3.5" />
              CPU 使用率
            </span>
            <span className="font-medium tabular-nums">{restarting ? "—" : `${cpu}%`}</span>
          </div>
          <Progress
            value={restarting ? null : cpu}
            color={cpu >= 80 ? "warning" : "primary"}
            aria-label="CPU 使用率"
          />
        </div>
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground flex items-center gap-1.5">
              <MemoryStickIcon className="size-3.5" />
              内存
            </span>
            <span className="font-medium tabular-nums">
              {((16 * memory) / 100).toFixed(1)} / 16 GB
            </span>
          </div>
          <Progress value={memory} aria-label="内存使用率" />
        </div>
      </CardContent>

      <CardFooter className="justify-between border-t pt-4">
        <div className="flex items-center gap-2">
          <Badge variant={restarting ? "warning" : "success"} size="sm">
            {restarting ? "重启中" : "运行中"}
          </Badge>
          <span className="text-muted-foreground text-xs">可用性 99.98%</span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            日志
          </Button>
          <Button size="sm" disabled={restarting} onClick={() => {
              setRestarting(true)
              setCpu(24)
            }}>
            重启
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
