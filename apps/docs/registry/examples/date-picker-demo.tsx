"use client"

import * as React from "react"

import { DatePicker } from "@/registry/ui/date-picker"

export default function DatePickerDemo() {
  const [date, setDate] = React.useState<Date>()
  return (
    <div className="grid w-full max-w-sm gap-2">
      <label className="text-sm font-medium">项目截止日期</label>
      <DatePicker
        value={date}
        onValueChange={setDate}
        placeholder="请选择截止日期"
        min={new Date(2026, 6, 1)}
      />
      <p className="text-muted-foreground text-xs">
        {date
          ? `计划于 ${date.toLocaleDateString("zh-CN")} 完成`
          : "选择日期后会同步到项目日程。"}
      </p>
    </div>
  )
}
