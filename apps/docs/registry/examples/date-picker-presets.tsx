"use client"

import * as React from "react"

import { DatePicker, type DatePickerPreset } from "@/registry/ui/date-picker"

function fromToday(days: number) {
  const date = new Date()
  date.setHours(0, 0, 0, 0)
  date.setDate(date.getDate() + days)
  return date
}

function nextMonday() {
  const date = fromToday(1)
  while (date.getDay() !== 1) date.setDate(date.getDate() + 1)
  return date
}

function endOfMonth() {
  const today = new Date()
  return new Date(today.getFullYear(), today.getMonth() + 1, 0)
}

export default function DatePickerPresets() {
  const presets = React.useMemo<DatePickerPreset[]>(
    () => [
      { label: "今天", value: fromToday(0) },
      { label: "明天", value: fromToday(1) },
      { label: "下周一", value: nextMonday() },
      { label: "本月底", value: endOfMonth() },
    ],
    []
  )
  const [date, setDate] = React.useState<Date | undefined>(presets[2].value)

  return (
    <div className="grid w-full max-w-sm gap-2">
      <label className="text-sm font-medium">任务截止日期</label>
      <DatePicker
        value={date}
        onValueChange={setDate}
        presets={presets}
        min={fromToday(0)}
        formatOptions={{ month: "long", day: "numeric", weekday: "short" }}
        placeholder="设置截止日期"
      />
      <p className="text-muted-foreground text-xs">
        常用日期放在日历左侧，一次点击即可完成选择。
      </p>
    </div>
  )
}
