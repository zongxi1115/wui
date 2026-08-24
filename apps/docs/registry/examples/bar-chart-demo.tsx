import { BarChart } from "@/registry/charts/bar-chart"

const data = [
  { channel: "自然搜索", lastYear: 2600, thisYear: 3280 },
  { channel: "内容推荐", lastYear: 2180, thisYear: 2740 },
  { channel: "直接访问", lastYear: 1880, thisYear: 2180 },
  { channel: "社交媒体", lastYear: 1510, thisYear: 1840 },
  { channel: "付费广告", lastYear: 1190, thisYear: 1420 },
  { channel: "邮件", lastYear: 780, thisYear: 960 },
]

export default function BarChartDemo() {
  return (
    <div className="w-full max-w-3xl">
      <BarChart
        title="渠道访问量同比"
        description="本月访客数 · 每一横档 = 200 人"
        source="PAIRED RUNGS · CHANNEL MIX · ACQUISITION"
        data={data}
        xKey="channel"
        series={[
          { key: "lastYear", label: "去年同期" },
          { key: "thisYear", label: "本月" },
        ]}
        rungStep={200}
        valueFormatter={(value) => `${value.toLocaleString("zh-CN")} 人`}
      />
    </div>
  )
}
