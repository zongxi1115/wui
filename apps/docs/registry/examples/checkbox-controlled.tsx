"use client"

import * as React from "react"
import { Checkbox } from "@/registry/ui/checkbox"

export default function CheckboxControlled() {
  const [checked, setChecked] = React.useState<boolean | "indeterminate">(true)

  return (
    <div className="flex flex-col items-start gap-4">
      <div className="flex items-center gap-3">
        <Checkbox
          id="controlled-cb"
          checked={checked}
          onCheckedChange={setChecked}
        />
        <label htmlFor="controlled-cb" className="cursor-pointer text-sm font-medium">
          接收每周数据摘要报告
        </label>
      </div>

      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <span>当前状态：</span>
        <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-foreground">
          {JSON.stringify(checked)}
        </code>
        <button
          type="button"
          onClick={() => setChecked((prev) => !prev)}
          className="ml-2 rounded border border-input px-2 py-0.5 text-xs hover:bg-muted"
        >
          切换状态
        </button>
      </div>
    </div>
  )
}
