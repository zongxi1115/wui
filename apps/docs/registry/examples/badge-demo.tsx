import { CheckIcon, ClockIcon, SparklesIcon } from "lucide-react"

import { Badge } from "@/registry/ui/badge"

export default function BadgeDemo() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2.5">
      <Badge>默认</Badge>
      <Badge variant="secondary">次要</Badge>
      <Badge variant="outline">描边</Badge>
      <Badge variant="info">
        <SparklesIcon /> 新功能
      </Badge>
      <Badge variant="success">
        <CheckIcon /> 已上线
      </Badge>
      <Badge variant="warning">
        <ClockIcon /> 审核中
      </Badge>
      <Badge variant="destructive">已驳回</Badge>
    </div>
  )
}
