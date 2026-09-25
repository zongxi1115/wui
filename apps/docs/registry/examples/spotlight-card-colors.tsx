import { ActivityIcon, ShieldCheckIcon, ZapIcon } from "lucide-react"

import { SpotlightCard } from "@/registry/ui/spotlight-card"

const metrics = [
  {
    icon: ActivityIcon,
    label: "可用性",
    value: "99.98%",
    note: "近 90 天",
    color: "var(--chart-1)",
  },
  {
    icon: ZapIcon,
    label: "P95 延迟",
    value: "142ms",
    note: "较上月 -18%",
    color: "var(--chart-2)",
  },
  {
    icon: ShieldCheckIcon,
    label: "拦截攻击",
    value: "12,408",
    note: "本周",
    color: "var(--chart-3)",
  },
]

export default function SpotlightCardColors() {
  return (
    <div className="grid w-full max-w-3xl gap-4 sm:grid-cols-3">
      {metrics.map((metric) => (
        <SpotlightCard
          key={metric.label}
          radius={180}
          color={`color-mix(in oklab, ${metric.color} 18%, transparent)`}
          borderColor={metric.color}
          className="bg-card rounded-lg border p-5"
        >
          <div className="text-muted-foreground flex items-center gap-2 text-sm">
            <metric.icon className="size-4" style={{ color: metric.color }} />
            {metric.label}
          </div>
          <p className="mt-4 text-2xl font-semibold tracking-tight tabular-nums">
            {metric.value}
          </p>
          <p className="text-muted-foreground mt-1 text-xs">{metric.note}</p>
        </SpotlightCard>
      ))}
    </div>
  )
}
