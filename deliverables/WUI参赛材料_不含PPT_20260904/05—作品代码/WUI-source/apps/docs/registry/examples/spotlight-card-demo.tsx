import { Bot, Cpu, Database } from "lucide-react"

import { Badge } from "@/registry/ui/badge"
import { SpotlightCard } from "@/registry/ui/spotlight-card"

const features = [
  {
    title: "Autonomous Agent Engine",
    category: "AI CORE",
    description:
      "Streams token-level reasoning trees and coordinates multi-agent tool execution in real-time.",
    icon: Bot,
    metric: "140 tps stream",
    badge: "PRO",
    image: "https://picsum.photos/seed/ai-card/500/260",
  },
  {
    title: "Zero-Latency State Cache",
    category: "STORAGE",
    description:
      "Distributed in-memory vector cache with instant semantic similarity query resolution.",
    icon: Database,
    metric: "< 8ms lookup",
    badge: "ENTERPRISE",
    image: "https://picsum.photos/seed/db-card/500/260",
  },
  {
    title: "Hardware Accelerated Canvas",
    category: "GRAPHICS",
    description:
      "GPU-optimized matrix pipeline delivering responsive 120 FPS transformations without jitter.",
    icon: Cpu,
    metric: "120 FPS stable",
    badge: "MOTION",
    image: "https://picsum.photos/seed/gpu-card/500/260",
  },
]

export default function SpotlightCardDemo() {
  return (
    <div className="grid w-full grid-cols-1 gap-5 md:grid-cols-3">
      {features.map((item) => {
        const Icon = item.icon
        return (
          <SpotlightCard
            key={item.title}
            className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-card p-6 text-card-foreground shadow-sm transition-all hover:border-primary/40 hover:shadow-md"
            color="color-mix(in oklab, var(--primary) 14%, transparent)"
            radius={240}
          >
            <div>
              <div className="relative mb-4 h-36 w-full overflow-hidden rounded-xl">
                <img
                  src={item.image}
                  alt={item.title}
                  className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-card/30 to-transparent" />
                <div className="absolute left-3 top-3">
                  <Badge
                    variant="outline"
                    className="border-white/30 bg-black/40 text-[10px] font-semibold text-white backdrop-blur-md"
                  >
                    {item.badge}
                  </Badge>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex size-7 items-center justify-center rounded-lg border border-border bg-muted text-primary">
                  <Icon className="size-3.5" />
                </div>
                <span className="font-mono text-[10px] font-semibold tracking-wider text-muted-foreground">
                  {item.category}
                </span>
              </div>

              <h4 className="mt-3 text-base font-semibold text-foreground">
                {item.title}
              </h4>

              <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                {item.description}
              </p>
            </div>

            <div className="mt-5 flex items-center justify-between border-t border-border pt-3 text-xs">
              <span className="text-muted-foreground">Benchmark</span>
              <span className="font-medium text-emerald-600 dark:text-emerald-400">
                {item.metric}
              </span>
            </div>
          </SpotlightCard>
        )
      })}
    </div>
  )
}
