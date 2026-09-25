"use client"

import * as React from "react"

import { Checkbox } from "@/registry/ui/checkbox"

const options = [
  {
    id: "notify-mention",
    label: "有人 @ 我时",
    description: "在评论、文档或任务中被提及时立即通知",
  },
  {
    id: "notify-assign",
    label: "任务指派给我时",
    description: "包含负责人变更与截止日期调整",
  },
  {
    id: "notify-digest",
    label: "每日项目动态",
    description: "每天 18:00 汇总你关注项目的进展",
  },
]

export default function CheckboxDemo() {
  const [selected, setSelected] = React.useState<string[]>(["notify-mention", "notify-assign"])

  function toggle(id: string, checked: boolean | "indeterminate") {
    setSelected((current) =>
      checked === true ? [...current, id] : current.filter((item) => item !== id)
    )
  }

  return (
    <fieldset className="w-full max-w-sm">
      <legend className="text-sm font-medium">桌面通知</legend>
      <p className="text-muted-foreground mt-1 text-xs">选择哪些事件需要推送到桌面</p>
      <div className="mt-4 grid gap-4">
        {options.map((option) => (
          <label
            key={option.id}
            htmlFor={option.id}
            className="flex cursor-pointer items-start gap-3"
          >
            <Checkbox
              id={option.id}
              checked={selected.includes(option.id)}
              onCheckedChange={(checked) => toggle(option.id, checked)}
              className="mt-px"
            />
            <span className="grid gap-1">
              <span className="text-sm font-medium leading-none">{option.label}</span>
              <span className="text-muted-foreground text-xs">{option.description}</span>
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  )
}
