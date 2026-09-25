"use client"

import * as React from "react"
import { SearchIcon } from "lucide-react"

import { Input } from "@/registry/ui/input"
import { Typewriter } from "@/registry/ui/typewriter"

const suggestions = [
  "上周新增用户最多的渠道是哪个？",
  "汇总本月未关闭的 P0 缺陷",
  "对比华东与华南区域的复购率",
]

export default function TypewriterPrompt() {
  const [value, setValue] = React.useState("")

  return (
    <div className="flex w-full max-w-md flex-col gap-2">
      <label htmlFor="typewriter-prompt" className="text-sm font-medium">
        问问数据助手
      </label>
      <div className="relative">
        <Input
          id="typewriter-prompt"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          startContent={<SearchIcon />}
          aria-describedby="typewriter-prompt-hint"
        />
        {value === "" ? (
          <Typewriter
            aria-hidden="true"
            texts={suggestions}
            typeSpeed={55}
            deleteSpeed={25}
            pauseDuration={2000}
            className="pointer-events-none absolute top-1/2 left-[39px] -translate-y-1/2 text-sm text-muted-foreground"
          />
        ) : null}
      </div>
      <p id="typewriter-prompt-hint" className="text-xs text-muted-foreground">
        支持自然语言提问，结果会附带查询语句与数据来源。
      </p>
    </div>
  )
}
