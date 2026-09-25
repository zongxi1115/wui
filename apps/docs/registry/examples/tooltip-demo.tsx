import { BellIcon, SearchIcon, SettingsIcon } from "lucide-react"

import { Button } from "@/registry/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/registry/ui/tooltip"

const actions = [
  { label: "搜索", shortcut: "Ctrl K", icon: SearchIcon },
  { label: "通知", shortcut: "G N", icon: BellIcon },
  { label: "设置", shortcut: "Ctrl ,", icon: SettingsIcon },
]

export default function TooltipDemo() {
  return (
    <TooltipProvider>
      <div className="flex items-center gap-1">
        {actions.map(({ label, shortcut, icon: Icon }) => (
          <Tooltip key={label}>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" aria-label={label}>
                <Icon />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {label}
              <span className="text-background/60 ml-2">{shortcut}</span>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  )
}
