import { StackedAreaChart } from "@/registry/charts/stacked-area-chart"

const data = [
  { month: "1月", starter: 1280, team: 860, enterprise: 420 },
  { month: "2月", starter: 1360, team: 930, enterprise: 470 },
  { month: "3月", starter: 1420, team: 1010, enterprise: 510 },
  { month: "4月", starter: 1510, team: 1080, enterprise: 560 },
  { month: "5月", starter: 1580, team: 1160, enterprise: 610 },
  { month: "6月", starter: 1660, team: 1240, enterprise: 680 },
  { month: "7月", starter: 1740, team: 1320, enterprise: 730 },
  { month: "8月", starter: 1810, team: 1410, enterprise: 790 },
  { month: "9月", starter: 1880, team: 1490, enterprise: 850 },
  { month: "10月", starter: 1960, team: 1570, enterprise: 920 },
  { month: "11月", starter: 2040, team: 1660, enterprise: 990 },
  { month: "12月", starter: 2110, team: 1750, enterprise: 1070 },
]

export default function StackedAreaChartDemo() {
  return (
    <div className="w-full max-w-3xl">
      <StackedAreaChart
        title="订阅用户构成趋势"
        description="月末有效订阅 · 单位：用户"
        data={data}
        xKey="month"
        series={[
          { key: "starter", label: "Starter" },
          { key: "team", label: "Team" },
          { key: "enterprise", label: "Enterprise" },
        ]}
        valueFormatter={(value) => `${value.toLocaleString("zh-CN")} 人`}
      />
    </div>
  )
}
