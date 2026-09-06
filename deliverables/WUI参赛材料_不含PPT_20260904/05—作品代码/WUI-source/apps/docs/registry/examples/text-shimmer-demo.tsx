import { Sparkles } from "lucide-react"

import { TextShimmer } from "@/registry/ui/text-shimmer"

export default function TextShimmerDemo() {
  return (
    <div className="flex w-full max-w-md flex-col items-center justify-center gap-4 rounded-xl border border-border bg-card p-8 text-center shadow-xs">
      <div className="flex items-center gap-2">
        <Sparkles className="size-4 text-primary animate-pulse" />
        <TextShimmer
          as="h3"
          duration={2}
          spread={2.5}
          className="text-2xl font-semibold tracking-tight sm:text-3xl"
        >
          Synthesizing AI Response...
        </TextShimmer>
      </div>

      <p className="text-xs text-muted-foreground">
        高光在文字表面持续扫过，用于优雅展示进行中的后台运算或加载状态。
      </p>
    </div>
  )
}
