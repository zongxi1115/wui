"use client"

import * as React from "react"

import { DatePicker } from "@/registry/ui/date-picker"

export default function DatePickerSizes() {
  const [date] = React.useState<Date>(new Date())

  return (
    <div className="flex w-full max-w-sm flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <span className="text-xs font-medium text-muted-foreground">紧凑尺寸 (sm - 32px)</span>
        <DatePicker size="sm" defaultValue={date} placeholder="选择日期" />
      </div>

      <div className="flex flex-col gap-1.5">
        <span className="text-xs font-medium text-muted-foreground">默认尺寸 (default - 40px)</span>
        <DatePicker size="default" defaultValue={date} placeholder="选择日期" />
      </div>

      <div className="flex flex-col gap-1.5">
        <span className="text-xs font-medium text-muted-foreground">大尺寸 (lg - 48px)</span>
        <DatePicker size="lg" defaultValue={date} placeholder="选择日期" />
      </div>
    </div>
  )
}
