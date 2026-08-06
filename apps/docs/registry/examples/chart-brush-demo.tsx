"use client"

import * as React from "react"

import { ChartBrush } from "@/registry/charts/chart-brush"
import { LineChart } from "@/registry/charts/line-chart"

const data = Array.from({ length: 24 }, (_, index) => ({
  week: `W${index + 1}`,
  active: 1800 + index * 92 + Math.round(Math.sin(index * 0.8) * 260),
}))

export default function ChartBrushDemo() {
  const [range, setRange] = React.useState<[number, number]>([8, 23])
  const visibleData = data.slice(range[0], range[1] + 1)

  return (
    <div className="w-full max-w-3xl">
      <LineChart
        title="周活跃用户"
        description={`${data[range[0]].week}–${data[range[1]].week} · 拖动下方范围调整`}
        data={visibleData}
        xKey="week"
        series={[{ key: "active", label: "周活" }]}
        showDots={false}
      />
      <ChartBrush
        data={data}
        labelKey="week"
        value={range}
        onValueChange={setRange}
        minPoints={4}
      />
    </div>
  )
}
