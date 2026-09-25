import { BoldIcon, ItalicIcon, LinkIcon, UnderlineIcon } from "lucide-react"

import { Button } from "@/registry/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/registry/ui/tooltip"

const tools = [
  { label: "加粗", shortcut: "Ctrl B", icon: BoldIcon },
  { label: "斜体", shortcut: "Ctrl I", icon: ItalicIcon },
]

const compactTools = [
  { label: "下划线", shortcut: "Ctrl U", icon: UnderlineIcon },
  { label: "插入链接", shortcut: "Ctrl K", icon: LinkIcon },
]

export default function TooltipSizes() {
  return (
    <TooltipProvider>
      <div className="flex flex-wrap items-center gap-8">
        <div className="flex items-center gap-1">
          {tools.map(({ label, shortcut, icon: Icon }) => (
            <Tooltip key={label}>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" aria-label={label}>
                  <Icon />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {label}
                <span className="text-background/60 ml-2">{shortcut}</span>
              </TooltipContent>
            </Tooltip>
          ))}
          <span className="text-muted-foreground ml-2 text-xs">default</span>
        </div>

        <div className="flex items-center gap-1">
          {compactTools.map(({ label, shortcut, icon: Icon }) => (
            <Tooltip key={label}>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="size-8" aria-label={label}>
                  <Icon />
                </Button>
              </TooltipTrigger>
              <TooltipContent size="sm">
                {label}
                <span className="text-background/60 ml-1.5">{shortcut}</span>
              </TooltipContent>
            </Tooltip>
          ))}
          <span className="text-muted-foreground ml-2 text-xs">sm</span>
        </div>
      </div>
    </TooltipProvider>
  )
}
