import { Badge } from "@/registry/ui/badge"

export default function BadgeSizes() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <Badge size="sm" variant="secondary">
        紧凑 sm
      </Badge>
      <Badge variant="secondary">标准 default</Badge>
      <Badge size="lg" variant="secondary">
        突出 lg
      </Badge>
    </div>
  )
}
