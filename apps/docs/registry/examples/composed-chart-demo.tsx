import { ComposedChart } from "@/registry/charts/composed-chart"

const data = [
  { month: "1月", revenue: 182, conversion: 2.8 },
  { month: "2月", revenue: 214, conversion: 3.1 },
  { month: "3月", revenue: 238, conversion: 3.0 },
  { month: "4月", revenue: 267, conversion: 3.5 },
  { month: "5月", revenue: 284, conversion: 3.8 },
  { month: "6月", revenue: 312, conversion: 4.1 },
  { month: "7月", revenue: 346, conversion: 4.0 },
  { month: "8月", revenue: 381, conversion: 4.4 },
]

export default function ComposedChartDemo() {
  return (
    <div className="w-full max-w-3xl">
      <ComposedChart
        title="收入与转化率"
        description="月度数据 · 左轴万元，右轴百分比"
        data={data}
        xKey="month"
        series={[
          { key: "revenue", label: "收入", type: "bar", axis: "left" },
          {
            key: "conversion",
            label: "转化率",
            type: "line",
            axis: "right",
          },
        ]}
        leftFormatter={(value) => `${value} 万`}
        rightFormatter={(value) => `${value}%`}
        valueFormatter={(value, item) =>
          item.axis === "right" ? `${value}%` : `${value} 万`
        }
      />
    </div>
  )
}
