"use client"

import * as React from "react"
import { RadioGroup, RadioGroupItem } from "@/registry/ui/radio-group"

export default function RadioGroupDisabled() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          整组禁用（无操作权限）
        </span>
        <RadioGroup defaultValue="opt-1" disabled className="gap-2.5">
          <label className="flex cursor-not-allowed items-center gap-3 text-muted-foreground">
            <RadioGroupItem value="opt-1" />
            <span className="text-sm">选中的禁用项</span>
          </label>
          <label className="flex cursor-not-allowed items-center gap-3 text-muted-foreground">
            <RadioGroupItem value="opt-2" />
            <span className="text-sm">未选中的禁用项</span>
          </label>
        </RadioGroup>
      </div>

      <div className="space-y-2">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          单项条件禁用（资源不足或需升级）
        </span>
        <RadioGroup defaultValue="cpu-2" className="gap-2.5">
          <label className="flex cursor-pointer items-center gap-3">
            <RadioGroupItem value="cpu-2" />
            <span className="text-sm">2 核 4GB 内存（基础型 - 可用）</span>
          </label>
          <label className="flex cursor-pointer items-center gap-3">
            <RadioGroupItem value="cpu-4" />
            <span className="text-sm">4 核 8GB 内存（通用型 - 可用）</span>
          </label>
          <label className="flex cursor-not-allowed items-center gap-3 text-muted-foreground">
            <RadioGroupItem value="cpu-8" disabled />
            <span className="text-sm">8 核 16GB 内存（已售罄 / 需企业认证）</span>
          </label>
        </RadioGroup>
      </div>
    </div>
  )
}
