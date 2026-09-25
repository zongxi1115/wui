import { ArrowRightIcon, SparklesIcon } from "lucide-react"

import { Button } from "@/registry/ui/button"
import { Glow } from "@/registry/ui/glow"

export default function GlowDemo() {
  return (
    <Glow spread={20} glowOpacity={0.55} duration={6} className="w-full max-w-sm rounded-lg">
      <div className="bg-background rounded-lg p-5">
        <div className="flex items-center gap-2 text-sm font-medium">
          <SparklesIcon className="text-muted-foreground size-4" />
          AI 周报助手
        </div>
        <p className="text-muted-foreground mt-2 text-sm leading-6">
          自动汇总本周的会议纪要、代码提交与工单进展，周五下午 5 点推送到你的收件箱。
        </p>
        <div className="mt-5 flex items-center justify-between">
          <span className="text-muted-foreground text-xs">已有 1,280 个团队启用</span>
          <Button size="sm">
            立即启用
            <ArrowRightIcon />
          </Button>
        </div>
      </div>
    </Glow>
  )
}
