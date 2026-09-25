import { cn } from "@/registry/lib/utils"
import { Badge } from "@/registry/ui/badge"

const services = [
  { label: "运行正常", dot: "bg-success", live: false },
  { label: "性能降级", dot: "bg-warning", live: true },
  { label: "服务中断", dot: "bg-destructive", live: true },
  { label: "维护中", dot: "bg-muted-foreground", live: false },
]

export default function BadgeDot() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      {services.map((item) => (
        <Badge key={item.label} variant="outline" className="gap-1.5">
          <span className="relative flex size-1.5">
            {item.live ? (
              <span
                className={cn(
                  "absolute inline-flex size-full animate-ping rounded-full opacity-60 motion-reduce:animate-none",
                  item.dot
                )}
              />
            ) : null}
            <span className={cn("relative inline-flex size-1.5 rounded-full", item.dot)} />
          </span>
          {item.label}
        </Badge>
      ))}
    </div>
  )
}
