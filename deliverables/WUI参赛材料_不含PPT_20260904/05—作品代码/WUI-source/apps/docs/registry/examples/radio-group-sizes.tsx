"use client"

import * as React from "react"
import { RadioGroup, RadioGroupItem } from "@/registry/ui/radio-group"

export default function RadioGroupSizes() {
  return (
    <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-8">
      <RadioGroup defaultValue="sm-opt">
        <label htmlFor="size-sm" className="flex cursor-pointer items-center gap-2.5">
          <RadioGroupItem size="sm" value="sm-opt" id="size-sm" />
          <span className="text-xs font-medium">紧凑 (sm - 16px)</span>
        </label>
      </RadioGroup>

      <RadioGroup defaultValue="default-opt">
        <label htmlFor="size-default" className="flex cursor-pointer items-center gap-2.5">
          <RadioGroupItem size="default" value="default-opt" id="size-default" />
          <span className="text-sm font-medium">默认 (default - 20px)</span>
        </label>
      </RadioGroup>

      <RadioGroup defaultValue="lg-opt">
        <label htmlFor="size-lg" className="flex cursor-pointer items-center gap-2.5">
          <RadioGroupItem size="lg" value="lg-opt" id="size-lg" />
          <span className="text-base font-medium">大尺寸 (lg - 24px)</span>
        </label>
      </RadioGroup>
    </div>
  )
}
