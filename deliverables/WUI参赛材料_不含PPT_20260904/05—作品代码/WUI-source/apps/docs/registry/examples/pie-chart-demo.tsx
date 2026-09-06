import { PieChart } from "@/registry/charts/pie-chart"

const data = [
  { source: "自然搜索", sessions: 3820 },
  { source: "直接访问", sessions: 2740 },
  { source: "内容推荐", sessions: 2180 },
  { source: "社交媒体", sessions: 1460 },
  { source: "其他", sessions: 820 },
]

export default function PieChartDemo() {
  const total = data.reduce((sum, item) => sum + item.sessions, 0)

  return (
    <div className="w-full max-w-3xl">
      <PieChart
        title="访问来源构成"
        description="本月会话数 · Top 4 与其他"
        data={data}
        nameKey="source"
        valueKey="sessions"
        innerRadius={0.58}
        centerContent={
          <span>
            <span className="block font-mono text-lg tabular-nums">
              {total.toLocaleString("zh-CN")}
            </span>
            <span className="text-muted-foreground block text-[10px] font-normal">
              总会话
            </span>
          </span>
        }
        valueFormatter={(value) => `${value.toLocaleString("zh-CN")} 次`}
      />
    </div>
  )
}
