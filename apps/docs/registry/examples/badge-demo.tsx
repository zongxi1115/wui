import { CheckIcon, Clock3Icon } from "lucide-react"

import { Badge } from "@/registry/ui/badge"

export default function BadgeDemo() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <Badge>Default</Badge>
      <Badge variant="secondary">Draft</Badge>
      <Badge variant="outline">Design</Badge>
      <Badge variant="info">In review</Badge>
      <Badge variant="success">
        <CheckIcon /> Published
      </Badge>
      <Badge variant="warning">
        <Clock3Icon /> Pending
      </Badge>
      <Badge variant="destructive">Blocked</Badge>
    </div>
  )
}
