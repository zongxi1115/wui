"use client"

import * as React from "react"
import { CalendarClockIcon, AlertCircleIcon } from "lucide-react"

import { TimePicker } from "@/registry/ui/time-picker"
import { Button } from "@/registry/ui/button"

export default function TimePickerRangeForm() {
  const [startTime, setStartTime] = React.useState("09:00")
  const [endTime, setEndTime] = React.useState("10:30")
  const [isInvalid, setIsInvalid] = React.useState(false)

  React.useEffect(() => {
    const [startH, startM] = startTime.split(":").map(Number)
    const [endH, endM] = endTime.split(":").map(Number)
    const startMinutes = startH * 60 + startM
    const endMinutes = endH * 60 + endM
    setIsInvalid(endMinutes <= startMinutes)
  }, [startTime, endTime])

  return (
    <div className="bg-background w-full max-w-md rounded-xl border p-5 shadow-xs">
      <div className="mb-4 flex items-center gap-2">
        <CalendarClockIcon className="text-primary size-5" />
        <div>
          <h4 className="text-sm font-semibold">会议室时段预约</h4>
          <p className="text-muted-foreground text-xs">设定会议起始与结束时间</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="grid gap-1.5">
          <label className="text-xs font-medium text-foreground">开始时间</label>
          <TimePicker
            value={startTime}
            onValueChange={setStartTime}
            minuteStep={15}
          />
        </div>

        <div className="grid gap-1.5">
          <label className="text-xs font-medium text-foreground">结束时间</label>
          <TimePicker
            value={endTime}
            onValueChange={setEndTime}
            minuteStep={15}
          />
        </div>
      </div>

      {isInvalid ? (
        <div className="text-destructive mt-3 flex items-center gap-1.5 text-xs font-medium">
          <AlertCircleIcon className="size-3.5" />
          <span>结束时间必须晚于开始时间</span>
        </div>
      ) : (
        <p className="text-muted-foreground mt-3 text-xs">
          会议持续时长：
          {(() => {
            const [sH, sM] = startTime.split(":").map(Number)
            const [eH, eM] = endTime.split(":").map(Number)
            const diff = eH * 60 + eM - (sH * 60 + sM)
            const hours = Math.floor(diff / 60)
            const mins = diff % 60
            return `${hours > 0 ? `${hours} 小时 ` : ""}${mins > 0 ? `${mins} 分钟` : ""}`
          })()}
        </p>
      )}

      <Button
        className="mt-4 w-full"
        disabled={isInvalid}
        onClick={() => alert(`已预约时段：${startTime} ~ ${endTime}`)}
      >
        确认提交预定
      </Button>
    </div>
  )
}
