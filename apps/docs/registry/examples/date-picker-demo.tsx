"use client"

import * as React from "react"
import { CalendarDays } from "lucide-react"

import { DatePicker } from "@/registry/ui/date-picker"

export default function DatePickerDemo() {
  const [date, setDate] = React.useState<Date | undefined>(new Date())

  return (
    <div className="grid w-full max-w-sm gap-2">
      <label className="text-sm font-medium text-foreground flex items-center gap-1.5">
        <CalendarDays className="size-4 text-muted-foreground" />
        <span>里程碑交付日期</span>
      </label>
      <DatePicker
        value={date}
        onValueChange={setDate}
        placeholder="请选择项目交付截止日期"
      />
      <p className="text-xs text-muted-foreground">
        {date
          ? `预计交付日期: ${date.toLocaleDateString("zh-CN", { year: "numeric", month: "long", day: "numeric" })}`
          : "尚未指定交付日期"}
      </p>
    </div>
  )
}
