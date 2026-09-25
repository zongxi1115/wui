import {
  ArrowDownIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowUpIcon,
} from "lucide-react"

import { Button } from "@/registry/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/registry/ui/tooltip"

const placements = [
  { side: "top", label: "上方", icon: ArrowUpIcon, area: "col-start-2 row-start-1" },
  { side: "left", label: "左侧", icon: ArrowLeftIcon, area: "col-start-1 row-start-2" },
  { side: "right", label: "右侧", icon: ArrowRightIcon, area: "col-start-3 row-start-2" },
  { side: "bottom", label: "下方", icon: ArrowDownIcon, area: "col-start-2 row-start-3" },
] as const

export default function TooltipPlacement() {
  return (
    <TooltipProvider delayDuration={100}>
      <div className="grid grid-cols-3 grid-rows-3 gap-2">
        {placements.map(({ side, label, icon: Icon, area }) => (
          <Tooltip key={side}>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon" aria-label={`在${label}显示`} className={area}>
                <Icon />
              </Button>
            </TooltipTrigger>
            <TooltipContent side={side}>从{label}弹出</TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  )
}
