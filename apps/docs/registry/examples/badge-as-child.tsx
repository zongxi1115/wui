import { ArrowUpRightIcon } from "lucide-react"

import { Badge } from "@/registry/ui/badge"

export default function BadgeAsChild() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <Badge asChild variant="outline">
        <a href="#changelog">
          更新日志 <ArrowUpRightIcon />
        </a>
      </Badge>
      <Badge asChild variant="secondary">
        <a href="#react">React 19</a>
      </Badge>
      <Badge asChild>
        <a href="#pro-plan">升级专业版</a>
      </Badge>
    </div>
  )
}
