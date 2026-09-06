import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/registry/ui/tooltip"

const placements = ["top", "right", "bottom", "left"] as const

export default function TooltipPlacement() {
  return (
    <TooltipProvider delayDuration={100}>
      <div className="grid grid-cols-2 gap-3">
        {placements.map((side) => (
          <Tooltip key={side}>
            <TooltipTrigger asChild>
              <button
                type="button"
                className="border px-4 py-2 text-sm capitalize outline-none transition-colors hover:bg-accent focus-visible:ring-[3px] focus-visible:ring-ring/35"
              >
                {side}
              </button>
            </TooltipTrigger>
            <TooltipContent side={side} size="sm" showArrow={side !== "bottom"}>
              Opens on the {side}
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  )
}
