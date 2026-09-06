"use client"

import * as React from "react"
import { Checkbox } from "@/registry/ui/checkbox"

export default function CheckboxSizes() {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-8">
      <label className="flex cursor-pointer items-center gap-2.5">
        <Checkbox size="sm" defaultChecked />
        <span className="text-xs font-medium">紧凑 (sm - 16px)</span>
      </label>

      <label className="flex cursor-pointer items-center gap-2.5">
        <Checkbox size="default" defaultChecked />
        <span className="text-sm font-medium">默认 (default - 20px)</span>
      </label>

      <label className="flex cursor-pointer items-center gap-2.5">
        <Checkbox size="lg" defaultChecked />
        <span className="text-base font-medium">大尺寸 (lg - 24px)</span>
      </label>
    </div>
  )
}
