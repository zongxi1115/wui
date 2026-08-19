"use client"

import * as React from "react"
import { RotateCcw } from "lucide-react"

import { Button } from "@/registry/ui/button"
import { DatePicker } from "@/registry/ui/date-picker"

export default function DatePickerControlled() {
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(
    new Date()
  )

  const setDaysFromToday = (days: number) => {
    const next = new Date()
    next.setDate(next.getDate() + days)
    setSelectedDate(next)
  }

  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-foreground">
          会议预约日期 (受控模式)
        </label>
        <DatePicker
          value={selectedDate}
          onValueChange={setSelectedDate}
          placeholder="选择会议排期…"
        />
      </div>

      <div className="flex items-center justify-between rounded-lg border bg-muted/40 p-3 text-xs">
        <span className="text-muted-foreground">快捷排期:</span>
        <div className="flex items-center gap-1.5">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-7 text-xs"
            onClick={() => setDaysFromToday(0)}
          >
            今天
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-7 text-xs"
            onClick={() => setDaysFromToday(1)}
          >
            明天
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-7 text-xs"
            onClick={() => setDaysFromToday(7)}
          >
            下周
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-7 text-xs"
            onClick={() => setSelectedDate(undefined)}
          >
            <RotateCcw className="mr-1 size-3" />
            清空
          </Button>
        </div>
      </div>
    </div>
  )
}
