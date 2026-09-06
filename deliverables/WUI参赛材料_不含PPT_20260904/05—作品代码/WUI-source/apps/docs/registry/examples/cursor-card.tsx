import { ExternalLinkIcon, PlayIcon } from "lucide-react"

import { Cursor } from "@/registry/ui/cursor"

export default function CursorCard() {
  return (
    <div className="grid w-full max-w-2xl grid-cols-1 gap-4 sm:grid-cols-2">
      <div className="group relative flex h-56 flex-col justify-end overflow-hidden rounded-2xl border bg-gradient-to-br from-indigo-500/20 via-purple-500/10 to-background p-5">
        <Cursor
          attachToParent
          springConfig={{ stiffness: 520, damping: 28, mass: 0.15 }}
        >
          <div className="flex size-12 items-center justify-center rounded-full bg-indigo-600 text-white shadow-lg">
            <PlayIcon className="size-5 fill-current pl-0.5" />
          </div>
        </Cursor>
        <span className="text-xs font-medium uppercase tracking-wider text-indigo-500">
          Video Reel
        </span>
        <h4 className="mt-1 text-base font-semibold text-foreground">
          Brand Anthem 2026
        </h4>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Hover to engage spring cursor player
        </p>
      </div>

      <div className="group relative flex h-56 flex-col justify-end overflow-hidden rounded-2xl border bg-gradient-to-br from-emerald-500/20 via-teal-500/10 to-background p-5">
        <Cursor
          attachToParent
          springConfig={{ stiffness: 480, damping: 32, mass: 0.2 }}
        >
          <div className="flex items-center gap-1.5 rounded-full bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white shadow-lg">
            <span>Explore</span>
            <ExternalLinkIcon className="size-3.5" />
          </div>
        </Cursor>
        <span className="text-xs font-medium uppercase tracking-wider text-emerald-500">
          Case Study
        </span>
        <h4 className="mt-1 text-base font-semibold text-foreground">
          Fintech Architecture
        </h4>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Global multi-region cluster scaling
        </p>
      </div>
    </div>
  )
}
