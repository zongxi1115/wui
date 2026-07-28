"use client"

import * as React from "react"

import { TimePicker } from "@/registry/ui/time-picker"

export default function TimePickerDemo() {
  const [time, setTime] = React.useState("09:30")
  return (
    <div className="grid w-full max-w-sm gap-2">
      <label className="text-sm font-medium">会议开始时间</label>
      <TimePicker value={time} onValueChange={setTime} minuteStep={5} />
      <p className="text-muted-foreground text-xs">
        当前设置为 {time}，每 5 分钟一个时间点。
      </p>
    </div>
  )
}
