import { BellIcon, SearchIcon, SettingsIcon } from "lucide-react"

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/registry/ui/tooltip"

const actions = [
  { label: "Search", shortcut: "Ctrl K", icon: SearchIcon },
  { label: "Notifications", shortcut: "N", icon: BellIcon },
  { label: "Settings", shortcut: "S", icon: SettingsIcon },
]

export default function TooltipDemo() {
  return (
    <TooltipProvider>
      <div className="flex items-center gap-1 border-y px-1 py-2">
        {actions.map(({ label, shortcut, icon: Icon }) => (
          <Tooltip key={label}>
            <TooltipTrigger asChild>
              <button
                type="button"
                aria-label={label}
                className="inline-flex size-9 items-center justify-center rounded-md text-muted-foreground outline-none transition-colors hover:bg-accent hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/35"
              >
                <Icon className="size-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <span>{label}</span>
              <span className="ml-2 text-background/60">{shortcut}</span>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  )
}
