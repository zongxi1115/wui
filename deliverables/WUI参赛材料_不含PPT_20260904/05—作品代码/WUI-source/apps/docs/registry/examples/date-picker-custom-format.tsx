"use client"

import * as React from "react"

import { DatePicker } from "@/registry/ui/date-picker"

export default function DatePickerCustomFormat() {
  const [date, setDate] = React.useState<Date | undefined>(new Date())

  return (
    <div className="flex w-full max-w-sm flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-foreground">
          中文长日期格式 (含星期)
        </label>
        <DatePicker
          value={date}
          onValueChange={setDate}
          locale="zh-CN"
          formatOptions={{
            year: "numeric",
            month: "long",
            day: "numeric",
            weekday: "short",
          }}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-foreground">
          英文简写格式 (US Locale)
        </label>
        <DatePicker
          value={date}
          onValueChange={setDate}
          locale="en-US"
          formatOptions={{
            month: "short",
            day: "numeric",
            year: "numeric",
          }}
        />
      </div>
    </div>
  )
}
