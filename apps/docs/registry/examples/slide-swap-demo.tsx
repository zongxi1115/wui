import { ArrowUpRightIcon } from "lucide-react"

import { SlideSwap } from "@/registry/ui/slide-swap"

export default function SlideSwapDemo() {
  return (
    <button
      type="button"
      className="border-foreground/20 hover:border-foreground/60 focus-visible:ring-ring/50 rounded-full border px-5 py-2.5 text-sm font-medium outline-none transition-colors focus-visible:ring-[3px]"
    >
      <SlideSwap trigger="parent">
        <span className="flex items-center gap-2">
          浏览全部作品
          <ArrowUpRightIcon className="size-4" />
        </span>
      </SlideSwap>
    </button>
  )
}
