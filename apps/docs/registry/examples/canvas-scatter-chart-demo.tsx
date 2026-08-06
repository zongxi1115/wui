import { CanvasScatterChart } from "@/registry/charts/canvas-scatter-chart"

const segments = ["企业", "团队", "个人"]
const data = Array.from({ length: 1200 }, (_, index) => {
  const segment = segments[index % segments.length]
  const adoption = 18 + ((index * 37) % 74)
  const retention = Math.min(
    98,
    38 + adoption * 0.54 + Math.sin(index * 0.73) * 15
  )
  return {
    account: `账户 ${index + 1}`,
    adoption,
    retention: Number(retention.toFixed(1)),
    segment,
  }
})

export default function CanvasScatterChartDemo() {
  return (
    <div className="w-full max-w-3xl">
      <CanvasScatterChart
        title="账户采用率与留存率"
        description="同一季度账户样本 · n=1,200"
        data={data}
        xKey="adoption"
        yKey="retention"
        labelKey="account"
        groupKey="segment"
        xLabel="采用率"
        yLabel="次月留存率"
        xFormatter={(value) => `${value}%`}
        yFormatter={(value) => `${value}%`}
      />
    </div>
  )
}
