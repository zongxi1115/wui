"use client"

import * as React from "react"
import { Badge } from "@/registry/ui/badge"
import { Button } from "@/registry/ui/button"
import { GaugeChart } from "@/registry/charts/gauge-chart"

export default function GaugeChartDemo() {
  const [value, setValue] = React.useState(74)

  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      <GaugeChart
        title="GPU 计算集群负载"
        description="集群综合显存占用率与计算负荷监控"
        actions={
          <Badge variant="outline" className="text-[10px] py-0">
            实时刷新
          </Badge>
        }
        value={value}
        unit="%"
        zones={[
          { from: 0, to: 60, color: "var(--chart-2)", label: "正常 (0-60%)" },
          { from: 60, to: 85, color: "var(--chart-4)", label: "较高 (60-85%)" },
          { from: 85, to: 100, color: "var(--destructive)", label: "过载 (85%+)" },
        ]}
      />

      <div className="flex items-center justify-center gap-2">
        <Button variant="outline" size="sm" onClick={() => setValue(35)}>
          轻载 (35%)
        </Button>
        <Button variant="outline" size="sm" onClick={() => setValue(74)}>
          中载 (74%)
        </Button>
        <Button variant="outline" size="sm" onClick={() => setValue(92)}>
          高载 (92%)
        </Button>
      </div>
    </div>
  )
}
