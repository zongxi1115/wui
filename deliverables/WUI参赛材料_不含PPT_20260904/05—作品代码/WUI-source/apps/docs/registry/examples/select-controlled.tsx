"use client"

import * as React from "react"
import { RotateCcw } from "lucide-react"

import { Button } from "@/registry/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/registry/ui/select"

export default function SelectControlled() {
  const [theme, setTheme] = React.useState<string>("system")

  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-foreground">
          界面外观主题 (受控模式)
        </label>
        <Select value={theme} onValueChange={setTheme}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="选择外观主题" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="light">浅色模式 (Light)</SelectItem>
            <SelectItem value="dark">深色模式 (Dark)</SelectItem>
            <SelectItem value="system">跟随系统偏好 (System)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center justify-between rounded-lg border bg-muted/40 p-3 text-xs">
        <span className="text-muted-foreground">
          当前状态: <strong className="font-mono text-foreground">{theme}</strong>
        </span>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-7 text-xs"
            onClick={() => setTheme("dark")}
          >
            设为深色
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-7 text-xs"
            onClick={() => setTheme("system")}
          >
            <RotateCcw className="mr-1 size-3" />
            重置
          </Button>
        </div>
      </div>
    </div>
  )
}
