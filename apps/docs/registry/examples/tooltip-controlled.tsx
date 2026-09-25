"use client"

import * as React from "react"
import { CopyIcon } from "lucide-react"

import { Button } from "@/registry/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/registry/ui/tooltip"

export default function TooltipControlled() {
  const [open, setOpen] = React.useState(false)
  const [copied, setCopied] = React.useState(false)
  const timer = React.useRef<ReturnType<typeof setTimeout>>(undefined)

  React.useEffect(() => () => clearTimeout(timer.current), [])

  const copy = () => {
    void navigator.clipboard.writeText("sk-live-8f2c3d7e0b5a91d")
    setCopied(true)
    setOpen(true)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => {
      setOpen(false)
      setCopied(false)
    }, 1400)
  }

  return (
    <TooltipProvider>
      <div className="flex items-center gap-2 rounded-md border py-1 pr-1 pl-3">
        <code className="text-muted-foreground font-mono text-xs">
          sk-live-8f2c…a91d
        </code>
        <Tooltip
          open={open}
          onOpenChange={(next) => {
            // 复制成功提示展示期间，不因指针移出而提前关闭
            if (!copied) setOpen(next)
          }}
        >
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="size-7" aria-label="复制密钥" onClick={copy}>
              <CopyIcon />
            </Button>
          </TooltipTrigger>
          <TooltipContent size="sm">{copied ? "已复制到剪贴板" : "复制密钥"}</TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  )
}
