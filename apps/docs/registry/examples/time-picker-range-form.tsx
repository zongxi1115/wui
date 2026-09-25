"use client"

import * as React from "react"
import { AlertCircleIcon } from "lucide-react"

import { Button } from "@/registry/ui/button"
import { TimePicker } from "@/registry/ui/time-picker"

function toMinutes(value: string) {
  const [hour, minute] = value.split(":").map(Number)
  return hour * 60 + minute
}

function formatDuration(minutes: number) {
  const hours = Math.floor(minutes / 60)
  const rest = minutes % 60
  return [hours ? `${hours} 小时` : "", rest ? `${rest} 分钟` : ""]
    .filter(Boolean)
    .join(" ")
}

export default function TimePickerRangeForm() {
  const [start, setStart] = React.useState("09:30")
  const [end, setEnd] = React.useState("10:30")
  const [booked, setBooked] = React.useState(false)
  const duration = toMinutes(end) - toMinutes(start)
  const invalid = duration <= 0

  return (
    <form
      className="grid w-full max-w-sm gap-4"
      onSubmit={(event) => {
        event.preventDefault()
        setBooked(true)
      }}
    >
      <div>
        <p className="text-sm font-medium">3F 星河会议室</p>
        <p className="text-muted-foreground text-xs">
          可容纳 8 人 · 投屏 · 视频会议
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="grid gap-1.5">
          <label htmlFor="meeting-start" className="text-xs font-medium">
            开始时间
          </label>
          <TimePicker
            id="meeting-start"
            value={start}
            onValueChange={(next) => {
              setStart(next)
              setBooked(false)
            }}
            minuteStep={15}
          />
        </div>
        <div className="grid gap-1.5">
          <label htmlFor="meeting-end" className="text-xs font-medium">
            结束时间
          </label>
          <TimePicker
            id="meeting-end"
            value={end}
            onValueChange={(next) => {
              setEnd(next)
              setBooked(false)
            }}
            minuteStep={15}
            aria-invalid={invalid || undefined}
          />
        </div>
      </div>

      {invalid ? (
        <p className="text-destructive flex items-center gap-1.5 text-xs font-medium">
          <AlertCircleIcon className="size-3.5" />
          结束时间必须晚于开始时间
        </p>
      ) : (
        <p className="text-muted-foreground text-xs">
          时长 {formatDuration(duration)}
        </p>
      )}

      {booked ? (
        <p className="text-success text-sm font-medium">
          已预定 {start} – {end}，日历邀请已发送。
        </p>
      ) : (
        <Button type="submit" disabled={invalid}>
          预定会议室
        </Button>
      )}
    </form>
  )
}
