import { AlertCircleIcon, ArrowUpRightIcon, ShieldCheckIcon, TagIcon } from "lucide-react"

import { Badge } from "@/registry/ui/badge"

export default function BadgeWithIcon() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <Badge variant="secondary">
        <TagIcon /> v2.4.0
      </Badge>
      <Badge variant="success">
        <ShieldCheckIcon /> Verified
      </Badge>
      <Badge variant="destructive">
        <AlertCircleIcon /> Security Alert
      </Badge>
      <Badge variant="outline">
        Docs <ArrowUpRightIcon />
      </Badge>
    </div>
  )
}
