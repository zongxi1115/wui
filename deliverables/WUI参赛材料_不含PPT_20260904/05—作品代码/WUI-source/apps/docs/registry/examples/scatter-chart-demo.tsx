import { ScatterChart } from "@/registry/charts/scatter-chart"

const data = [
  { product: "Atlas", adoption: 78, retention: 91, segment: "企业" },
  { product: "Beacon", adoption: 62, retention: 84, segment: "企业" },
  { product: "Cipher", adoption: 85, retention: 88, segment: "企业" },
  { product: "Delta", adoption: 54, retention: 79, segment: "企业" },
  { product: "Echo", adoption: 72, retention: 76, segment: "团队" },
  { product: "Flux", adoption: 66, retention: 72, segment: "团队" },
  { product: "Grid", adoption: 48, retention: 68, segment: "团队" },
  { product: "Halo", adoption: 59, retention: 74, segment: "团队" },
  { product: "Ion", adoption: 43, retention: 63, segment: "个人" },
  { product: "Jolt", adoption: 51, retention: 67, segment: "个人" },
  { product: "Kite", adoption: 37, retention: 58, segment: "个人" },
  { product: "Lumen", adoption: 46, retention: 61, segment: "个人" },
  { product: "Mesh", adoption: 69, retention: 81, segment: "团队" },
  { product: "Nova", adoption: 81, retention: 86, segment: "企业" },
  { product: "Orbit", adoption: 57, retention: 70, segment: "个人" },
  { product: "Pulse", adoption: 74, retention: 83, segment: "团队" },
]

export default function ScatterChartDemo() {
  return (
    <div className="w-full max-w-3xl">
      <ScatterChart
        title="功能采用率与留存率"
        description="同一季度产品功能样本 · n=16"
        data={data}
        xKey="adoption"
        yKey="retention"
        labelKey="product"
        groupKey="segment"
        xLabel="采用率"
        yLabel="次月留存率"
        xFormatter={(value) => `${value}%`}
        yFormatter={(value) => `${value}%`}
      />
    </div>
  )
}
