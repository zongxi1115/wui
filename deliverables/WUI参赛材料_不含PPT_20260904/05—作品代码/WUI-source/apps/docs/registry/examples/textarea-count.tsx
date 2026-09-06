"use client"

import * as React from "react"
import { Textarea } from "@/registry/ui/textarea"

export default function TextareaCount() {
  const [value, setValue] = React.useState("")

  return (
    <div className="w-full max-w-md space-y-2">
      <div className="flex items-center justify-between">
        <label htmlFor="release-summary" className="text-xs font-medium text-muted-foreground">
          版本发布摘要 (Release Notes)
        </label>
        <span className="text-[11px] text-muted-foreground">最多 140 字符</span>
      </div>
      <Textarea
        id="release-summary"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        maxLength={140}
        showCount
        resize="none"
        rows={4}
        placeholder="简要概括本次版本包含的核心特性、优化项与修复的已知问题..."
      />
    </div>
  )
}
