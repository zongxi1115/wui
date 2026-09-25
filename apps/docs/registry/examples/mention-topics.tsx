"use client"

import * as React from "react"

import { Mention, MentionBadge, type MentionOption } from "@/registry/ui/mention"

const topics: MentionOption[] = [
  { id: "release", label: "版本发布", description: "128 条讨论" },
  { id: "design-review", label: "设计评审", description: "64 条讨论" },
  { id: "performance", label: "性能优化", description: "41 条讨论" },
  { id: "accessibility", label: "无障碍", description: "23 条讨论" },
]

export default function MentionTopics() {
  const [value, setValue] = React.useState("")
  const [picked, setPicked] = React.useState<string[]>(["版本发布"])

  return (
    <div className="grid w-full max-w-md gap-2">
      <span className="text-sm font-medium">发布动态</span>
      <Mention
        trigger="#"
        variant="ghost"
        value={value}
        onValueChange={setValue}
        options={topics}
        onSelectOption={(option) =>
          setPicked((current) =>
            current.includes(option.label) ? current : [...current, option.label]
          )
        }
        placeholder="输入 # 关联话题"
      />
      <div className="flex min-h-6 flex-wrap items-center gap-1.5">
        <span className="text-muted-foreground text-xs">已关联：</span>
        {picked.map((topic) => (
          <MentionBadge key={topic} prefix="#">
            {topic}
          </MentionBadge>
        ))}
      </div>
    </div>
  )
}
