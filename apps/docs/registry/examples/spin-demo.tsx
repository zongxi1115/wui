"use client"

import * as React from "react"
import { RefreshCwIcon } from "lucide-react"

import { Button } from "@/registry/ui/button"
import { Spin } from "@/registry/ui/spin"

const snapshots = [
  { projects: 24, shipped: 8, pending: 13 },
  { projects: 25, shipped: 9, pending: 11 },
  { projects: 25, shipped: 11, pending: 9 },
]

export default function SpinDemo() {
  const [loading, setLoading] = React.useState(false)
  const [version, setVersion] = React.useState(0)
  const data = snapshots[version % snapshots.length]

  React.useEffect(() => {
    if (!loading) return
    const timer = window.setTimeout(() => {
      setVersion((value) => value + 1)
      setLoading(false)
    }, 1400)
    return () => window.clearTimeout(timer)
  }, [loading])

  return (
    <div className="grid w-full max-w-xl gap-5">
      <div className="flex items-end gap-8 border-b pb-5">
        <Spin size="sm" label="同步中" />
        <Spin label="加载中" />
        <Spin size="lg" />
      </div>
      <Spin spinning={loading} label="正在刷新数据…" delay={120}>
        <div className="grid grid-cols-3 rounded-md border">
          {[
            ["活跃项目", data.projects],
            ["本周交付", data.shipped],
            ["待处理", data.pending],
          ].map(([label, value]) => (
            <div key={label} className="border-r p-4 last:border-r-0">
              <p className="text-muted-foreground text-xs">{label}</p>
              <p className="mt-1 text-xl font-semibold tabular-nums">{value}</p>
            </div>
          ))}
        </div>
      </Spin>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="w-fit"
        disabled={loading}
        onClick={() => setLoading(true)}
      >
        <RefreshCwIcon />
        刷新数据
      </Button>
    </div>
  )
}
