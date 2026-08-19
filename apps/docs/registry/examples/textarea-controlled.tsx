"use client"

import * as React from "react"
import { Textarea } from "@/registry/ui/textarea"

export default function TextareaControlled() {
  const [value, setValue] = React.useState(
    "这是一个受控文本域示例。您可以实时监听输入事件并同步更新外部状态。"
  )

  return (
    <div className="w-full max-w-md space-y-3">
      <div className="space-y-1.5">
        <label htmlFor="ctrl-textarea" className="text-xs font-medium text-muted-foreground">
          个人简介 (Bio)
        </label>
        <Textarea
          id="ctrl-textarea"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          rows={4}
          showCount
          maxLength={200}
        />
      </div>

      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>当前字数：{value.length} 字符</span>
        <button
          type="button"
          onClick={() => setValue("")}
          className="hover:text-foreground underline underline-offset-2"
        >
          清空内容
        </button>
      </div>
    </div>
  )
}
