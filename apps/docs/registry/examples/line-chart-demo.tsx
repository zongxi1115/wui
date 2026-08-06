import { LineChart } from "@/registry/charts/line-chart"

const data = [
  { month: "1月", revenue: 18.2, orders: 12.6 },
  { month: "2月", revenue: 21.4, orders: 14.1 },
  { month: "3月", revenue: 20.1, orders: 15.8 },
  { month: "4月", revenue: 25.7, orders: 17.3 },
  { month: "5月", revenue: 27.8, orders: 18.9 },
  { month: "6月", revenue: 26.5, orders: 20.4 },
  { month: "7月", revenue: 31.2, orders: 22.1 },
  { month: "8月", revenue: 34.6, orders: 23.8 },
  { month: "9月", revenue: 33.1, orders: 25.2 },
  { month: "10月", revenue: 38.4, orders: 27.6 },
  { month: "11月", revenue: 41.8, orders: 29.3 },
  { month: "12月", revenue: 45.2, orders: 31.7 },
]

export default function LineChartDemo() {
  return (
    <div className="w-full max-w-3xl">
      <LineChart
        title="年度业务趋势"
        description="月度数据 · 单位：万元"
        data={data}
        xKey="month"
        series={[
          { key: "revenue", label: "收入" },
          { key: "orders", label: "订单金额" },
        ]}
        valueFormatter={(value) => `${value.toFixed(1)} 万`}
      />
    </div>
  )
}
