"use client"

import * as React from "react"
import { Checkbox } from "@/registry/ui/checkbox"

export default function CheckboxDisabled() {
  return (
    <div className="flex flex-col gap-3">
      <label className="flex cursor-not-allowed items-center gap-3 text-muted-foreground">
        <Checkbox disabled defaultChecked={false} />
        <span className="text-sm">未勾选且禁用（无权修改）</span>
      </label>

      <label className="flex cursor-not-allowed items-center gap-3 text-muted-foreground">
        <Checkbox disabled defaultChecked={true} />
        <span className="text-sm">已勾选且禁用（系统默认开启）</span>
      </label>

      <label className="flex cursor-not-allowed items-center gap-3 text-muted-foreground">
        <Checkbox disabled checked="indeterminate" />
        <span className="text-sm">半选且禁用（部分锁定）</span>
      </label>
    </div>
  )
}
