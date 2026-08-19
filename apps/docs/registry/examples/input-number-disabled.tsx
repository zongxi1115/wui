"use client"

import * as React from "react"

import { InputNumber } from "@/registry/ui/input-number"

export default function InputNumberDisabled() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-muted-foreground">
          禁用状态 (disabled)
        </label>
        <InputNumber
          disabled
          defaultValue={42}
          prefix="#"
          suffix="项"
        />
        <p className="text-xs text-muted-foreground">
          禁用状态下阻止文本录入与步进按钮交互。
        </p>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-foreground">
          只读状态 (readOnly)
        </label>
        <InputNumber
          readOnly
          defaultValue={1024}
          suffix="MB"
        />
        <p className="text-xs text-muted-foreground">
          只读模式支持选中文本复制，但禁止键盘编辑与增减操作。
        </p>
      </div>
    </div>
  )
}
