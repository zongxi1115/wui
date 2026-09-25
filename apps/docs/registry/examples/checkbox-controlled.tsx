"use client"

import * as React from "react"

import { Button } from "@/registry/ui/button"
import { Checkbox } from "@/registry/ui/checkbox"

type CheckedState = boolean | "indeterminate"

const states: Array<{ value: CheckedState; label: string }> = [
  { value: false, label: "未选" },
  { value: "indeterminate", label: "半选" },
  { value: true, label: "已选" },
]

export default function CheckboxControlled() {
  const [checked, setChecked] = React.useState<CheckedState>(true)

  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      <label
        htmlFor="weekly-digest"
        className="flex cursor-pointer items-start gap-3"
      >
        <Checkbox
          id="weekly-digest"
          checked={checked}
          onCheckedChange={setChecked}
          className="mt-0.5"
        />
        <span className="grid gap-1">
          <span className="text-sm font-medium leading-none">接收每周数据摘要</span>
          <span className="text-muted-foreground text-xs">
            每周一 09:00 发送上周的访问量、转化率与异常告警汇总
          </span>
        </span>
      </label>

      <div className="flex items-center gap-2 border-t pt-4">
        <span className="text-muted-foreground mr-auto text-xs">由外部状态驱动</span>
        {states.map((state) => (
          <Button
            key={String(state.value)}
            size="sm"
            variant={checked === state.value ? "secondary" : "ghost"}
            aria-pressed={checked === state.value}
            onClick={() => setChecked(state.value)}
          >
            {state.label}
          </Button>
        ))}
      </div>
    </div>
  )
}
