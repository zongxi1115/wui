import { ArrowRightIcon, CopyCheckIcon, SparklesIcon } from "lucide-react"

import { SlideSwap } from "@/registry/ui/slide-swap"

export default function SlideSwapButton() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4 p-8">
      {/* Primary Slide Swap Button */}
      <button className="group relative inline-flex items-center justify-center rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-md transition-transform active:scale-95">
        <SlideSwap direction="up">
          <span className="flex items-center gap-2">
            <span>Get Started Now</span>
            <ArrowRightIcon className="size-4" />
          </span>
        </SlideSwap>
      </button>

      {/* Ghost Slide Swap Button */}
      <button className="group relative inline-flex items-center justify-center rounded-xl border border-border bg-background px-5 py-3 text-sm font-semibold text-foreground shadow-xs transition-colors hover:bg-muted">
        <SlideSwap direction="down">
          <span className="flex items-center gap-2">
            <SparklesIcon className="size-4 text-warning" />
            <span>Generate Token</span>
          </span>
        </SlideSwap>
      </button>

      {/* Copy Code Button */}
      <button className="group relative inline-flex items-center justify-center rounded-xl border border-primary/20 bg-primary/5 px-4 py-2.5 text-xs font-mono font-medium text-primary hover:bg-primary/10">
        <SlideSwap direction="up">
          <span className="flex items-center gap-1.5">
            <CopyCheckIcon className="size-3.5" />
            <span>npx @wui/cli add</span>
          </span>
        </SlideSwap>
      </button>
    </div>
  )
}
