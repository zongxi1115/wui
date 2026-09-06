"use client"

import * as React from "react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/registry/ui/tooltip"
import { Button } from "@/registry/ui/button"

export default function TooltipControlled() {
  const [open, setOpen] = React.useState(false)

  return (
    <TooltipProvider>
      <div className="flex flex-col items-start gap-4">
        <div className="flex items-center gap-4">
          <Tooltip open={open} onOpenChange={setOpen}>
            <TooltipTrigger asChild>
              <Button variant="outline">
                受控目标按钮
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <span>受外部 React 状态精确控制展开</span>
            </TooltipContent>
          </Tooltip>

          <span className="text-xs text-muted-foreground">
            当前状态：{open ? "提示已打开" : "提示已关闭"}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => setOpen((prev) => !prev)}
          >
            切换显示状态
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setOpen(false)}
          >
            强制隐藏
          </Button>
        </div>
      </div>
    </TooltipProvider>
  )
}
