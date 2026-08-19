"use client"

import * as React from "react"

import { InputNumber } from "@/registry/ui/input-number"

export default function InputNumberSizes() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <span className="text-xs font-medium text-muted-foreground">紧凑尺寸 (sm - 32px)</span>
        <InputNumber size="sm" defaultValue={10} min={0} max={100} prefix="¥" suffix="元" />
      </div>

      <div className="flex flex-col gap-1.5">
        <span className="text-xs font-medium text-muted-foreground">默认尺寸 (default - 40px)</span>
        <InputNumber size="default" defaultValue={50} min={0} max={100} prefix="¥" suffix="元" />
      </div>

      <div className="flex flex-col gap-1.5">
        <span className="text-xs font-medium text-muted-foreground">大尺寸 (lg - 48px)</span>
        <InputNumber size="lg" defaultValue={80} min={0} max={100} prefix="¥" suffix="元" />
      </div>
    </div>
  )
}
