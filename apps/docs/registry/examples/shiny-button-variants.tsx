import { SparklesIcon } from "lucide-react"

import { ShinyButton } from "@/registry/ui/shiny-button"

export default function ShinyButtonVariantsDemo() {
  return (
    <div className="flex w-full flex-wrap items-center justify-center gap-4 p-4 sm:p-8">
      {/* Large size */}
      <ShinyButton className="h-12 rounded-xl px-7 text-base">
        <SparklesIcon className="size-4" />
        Large Size
      </ShinyButton>

      {/* Default size */}
      <ShinyButton className="h-10 rounded-lg px-5 text-sm">
        Default Size
      </ShinyButton>

      {/* Small size */}
      <ShinyButton className="h-8 rounded-md px-3.5 text-xs">
        Small Size
      </ShinyButton>

      {/* Pill shape */}
      <ShinyButton className="h-9 rounded-full px-5 text-xs">
        Pill Shape
      </ShinyButton>
    </div>
  )
}
