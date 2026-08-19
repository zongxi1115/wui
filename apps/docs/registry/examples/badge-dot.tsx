import { Badge } from "@/registry/ui/badge"

export default function BadgeDot() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <Badge variant="outline" className="gap-1.5">
        <span className="size-1.5 rounded-full bg-emerald-500" />
        Operational
      </Badge>
      <Badge variant="outline" className="gap-1.5">
        <span className="size-1.5 rounded-full bg-amber-500 animate-pulse" />
        Degraded
      </Badge>
      <Badge variant="outline" className="gap-1.5">
        <span className="size-1.5 rounded-full bg-rose-500" />
        Outage
      </Badge>
      <Badge variant="secondary" className="gap-1.5">
        <span className="size-1.5 rounded-full bg-muted-foreground" />
        Maintenance
      </Badge>
    </div>
  )
}
