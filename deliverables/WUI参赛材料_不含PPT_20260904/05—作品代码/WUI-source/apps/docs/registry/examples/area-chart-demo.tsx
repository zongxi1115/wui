"use client"

import * as React from "react"
import { RotateCcwIcon } from "lucide-react"

import { AreaChart } from "@/registry/charts/area-chart"
import { Button } from "@/registry/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/registry/ui/select"
import { Toolbar, ToolbarButton } from "@/registry/ui/toolbar"

const data = [
  { month: "1月", active: 1820 },
  { month: "2月", active: 2140 },
  { month: "3月", active: 2380 },
  { month: "4月", active: 2310 },
  { month: "5月", active: 2670 },
  { month: "6月", active: 2840 },
  { month: "7月", active: 3120 },
  { month: "8月", active: 3460 },
  { month: "9月", active: 3310 },
  { month: "10月", active: 3740 },
  { month: "11月", active: 4020 },
  { month: "12月", active: 4380 },
]

export default function AreaChartDemo() {
  const [range, setRange] = React.useState("12")
  const visibleData = data.slice(-Number(range))

  return (
    <div className="w-full max-w-3xl">
      <AreaChart
        title="月活跃用户"
        description={`最近 ${range} 个月 · 单位：人`}
        data={visibleData}
        xKey="month"
        series={[{ key: "active", label: "月活" }]}
        referenceLines={[{ value: 3500, label: "目标 3,500" }]}
        actions={
          <Toolbar aria-label="图表工具">
            <Select value={range} onValueChange={setRange}>
              <SelectTrigger
                size="sm"
                className="min-w-24"
                aria-label="时间范围"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="6">近 6 月</SelectItem>
                <SelectItem value="12">近 12 月</SelectItem>
              </SelectContent>
            </Select>
            <ToolbarButton>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-8"
                aria-label="重置时间范围"
                onClick={() => setRange("12")}
              >
                <RotateCcwIcon />
              </Button>
            </ToolbarButton>
          </Toolbar>
        }
        valueFormatter={(value) => `${value.toLocaleString("zh-CN")} 人`}
      />
    </div>
  )
}
