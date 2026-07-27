import { SparklesIcon } from "lucide-react"

import { ShinyButton } from "@/registry/ui/shiny-button"

export default function ShinyButtonDemo() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <ShinyButton>
        <SparklesIcon />
        Get started
      </ShinyButton>
      <ShinyButton speed={2} gap={0.4}>
        Faster sweep
      </ShinyButton>
    </div>
  )
}
