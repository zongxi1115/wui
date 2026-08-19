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
        className="mb-2 block text-xs font-medium text-muted-foreground"
      >
        快速搜索文档或代码
      </label>
      <Input
        id="spotlight-search"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="搜索组件、API 或设计规范..."
        visualSize="default"
        startContent={<SearchIcon className="size-4" />}
        endContent={
          value ? (
            <button
              type="button"
              className="rounded-full p-0.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              onClick={() => setValue("")}
              aria-label="清空搜索内容"
            >
              <XIcon className="size-3.5" />
            </button>
          ) : (
            <KbdGroup aria-label="快捷键: Command K">
              <Kbd
                size="sm"
                className="min-h-5 min-w-0 rounded border-border/80 px-1.5 font-mono text-[10px] text-muted-foreground"
              >
                ⌘ K
              </Kbd>
            </KbdGroup>
          )
        }
      />
      <p className="mt-2 text-[11px] text-muted-foreground">
        支持模糊匹配与拼音首字母检索
      </p>
    </div>
  )
}
