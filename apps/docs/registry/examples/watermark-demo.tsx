import { Watermark } from "@/registry/ui/watermark"

const metrics = [
  { label: "营业收入", value: "¥ 1,286 万", change: "+18.2%" },
  { label: "毛利率", value: "42.6%", change: "+2.1pt" },
  { label: "活跃客户", value: "2,406", change: "+312" },
]

export default function WatermarkDemo() {
  return (
    <Watermark content="内部资料" className="w-full max-w-xl">
      <section className="bg-card text-card-foreground rounded-lg border p-6">
        <div className="flex items-baseline justify-between gap-4">
          <h3 className="font-semibold">2026 年第三季度经营简报</h3>
          <span className="text-muted-foreground text-xs">财务部 · 仅限内部</span>
        </div>
        <p className="text-muted-foreground mt-2 text-sm leading-6">
          本季度收入保持增长，华东区贡献主要增量；水印不影响文本选择与点击。
        </p>
        <dl className="mt-5 grid grid-cols-3 divide-x border-t pt-4">
          {metrics.map((metric) => (
            <div key={metric.label} className="px-4 first:pl-0">
              <dt className="text-muted-foreground text-xs">{metric.label}</dt>
              <dd className="mt-1 font-semibold tabular-nums">{metric.value}</dd>
              <dd className="text-success mt-0.5 text-xs tabular-nums">
                {metric.change}
              </dd>
            </div>
          ))}
        </dl>
      </section>
    </Watermark>
  )
}
