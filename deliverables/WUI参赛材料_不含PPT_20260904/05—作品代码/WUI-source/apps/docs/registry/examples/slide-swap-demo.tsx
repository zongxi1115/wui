import { ArrowUpRightIcon } from "lucide-react"

import { SlideSwap } from "@/registry/ui/slide-swap"

export default function SlideSwapDemo() {
  return (
    <button className="border-foreground/20 hover:border-foreground/50 rounded-full border px-5 py-2.5 text-sm font-medium transition-colors">
      <SlideSwap>
        <span className="flex items-center gap-2">
          Explore projects
          <ArrowUpRightIcon className="size-4" />
        </span>
      </SlideSwap>
    </button>
  )
}
