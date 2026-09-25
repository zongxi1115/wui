"use client"

import * as React from "react"

import { cn } from "@/registry/lib/utils"
import { Input } from "@/registry/ui/input"

const MAX_LENGTH = 20

export default function InputControlled() {
  const [value, setValue] = React.useState("增长实验室")
  const slug = value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w一-龥-]/g, "")

  return (
    <div className="grid w-full max-w-sm gap-2">
      <div className="flex items-baseline justify-between">
        <label htmlFor="workspace-name" className="text-sm font-medium">
          工作区名称
        </label>
        <span
          className={cn(
            "text-muted-foreground text-xs tabular-nums transition-colors",
            value.length >= MAX_LENGTH && "text-warning"
          )}
        >
          {value.length}/{MAX_LENGTH}
        </span>
      </div>
      <Input
        id="workspace-name"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="例如：增长实验室"
        maxLength={MAX_LENGTH}
        allowClear
      />
      <p className="text-muted-foreground truncate text-xs">
        访问地址：
        <span className="text-foreground font-mono">
          wui.dev/{slug || "your-workspace"}
        </span>
      </p>
    </div>
  )
}
