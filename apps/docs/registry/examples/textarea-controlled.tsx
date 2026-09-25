"use client"

import * as React from "react"

import { Button } from "@/registry/ui/button"
import { Textarea } from "@/registry/ui/textarea"

const templates = [
  { label: "简洁", text: "前端工程师，专注设计系统与交互动效。" },
  {
    label: "详细",
    text: "8 年前端经验，负责过千万级用户产品的设计系统建设，关注可访问性、性能与交互细节。",
  },
]

export default function TextareaControlled() {
  const [value, setValue] = React.useState(templates[0].text)

  return (
    <div className="grid w-full max-w-md gap-2">
      <div className="flex items-center justify-between">
        <label htmlFor="profile-bio" className="text-sm font-medium">
          个人简介
        </label>
        <div className="flex items-center gap-1">
          {templates.map((template) => (
            <Button
              key={template.label}
              size="sm"
              variant="ghost"
              className="h-7 px-2 text-xs"
              onClick={() => setValue(template.text)}
            >
              {template.label}模板
            </Button>
          ))}
          <Button
            size="sm"
            variant="ghost"
            className="text-muted-foreground h-7 px-2 text-xs"
            disabled={!value}
            onClick={() => setValue("")}
          >
            清空
          </Button>
        </div>
      </div>
      <Textarea
        id="profile-bio"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        autoSize={{ minRows: 3, maxRows: 6 }}
        showCount
        maxLength={120}
        placeholder="一句话介绍你自己"
      />
    </div>
  )
}
