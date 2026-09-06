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
        description="本季度确认收入 · 单位：万元"
        data={data}
        categoryKey="product"
        series={[{ key: "revenue", label: "收入" }]}
        height={320}
        showLegend={false}
        showValues
        valueFormatter={(value) => `${value.toLocaleString("zh-CN")} 万`}
      />
    </div>
  )
}
