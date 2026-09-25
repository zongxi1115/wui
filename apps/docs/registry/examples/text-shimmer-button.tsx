import { SparklesIcon } from "lucide-react"

import { Button } from "@/registry/ui/button"
import { TextShimmer } from "@/registry/ui/text-shimmer"

export default function TextShimmerButton() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <Button>
        <SparklesIcon />
        <TextShimmer
          duration={2.2}
          className="[--shimmer-base:color-mix(in_oklch,var(--primary-foreground)_60%,transparent)] [--shimmer-highlight:var(--primary-foreground)]"
        >
          用 AI 润色全文
        </TextShimmer>
      </Button>
      <Button variant="outline">
        <TextShimmer duration={2.6}>升级到专业版</TextShimmer>
      </Button>
    </div>
  )
}
