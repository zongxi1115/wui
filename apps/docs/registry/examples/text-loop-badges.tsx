import { ArrowRight, CheckCircle2, ShieldCheck, Sparkles, Zap } from "lucide-react"

import { TextLoop } from "@/registry/ui/text-loop"

const announcements = [
  {
    icon: <Sparkles className="size-3.5 text-primary" />,
    tag: "New Feature",
    text: "AI Copilot v4.0 is now live in all regions",
  },
  {
    icon: <Zap className="size-3.5 text-amber-500" />,
    tag: "Performance",
    text: "Sub-millisecond Edge streaming enabled",
  },
  {
    icon: <ShieldCheck className="size-3.5 text-emerald-500" />,
    tag: "Security",
    text: "SOC 2 Type II compliance audit passed",
  },
  {
    icon: <CheckCircle2 className="size-3.5 text-blue-500" />,
    tag: "Status",
    text: "All 12 cluster zones 99.99% operational",
  },
]

export default function TextLoopBadges() {
  return (
    <div className="flex w-full max-w-lg flex-col items-center gap-4 rounded-xl border border-border bg-card p-6 shadow-xs">
      <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
        业务动态与状态通告栏
      </div>

      <div className="group flex items-center gap-2.5 rounded-full border border-border bg-muted/30 px-4 py-1.5 transition-colors hover:border-primary/40 hover:bg-muted/50">
        <TextLoop interval={3} className="inline-flex items-center">
          {announcements.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-2 text-xs font-medium text-foreground"
            >
              {item.icon}
              <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
                {item.tag}
              </span>
              <span className="truncate max-w-[240px] sm:max-w-[320px]">
                {item.text}
              </span>
            </div>
          ))}
        </TextLoop>
        <ArrowRight className="size-3 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground" />
      </div>
    </div>
  )
}
