import {
  AlertCircleIcon,
  ArrowUpRightIcon,
  ShieldCheckIcon,
  TagIcon,
} from "lucide-react"

import { Badge } from "@/registry/ui/badge"

export default function BadgeWithIcon() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <Badge variant="secondary">
        <TagIcon /> v2.4.0
      </Badge>
      <Badge variant="success">
        <ShieldCheckIcon /> 已认证
      </Badge>
      <Badge variant="destructive">
        <AlertCircleIcon /> 安全告警
      </Badge>
      <Badge variant="outline">
        接口文档 <ArrowUpRightIcon />
      </Badge>
    </div>
  )
}
