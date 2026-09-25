import { ChevronRightIcon } from "lucide-react"

import { SlideSwap } from "@/registry/ui/slide-swap"

export default function SlideSwapBadge() {
  return (
    <a
      href="#slide-swap-badge"
      className="bg-muted/60 hover:bg-muted focus-visible:ring-ring/50 inline-flex items-center gap-2 rounded-full border py-1 pl-1 pr-3 text-xs outline-none transition-colors focus-visible:ring-[3px]"
    >
      <span className="bg-background rounded-full border px-2 py-0.5 font-medium">
        新功能
      </span>
      <SlideSwap trigger="parent">
        <span className="flex items-center gap-1">
          审批流模板市场上线
          <ChevronRightIcon className="size-3.5" />
        </span>
      </SlideSwap>
    </a>
  )
}
