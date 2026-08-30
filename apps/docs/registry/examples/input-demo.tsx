"use client"

import * as React from "react"
import { SearchIcon, XIcon } from "lucide-react"
import { Input } from "@/registry/ui/input"
import { Kbd, KbdGroup } from "@/registry/ui/kbd"

export default function InputDemo() {
  const [value, setValue] = React.useState("")

  return (
    <div className="w-full max-w-sm">
      <label
        htmlFor="spotlight-search"
        className="text-muted-foreground mb-2 block text-xs font-medium"
      >
        快速搜索文档或代码
      </label>
      <Input
        id="spotlight-search"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="搜索组件、API 或设计规范..."
        size="default"
        startContent={<SearchIcon className="size-4" />}
        endContent={
          value ? (
            <button
              type="button"
              className="text-muted-foreground hover:bg-muted hover:text-foreground rounded-full p-0.5 transition-colors"
              onClick={() => setValue("")}
              aria-label="清空搜索内容"
            >
              <XIcon className="size-3.5" />
            </button>
          ) : (
            <KbdGroup aria-label="快捷键: Command K">
              <Kbd
                size="sm"
                className="border-border/80 text-muted-foreground min-h-5 min-w-0 rounded px-1.5 font-mono text-[10px]"
              >
                ⌘ K
              </Kbd>
            </KbdGroup>
          )
        }
      />
      <p className="text-muted-foreground mt-2 text-[11px]">
        支持模糊匹配与拼音首字母检索
      </p>
    </div>
  )
}
