import { Badge } from "@/registry/ui/badge"

export default function BadgeSizes() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <Badge size="sm">Small (sm)</Badge>
      <Badge size="default">Default</Badge>
      <Badge size="lg">Large (lg)</Badge>
    </div>
  )
}
