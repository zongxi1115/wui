"use client"

import * as React from "react"
import { Badge } from "@/registry/ui/badge"
import { Heatmap, type HeatmapDatum } from "@/registry/charts/heatmap"

export default function HeatmapDemo() {
  const data: HeatmapDatum[] = React.useMemo(() => {
    const list: HeatmapDatum[] = []
    const now = new Date("2026-08-15")
    for (let i = 180; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
      const year = d.getFullYear()
      const month = String(d.getMonth() + 1).padStart(2, "0")
      const day = String(d.getDate()).padStart(2, "0")
      const date = `${year}-${month}-${day}`
      // Random commits with occasional zero days
      const rand = Math.random()
      const value = rand > 0.3 ? Math.floor(rand * 12) : 0
      list.push({ date, value })
    }
    return list
  }, [])

  return (
    <div className="w-full max-w-2xl">
      <Heatmap
        title="代码提交与审查动态"
        description="过去半年内的主分支合并与工作流触发记录"
        actions={
          <Badge variant="secondary" className="text-[10px] py-0">
            共 648 次提交
          </Badge>
        }
        data={data}
        startDate="2026-02-15"
        endDate="2026-08-15"
        cellSize={12}
        cellGap={3}
      />
    </div>
  )
}
