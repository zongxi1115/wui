import { Histogram } from "@/registry/charts/histogram"

const data = [
  42, 47, 51, 53, 55, 58, 61, 62, 64, 65, 66, 67, 68, 69, 70, 71, 72, 72, 73,
  74, 74, 75, 76, 77, 78, 79, 80, 81, 82, 84, 86, 88, 91, 94, 97, 103,
].map((duration) => ({ duration }))

export default function HistogramDemo() {
  return (
    <div className="w-full max-w-3xl">
      <Histogram
        title="任务完成时长分布"
        description="最近 36 次任务 · 单位：秒"
        data={data}
        valueKey="duration"
        bins={8}
        showValues
      />
    </div>
  )
}
