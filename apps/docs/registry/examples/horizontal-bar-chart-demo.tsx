import { HorizontalBarChart } from "@/registry/charts/horizontal-bar-chart"

const data = [
  { product: "企业协作工作台", revenue: 4280 },
  { product: "客户数据平台", revenue: 3650 },
  { product: "智能内容管理", revenue: 2980 },
  { product: "自动化流程中心", revenue: 2410 },
  { product: "实时分析服务", revenue: 1860 },
  { product: "开发者工具套件", revenue: 1320 },
]

export default function HorizontalBarChartDemo() {
  return (
    <div className="w-full max-w-3xl">
      <HorizontalBarChart
        title="产品收入排名"
        description="本季度确认收入 · 每一格 = 200 万元"
        source="TICK ROWS · Q2 REVENUE · BILLING"
        data={data}
        categoryKey="product"
        series={[{ key: "revenue", label: "收入" }]}
        height={320}
        tickStep={200}
        showValues
        valueFormatter={(value) => `${value.toLocaleString("zh-CN")} 万`}
      />
    </div>
  )
}
