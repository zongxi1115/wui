import { SparklesIcon } from "lucide-react"

import { ShinyButton } from "@/registry/ui/shiny-button"

export default function ShinyButtonVariantsDemo() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4">
      <ShinyButton className="h-11 px-7 text-base">
        <SparklesIcon />
        大号
      </ShinyButton>
      <ShinyButton>默认尺寸</ShinyButton>
      <ShinyButton className="h-8 rounded-md px-3.5 text-xs">小号</ShinyButton>
      <ShinyButton
        speed={2.4}
        gap={0.6}
        className="border-border bg-secondary text-secondary-foreground h-8 rounded-full px-4 text-xs"
      >
        胶囊 · 次要色
      </ShinyButton>
    </div>
  )
}
