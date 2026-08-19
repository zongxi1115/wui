"use client"

import * as React from "react"
import { RadioGroup, RadioGroupItem } from "@/registry/ui/radio-group"

export default function RadioGroupControlled() {
  const [value, setValue] = React.useState("monthly")

  return (
    <div className="flex flex-col items-start gap-4">
      <RadioGroup value={value} onValueChange={setValue} className="gap-3">
        <label htmlFor="billing-monthly" className="flex cursor-pointer items-center gap-3">
          <RadioGroupItem value="monthly" id="billing-monthly" />
          <span className="text-sm font-medium">按月结算（无长期合约）</span>
        </label>
        <label htmlFor="billing-yearly" className="flex cursor-pointer items-center gap-3">
          <RadioGroupItem value="yearly" id="billing-yearly" />
          <span className="text-sm font-medium">按年结算（立省 20%）</span>
        </label>
      </RadioGroup>

      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <span>当前选定方案：</span>
        <code className="rounded bg-muted px-1.5 py-0.5 font-mono font-medium text-foreground">
          {value}
        </code>
      </div>
    </div>
  )
}
