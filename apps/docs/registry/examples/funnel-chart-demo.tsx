"use client"

import * as React from "react"
import { Badge } from "@/registry/ui/badge"
import { FunnelChart } from "@/registry/charts/funnel-chart"

const CONVERSION_DATA = [
  { stage: "首页访问 (Visitors)", count: 120000 },
  { stage: "查看定价与文档 (Engaged)", count: 64000 },
  { stage: "注册试用 (Signups)", count: 28000 },
  { stage: "创建首个项目 (Active)", count: 14500 },
  { stage: "升级付费版 (Paid)", count: 4800 },
]

export default function FunnelChartDemo() {
  return (
    <div className="w-full max-w-xl">
      <FunnelChart
        title="用户获取与付费漏斗"
        description="从访问到订阅的流束 · 每一刻度 = 2,000 人"
        source="HOURGLASS STREAM · ACQUISITION · GROWTH"
        actions={
          <Badge variant="secondary" className="text-[10px] py-0">
            总转化率 4.0%
          </Badge>
        }
        data={CONVERSION_DATA}
        nameKey="stage"
        valueKey="count"
        valueFormatter={(val) => `${val.toLocaleString()} 人`}
        tickStep={2000}
        height={320}
      />
    </div>
  )
}
