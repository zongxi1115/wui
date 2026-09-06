import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/registry/ui/tooltip"
import { Button } from "@/registry/ui/button"
import { BoldIcon, ItalicIcon, LinkIcon } from "lucide-react"

export default function TooltipSizes() {
  return (
    <TooltipProvider>
      <div className="flex flex-wrap items-center gap-6">
        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon">
                <BoldIcon className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent size="default">
              <span>加粗文本</span>
              <kbd className="ml-2 rounded bg-background/20 px-1 py-0.5 text-[10px] font-mono">⌘B</kbd>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon">
                <ItalicIcon className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent size="default">
              <span>斜体文本</span>
              <kbd className="ml-2 rounded bg-background/20 px-1 py-0.5 text-[10px] font-mono">⌘I</kbd>
            </TooltipContent>
          </Tooltip>
          <span className="text-xs text-muted-foreground ml-2">标准尺寸 (size="default")</span>
        </div>

        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="size-8">
                <LinkIcon className="size-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent size="sm">
              <span>插入超链接</span>
              <kbd className="ml-1.5 rounded bg-background/20 px-1 py-0.5 text-[9px] font-mono">⌘K</kbd>
            </TooltipContent>
          </Tooltip>
          <span className="text-xs text-muted-foreground ml-2">紧凑尺寸 (size="sm")</span>
        </div>
      </div>
    </TooltipProvider>
  )
}
