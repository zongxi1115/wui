import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/registry/ui/tooltip"
import { Button } from "@/registry/ui/button"
import { Badge } from "@/registry/ui/badge"
import { ShieldCheckIcon, HelpCircleIcon } from "lucide-react"

export default function TooltipRich() {
  return (
    <TooltipProvider delayDuration={200}>
      <div className="flex flex-wrap items-center gap-6">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <ShieldCheckIcon className="size-4 text-success" />
              <span>端到端加密已启用</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent className="max-w-xs space-y-1 p-3">
            <div className="flex items-center justify-between gap-2">
              <span className="font-semibold text-xs text-background">安全协议</span>
              <Badge variant="outline" className="text-[10px] px-1 py-0 border-background/30 text-background">
                TLS 1.3
              </Badge>
            </div>
            <p className="text-[11px] leading-relaxed text-background/80">
              所有出站及入站数据包均使用 256 位 AES-GCM 算法动态加密，保障传输无篡改。
            </p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground outline-none"
            >
              <span>并发处理限制</span>
              <HelpCircleIcon className="size-3.5" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="right">
            <span>当前套餐上限为 50 路并发请求</span>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  )
}
