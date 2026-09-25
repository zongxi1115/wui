"use client"

import * as React from "react"
import { SearchIcon } from "lucide-react"

import { Input } from "@/registry/ui/input"
import { Kbd } from "@/registry/ui/kbd"

export default function InputDemo() {
  const [value, setValue] = React.useState("")

  return (
    <div className="grid w-full max-w-sm gap-2">
      <label htmlFor="spotlight-search" className="text-sm font-medium">
        搜索文档
      </label>
      <Input
        id="spotlight-search"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="组件、API 或设计规范"
        allowClear
        startContent={<SearchIcon />}
        endContent={
          value ? null : (
            <Kbd size="sm" className="text-muted-foreground font-mono text-[10px]">
              ⌘K
            </Kbd>
          )
        }
      />
      <p className="text-muted-foreground text-xs">支持模糊匹配与拼音首字母检索</p>
    </div>
  )
}
