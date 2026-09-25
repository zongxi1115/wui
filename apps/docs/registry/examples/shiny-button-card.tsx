import { ArrowRightIcon } from "lucide-react"

import { Button } from "@/registry/ui/button"
import { ShinyButton } from "@/registry/ui/shiny-button"

export default function ShinyButtonCardDemo() {
  return (
    <div className="w-full max-w-lg">
      <p className="text-muted-foreground text-xs">抢先体验 · 名额有限</p>
      <h3 className="mt-3 text-xl font-semibold tracking-tight sm:text-2xl">
        让 AI 帮你整理每一次会议
      </h3>
      <p className="text-muted-foreground mt-2 text-sm leading-6">
        自动转写、提炼行动项并同步到任务看板。加入内测，免费使用至 2026 年底。
      </p>
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <ShinyButton>
          申请内测资格
          <ArrowRightIcon />
        </ShinyButton>
        <Button variant="ghost">了解更多</Button>
      </div>
    </div>
  )
}
