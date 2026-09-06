"use client"

import * as React from "react"

import { DatePicker } from "@/registry/ui/date-picker"

export default function DatePickerDisabledDates() {
  const [date, setDate] = React.useState<Date>()

  // 仅允许选择工作日（周一至周五），并限制在未来 30 天之内
  const today = new Date()
  const maxDate = new Date()
  maxDate.setDate(today.getDate() + 30)

  const isWeekend = (d: Date) => {
    const day = d.getDay()
    return day === 0 || day === 6
  }

  return (
    <div className="flex w-full max-w-sm flex-col gap-2">
      <label className="text-sm font-medium text-foreground">
        工作日服务预约 (禁用周末与历史日期)
      </label>
      <DatePicker
        value={date}
        onValueChange={setDate}
        min={today}
        max={maxDate}
        disabledDate={isWeekend}
        placeholder="请选择 30 天内的工作日"
      />
      <p className="text-xs text-muted-foreground">
        周六、周日及今天之前的日期不可选择。
      </p>
    </div>
  )
}
