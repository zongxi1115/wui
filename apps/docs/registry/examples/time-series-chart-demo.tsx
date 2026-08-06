import { TimeSeriesChart } from "@/registry/charts/time-series-chart"

const data = [
  { date: "2026-01-02", requests: 1280 },
  { date: "2026-01-05", requests: 1460 },
  { date: "2026-01-11", requests: 1390 },
  { date: "2026-01-18", requests: 1720 },
  { date: "2026-01-22", requests: 1840 },
  { date: "2026-02-03", requests: 2180 },
  { date: "2026-02-06", requests: 2040 },
  { date: "2026-02-17", requests: 2460 },
  { date: "2026-02-25", requests: 2710 },
  { date: "2026-03-09", requests: 2940 },
  { date: "2026-03-16", requests: 2870 },
  { date: "2026-03-31", requests: 3380 },
]

export default function TimeSeriesChartDemo() {
  return (
    <div className="w-full max-w-3xl">
      <TimeSeriesChart
        title="API 请求趋势"
        description="不等间隔观测点 · 单位：万次"
        data={data}
        timeKey="date"
        series={[{ key: "requests", label: "请求量" }]}
        showDots
        valueFormatter={(value) => `${value.toLocaleString("zh-CN")} 万次`}
      />
    </div>
  )
}
