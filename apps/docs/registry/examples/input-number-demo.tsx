"use client"

import * as React from "react"

import { InputNumber } from "@/registry/ui/input-number"

export default function InputNumberDemo() {
  const [value, setValue] = React.useState<number | null>(2)

  return (
    <div className="grid w-full max-w-xs gap-2">
      <label htmlFor="quantity" className="text-sm font-medium">
        购买数量
      </label>
      <InputNumber
        id="quantity"
        value={value}
        onValueChange={setValue}
        min={1}
        max={10}
      />
      <p className="text-muted-foreground text-xs">
        当前数量：{value ?? "未填写"}
      </p>
    </div>
  )
}
