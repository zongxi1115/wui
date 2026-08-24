import { LineChart } from "@/registry/charts/line-chart"

const data = [
  { month: "1月", revenue: 18.2 },
  { month: "2月", revenue: 21.4 },
  { month: "3月", revenue: 20.1 },
  { month: "4月", revenue: 25.7 },
  { month: "5月", revenue: 27.8 },
  { month: "6月", revenue: 26.5 },
  { month: "7月", revenue: 31.2 },
  { month: "8月", revenue: 34.6 },
  { month: "9月", revenue: 33.1 },
  { month: "10月", revenue: 38.4 },
  { month: "11月", revenue: 41.8 },
  { month: "12月", revenue: 45.2 },
]

export default function LineChartDemo() {
  return (
    <div className="w-full max-w-3xl">
      <LineChart
        title="年度收入走势"
        description="月度收入 · 每个点代表一个月"
        source="HAIRLINE LINE · MONTHLY REVENUE · BILLING"
        data={data}
        xKey="month"
        series={[
          { key: "revenue", label: "收入" },
        ]}
        valueFormatter={(value) => `${value.toFixed(1)} 万`}
      />
    </div>
  )
}
