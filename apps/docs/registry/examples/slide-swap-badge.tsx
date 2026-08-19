import { SparklesIcon } from "lucide-react"

import { SlideSwap } from "@/registry/ui/slide-swap"

export default function SlideSwapBadge() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 p-8">
      <div className="cursor-pointer rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary backdrop-blur-xs transition-colors hover:bg-primary/20">
        <SlideSwap direction="up">
          <span className="flex items-center gap-1.5">
            <SparklesIcon className="size-3.5" />
            <span>WUI 2.0 Motion Release · Explore Features →</span>
          </span>
        </SlideSwap>
      </div>
    </div>
  )
}
