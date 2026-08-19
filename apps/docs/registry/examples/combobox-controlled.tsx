"use client"

import * as React from "react"
import { UserCheck } from "lucide-react"

import { Button } from "@/registry/ui/button"
import { Combobox } from "@/registry/ui/combobox"

const members = [
  { value: "chen", label: "陈晨 (Tech Lead)", keywords: ["chenchen", "cc", "leader"] },
  { value: "lin", label: "林晓 (Frontend)", keywords: ["linxiao", "lx", "fe"] },
  { value: "zhou", label: "周远 (Backend)", keywords: ["zhouyuan", "zy", "be"] },
  { value: "wang", label: "王涵 (Product)", keywords: ["wanghan", "wh", "pm"] },
  { value: "guest", label: "访客账号 (只读)", disabled: true, keywords: ["visitor"] },
]

export default function ComboboxControlled() {
  const [assignee, setAssignee] = React.useState("chen")

  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-foreground flex items-center gap-1.5">
          <UserCheck className="size-4 text-muted-foreground" />
          <span>工单指派负责人</span>
        </label>
        <Combobox
          options={members}
          value={assignee}
          onValueChange={setAssignee}
          placeholder="搜索姓名或拼音缩写…"
          searchPlaceholder="输入姓名或拼音 (如 lx, be)…"
        />
      </div>

      <div className="flex flex-wrap items-center gap-2 rounded-lg border bg-muted/40 p-3 text-xs">
        <span className="text-muted-foreground mr-auto">
          当前指派: <strong className="font-mono text-foreground">{assignee || "待定"}</strong>
        </span>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-7 text-xs"
          onClick={() => setAssignee("zhou")}
        >
          切为周远
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-7 text-xs"
          onClick={() => setAssignee("")}
        >
          清空
        </Button>
      </div>
    </div>
  )
}
