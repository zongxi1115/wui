"use client"

import * as React from "react"
import { Input } from "@/registry/ui/input"

export default function InputControlled() {
  const [value, setValue] = React.useState("WUI Design System")

  return (
    <div className="w-full max-w-sm space-y-3">
      <div className="space-y-1.5">
        <label htmlFor="ctrl-input" className="text-xs font-medium text-muted-foreground">
          受控文本输入
        </label>
        <Input
          id="ctrl-input"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="请输入文本..."
          maxLength={30}
        />
      </div>

      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>字符统计：{value.length} / 30</span>
        <button
          type="button"
          onClick={() => setValue("")}
          className="hover:text-foreground underline underline-offset-2"
        >
          清空
        </button>
      </div>
    </div>
  )
}
