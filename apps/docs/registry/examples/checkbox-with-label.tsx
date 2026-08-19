"use client"

import * as React from "react"
import { Checkbox } from "@/registry/ui/checkbox"

export default function CheckboxWithLabel() {
  return (
    <div className="w-full max-w-sm rounded-lg border border-border p-4">
      <label htmlFor="terms-and-conditions" className="flex cursor-pointer items-start gap-3">
        <Checkbox id="terms-and-conditions" defaultChecked className="mt-0.5" />
        <div className="grid gap-1 leading-none">
          <span className="text-sm font-medium">接受服务条款与隐私政策</span>
          <p className="text-xs text-muted-foreground">
            勾选即表示您已阅读并同意我们的用户使用协议及数据处理声明。
          </p>
        </div>
      </label>
    </div>
  )
}
