"use client"

import * as React from "react"

import { Calendar } from "@/registry/ui/calendar"

export default function CalendarDemo() {
  const [date, setDate] = React.useState(new Date(2026, 6, 28))

  return (
    <div className="grid w-full max-w-md gap-4 sm:grid-cols-[auto_1fr] sm:items-start">
      <Calendar
        value={date}
        onValueChange={setDate}
        className="bg-background shadow-xs rounded-lg border"
      />
      <div className="border-primary border-l-2 pl-3">
        <p className="text-muted-foreground text-xs font-medium uppercase tracking-wider">
          已选择
        </p>
        <p className="mt-1 text-sm font-semibold">
          {new Intl.DateTimeFormat("zh-CN", { dateStyle: "full" }).format(date)}
        </p>
        <p className="text-muted-foreground mt-1 text-xs leading-5">
          点击标题切换到月份 / 年份视图；方向键移动焦点，PageUp / PageDown 翻月。
        </p>
      </div>
    </div>
  )
}
