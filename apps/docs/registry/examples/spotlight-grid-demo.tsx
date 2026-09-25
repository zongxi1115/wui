import { Button } from "@/registry/ui/button"
import { SpotlightGrid } from "@/registry/ui/spotlight-grid"

const stats = [
  { label: "P99 延迟", value: "11.4ms" },
  { label: "可用性", value: "99.995%" },
  { label: "边缘节点", value: "320+" },
]

export default function SpotlightGridDemo() {
  return (
    <SpotlightGrid
      size={32}
      radius={220}
      baseOpacity={0.08}
      fadeEdges
      className="text-foreground flex min-h-[26rem] w-full items-center rounded-b-lg px-6 py-12 sm:px-12"
    >
      <div className="max-w-lg">
        <p className="text-muted-foreground flex items-center gap-2 text-sm">
          <span className="size-1.5 rounded-full bg-[var(--success)]" />
          所有系统运行正常
        </p>
        <h3 className="mt-3 text-3xl font-semibold tracking-tight">
          离用户更近的边缘计算
        </h3>
        <p className="text-muted-foreground mt-3 leading-7">
          代码部署到全球节点，请求在最近的位置完成处理。移动指针，照亮背后的网络。
        </p>
        <dl className="mt-8 grid grid-cols-3 gap-6 border-t pt-6">
          {stats.map((stat) => (
            <div key={stat.label}>
              <dt className="text-muted-foreground text-xs">{stat.label}</dt>
              <dd className="mt-1 text-xl font-semibold tracking-tight tabular-nums">
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>
        <Button className="mt-8">创建项目</Button>
      </div>
    </SpotlightGrid>
  )
}
