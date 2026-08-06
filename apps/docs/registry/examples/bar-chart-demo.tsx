import { BarChart } from "@/registry/charts/bar-chart"

const data = [
  { channel: "自然搜索", visitors: 3280, conversions: 860 },
  { channel: "内容推荐", visitors: 2740, conversions: 720 },
  { channel: "直接访问", visitors: 2180, conversions: 610 },
  { channel: "社交媒体", visitors: 1840, conversions: 460 },
  { channel: "付费广告", visitors: 1420, conversions: 390 },
  { channel: "邮件", visitors: 960, conversions: 280 },
]

export default function BarChartDemo() {
  return (
    <div className="w-full max-w-3xl">
      <BarChart
        title="渠道表现"
        description="本月访问与转化人数"
        data={data}
        xKey="channel"
        series={[
          { key: "visitors", label: "访问" },
          { key: "conversions", label: "转化" },
        ]}
        valueFormatter={(value) => `${value.toLocaleString("zh-CN")} 人`}
      />
    </div>
  )
}
