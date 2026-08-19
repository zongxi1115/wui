"use client"

import * as React from "react"
import { CalendarOffIcon } from "lucide-react"

import { Calendar } from "@/registry/ui/calendar"

export default function CalendarDisabledDates() {
  const [date, setDate] = React.useState<Date | undefined>(new Date())

  // 禁用所有周末（周六与周日）以及过去的日期
  const isWeekendOrPast = (target: Date) => {
    const day = target.getDay()
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const isPast = target < today
    const isWeekend = day === 0 || day === 6
    return isPast || isWeekend
  }

  return (
    <div className="grid w-full max-w-md gap-4 sm:grid-cols-[auto_1fr] sm:items-start">
      <Calendar
        value={date}
        onValueChange={setDate}
        disabled={isWeekendOrPast}
        className="bg-background shadow-xs rounded-xl border"
      />
      <div className="grid gap-2 text-xs">
        <div className="flex items-center gap-1.5 font-medium text-foreground">
          <CalendarOffIcon className="size-4 text-warning" />
          <span>工作日预约限制规则</span>
        </div>
        <p className="text-muted-foreground leading-relaxed">
          通过 `disabled` 自定义判断函数，已自动禁用所有周末及已过去的历史日期，仅允许选择未来的工作日。
        </p>
        <div className="bg-muted/50 rounded-lg p-2.5">
          <span className="text-muted-foreground">当前选定：</span>
          <span className="font-semibold text-foreground ml-1">
            {date
              ? new Intl.DateTimeFormat("zh-CN", { dateStyle: "full" }).format(date)
              : "未选择"}
          </span>
        </div>
      </div>
    </div>
  )
}
