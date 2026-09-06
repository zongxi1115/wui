"use client"

import * as React from "react"
import { SunMoonIcon } from "lucide-react"

import { TimePicker } from "@/registry/ui/time-picker"

export default function TimePicker12Hour() {
  const [time, setTime] = React.useState("14:30")

  return (
    <div className="grid w-full max-w-sm gap-2">
      <div className="flex items-center gap-2">
        <SunMoonIcon className="size-4 text-amber-500" />
        <label className="text-sm font-medium">海外跨国会议时间 (12 小时制)</label>
      </div>
      <TimePicker
        hourCycle={12}
        minuteStep={15}
        value={time}
        onValueChange={setTime}
        placeholder="选择上午/下午时间"
      />
      <p className="text-muted-foreground text-xs">
        展示 AM/PM 分栏，底层标准输出 24 小时格式：
        <code className="bg-muted ml-1 rounded px-1.5 py-0.5 font-mono">{time}</code>
      </p>
    </div>
  )
}
