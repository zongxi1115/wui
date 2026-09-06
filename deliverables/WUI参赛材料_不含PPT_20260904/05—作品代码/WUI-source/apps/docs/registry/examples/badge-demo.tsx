import { CheckIcon, ClockIcon, SparklesIcon } from "lucide-react"

import { Badge } from "@/registry/ui/badge"

export default function BadgeDemo() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2.5">
      <Badge>Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="outline">Outline</Badge>
      <Badge variant="info">
        <SparklesIcon /> New Feature
      </Badge>
      <Badge variant="success">
        <CheckIcon /> Active
      </Badge>
      <Badge variant="warning">
        <ClockIcon /> Pending
      </Badge>
      <Badge variant="destructive">Failed</Badge>
    </div>
  )
}
