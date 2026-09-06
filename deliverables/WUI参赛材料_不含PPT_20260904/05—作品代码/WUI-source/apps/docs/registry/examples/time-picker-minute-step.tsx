"use client"

import * as React from "react"
import { TimePicker } from "@/registry/ui/time-picker"

export default function TimePickerMinuteStep() {
  const [preciseTime, setPreciseTime] = React.useState("08:03")
  const [halfHourTime, setHalfHourTime] = React.useState("14:30")

  return (
    <div className="grid w-full max-w-md gap-4 sm:grid-cols-2">
      <div className="grid gap-2">
        <label className="text-xs font-medium">高精度 (1 分钟步进)</label>
        <TimePicker
          minuteStep={1}
          value={preciseTime}
          onValueChange={setPreciseTime}
        />
        <p className="text-muted-foreground text-[11px]">
          适合定时任务、闹钟与工单精确打点
        </p>
      </div>

      <div className="grid gap-2">
        <label className="text-xs font-medium">半小时粗粒度 (30 分钟步进)</label>
        <TimePicker
          minuteStep={30}
          value={halfHourTime}
          onValueChange={setHalfHourTime}
        />
        <p className="text-muted-foreground text-[11px]">
          适合课程预约、日程规划等低频切换场景
        </p>
      </div>
    </div>
  )
}
