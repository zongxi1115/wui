import { DownloadIcon, RefreshCwIcon } from "lucide-react"

import { Button } from "@/registry/ui/button"
import { Toolbar, ToolbarButton, ToolbarSeparator } from "@/registry/ui/toolbar"

export default function ToolbarDemo() {
  return (
    <Toolbar aria-label="数据操作">
      <ToolbarButton>
        <Button variant="ghost" size="sm">
          <RefreshCwIcon />
          刷新
        </Button>
      </ToolbarButton>
      <ToolbarSeparator />
      <ToolbarButton>
        <Button
          variant="ghost"
          size="icon"
          className="size-8"
          aria-label="导出数据"
        >
          <DownloadIcon />
        </Button>
      </ToolbarButton>
    </Toolbar>
  )
}
