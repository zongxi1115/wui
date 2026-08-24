import { BarChart } from "@/registry/charts/bar-chart"
import { LineChart } from "@/registry/charts/line-chart"
import { PieChart } from "@/registry/charts/pie-chart"

const ranking = [
  { name: "北区", value: 64 },
  { name: "东区", value: 48 },
  { name: "南区", value: 36 },
  { name: "西区", value: 22 },
]

const trend = [
  { month: "1月", active: 18 },
  { month: "2月", active: 24 },
  { month: "3月", active: 29 },
  { month: "4月", active: 34 },
  { month: "5月", active: 41 },
]

const mix = [
  { source: "自然搜索", sessions: 42 },
  { source: "内容推荐", sessions: 28 },
  { source: "社交媒体", sessions: 18 },
  { source: "直接访问", sessions: 12 },
]

export default function ChartVariantsDemo() {
  return (
    <div className="grid w-full gap-6 lg:grid-cols-3">
      <BarChart
        title="北区是唯一超过六成目标的区域"
        description="单一排序指标 · 明度代表优先级"
        source="RUNG BARS · Q2 TARGET · SALES OPS"
        variant="wire"
        data={ranking}
        xKey="name"
        series={[{ key: "value", label: "完成率" }]}
        showValues
        valueFormatter={(value) => `${value}%`}
      />
      <LineChart
        title="活跃用户连续五个月增长"
        description="有序单序列 · 青瓷蓝明度梯"
        source="HAIRLINE LINE · MONTHLY ACTIVE · PRODUCT"
        variant="porcelain"
        data={trend}
        xKey="month"
        series={[{ key: "active", label: "活跃用户" }]}
        showLegend={false}
      />
      <PieChart
        title="自然搜索仍是最大的获客入口"
        description="四个无序来源 · 色相对应类别"
        source="TICK DONUT · ACQUISITION · ANALYTICS"
        variant="palm"
        data={mix}
        nameKey="source"
        valueKey="sessions"
        innerRadius={0.62}
      />
    </div>
  )
}
