import { StackedBarChart } from "@/registry/charts/stacked-bar-chart"

const data = [
  { quarter: "Q1", web: 46, ios: 32, android: 22 },
  { quarter: "Q2", web: 42, ios: 35, android: 23 },
  { quarter: "Q3", web: 39, ios: 37, android: 24 },
  { quarter: "Q4", web: 36, ios: 39, android: 25 },
]

export default function StackedBarChartDemo() {
  return (
    <div className="w-full max-w-3xl">
      <StackedBarChart
        title="访问终端构成"
        description="季度会话占比 · 每组总计 100%"
        data={data}
        categoryKey="quarter"
        series={[
          { key: "web", label: "Web" },
          { key: "ios", label: "iOS" },
          { key: "android", label: "Android" },
        ]}
        normalize
        showValues
      />
    </div>
  )
}
