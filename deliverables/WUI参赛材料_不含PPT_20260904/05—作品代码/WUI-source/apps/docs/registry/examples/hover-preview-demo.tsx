import { ArrowUpRight, Bot, Cpu, Database, ShieldCheck } from "lucide-react"

import { Badge } from "@/registry/ui/badge"
import { HoverPreview } from "@/registry/ui/hover-preview"

const releases = [
  {
    id: "01",
    version: "v2.4.0",
    title: "Autonomous Agent Orchestrator",
    category: "AI Engine",
    date: "Aug 2026",
    icon: Bot,
    image: "https://picsum.photos/seed/agent-ui/400/220",
    description:
      "Full multi-agent runtime with streaming reasoning graphs and recursive tool execution.",
    metric: "140 tps stream rate",
  },
  {
    id: "02",
    version: "v2.3.0",
    title: "Zero-Trust Edge Gatekeeper",
    category: "Security",
    date: "Jul 2026",
    icon: ShieldCheck,
    image: "https://picsum.photos/seed/sec-shield/400/220",
    description:
      "Hardware enclave-backed cryptographic tokens with sub-millisecond edge validation.",
    metric: "99.999% SLA verified",
  },
  {
    id: "03",
    version: "v2.2.0",
    title: "Real-Time Spatial Canvas",
    category: "Graphics",
    date: "Jun 2026",
    icon: Cpu,
    image: "https://picsum.photos/seed/spatial-canvas/400/220",
    description:
      "GPU-accelerated vector transformation pipeline with seamless 120 FPS interactions.",
    metric: "< 8ms frame time",
  },
  {
    id: "04",
    version: "v2.1.0",
    title: "Sub-ms Vector Memory Indexer",
    category: "Database",
    date: "May 2026",
    icon: Database,
    image: "https://picsum.photos/seed/db-cluster/400/220",
    description:
      "Distributed embedding cache with instant semantic similarity queries.",
    metric: "1.2M queries/sec",
  },
]

export default function HoverPreviewDemo() {
  return (
    <div className="w-full rounded-2xl border border-border bg-card p-6 text-card-foreground shadow-lg sm:p-8">
      <div className="mb-6 flex items-center justify-between border-b border-border pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-foreground">Platform Releases</h3>
            <Badge
              variant="outline"
              className="text-[10px]"
            >
              CHANGELOG
            </Badge>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Hover over any release to view architecture snapshot preview
          </p>
        </div>
        <span className="text-xs text-muted-foreground font-mono">2026 ROADMAP</span>
      </div>

      <div className="divide-y divide-border">
        {releases.map((item) => {
          return (
            <HoverPreview
              key={item.id}
              previewClassName="w-80 overflow-hidden rounded-xl border border-border bg-popover text-popover-foreground shadow-2xl"
              preview={
                <div>
                  <div className="relative h-32 w-full overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="size-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-popover via-transparent to-transparent" />
                    <div className="absolute left-3 top-3">
                      <Badge
                        variant="outline"
                        className="border-white/30 bg-black/40 text-[10px] text-white backdrop-blur-md"
                      >
                        {item.category}
                      </Badge>
                    </div>
                  </div>

                  <div className="p-3.5 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-semibold text-foreground">
                        {item.version}
                      </span>
                      <span className="text-[10px] text-muted-foreground">{item.date}</span>
                    </div>

                    <p className="text-xs leading-relaxed text-muted-foreground">
                      {item.description}
                    </p>

                    <div className="flex items-center justify-between border-t border-border pt-2 text-[11px]">
                      <span className="text-muted-foreground">Benchmark</span>
                      <span className="font-medium text-emerald-600 dark:text-emerald-400">
                        {item.metric}
                      </span>
                    </div>
                  </div>
                </div>
              }
            >
              <a
                href="#"
                className="group flex items-center justify-between py-4 outline-none transition-colors hover:bg-muted/50 px-2 rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <span className="font-mono text-xs text-muted-foreground group-hover:text-foreground transition-colors">
                    {item.id}
                  </span>
                  <div>
                    <div className="text-sm font-medium text-foreground transition-colors">
                      {item.title}
                    </div>
                    <div className="text-xs text-muted-foreground sm:hidden">
                      {item.category}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Badge
                    variant="outline"
                    className="hidden text-xs text-muted-foreground sm:inline-flex"
                  >
                    {item.category}
                  </Badge>
                  <ArrowUpRight className="size-4 text-muted-foreground transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-foreground" />
                </div>
              </a>
            </HoverPreview>
          )
        })}
      </div>
    </div>
  )
}
