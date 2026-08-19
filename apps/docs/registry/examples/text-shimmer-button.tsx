import { ArrowRight, Sparkles } from "lucide-react"

import { Button } from "@/registry/ui/button"
import { TextShimmer } from "@/registry/ui/text-shimmer"

export default function TextShimmerButton() {
  return (
    <div className="flex w-full max-w-md flex-col items-center justify-center gap-6 rounded-xl border border-border bg-card p-8 text-center shadow-xs">
      <div className="space-y-1">
        <h4 className="text-sm font-semibold text-foreground">微光行动按钮</h4>
        <p className="text-xs text-muted-foreground">
          将 TextShimmer 内嵌于操作按钮中，增强高优先级 AI 功能的视觉吸引力。
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button
          size="default"
          className="group relative overflow-hidden rounded-full px-5 py-2"
        >
          <Sparkles className="size-3.5 mr-2 text-primary-foreground" />
          <TextShimmer
            as="span"
            duration={1.8}
            spread={3}
            className="font-semibold text-xs text-primary-foreground [--shimmer-base:rgba(255,255,255,0.7)] [--shimmer-highlight:#ffffff]"
          >
            Enhance with Claude 3.7
          </TextShimmer>
          <ArrowRight className="size-3.5 ml-1.5 transition-transform duration-300 group-hover:translate-x-0.5" />
        </Button>

        <Button
          variant="outline"
          size="default"
          className="rounded-full px-5 py-2"
        >
          <TextShimmer
            as="span"
            duration={2.2}
            className="text-xs font-semibold"
          >
            Upgrade to Pro
          </TextShimmer>
        </Button>
      </div>
    </div>
  )
}
