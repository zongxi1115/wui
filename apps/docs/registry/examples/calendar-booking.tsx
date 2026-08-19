"use client"

import * as React from "react"
import { ClockIcon, CheckCircle2Icon } from "lucide-react"

import { Calendar } from "@/registry/ui/calendar"
import { Button } from "@/registry/ui/button"

const timeSlots = [
  "09:00",
  "10:00",
  "11:30",
  "14:00",
  "15:30",
  "17:00",
]

export default function CalendarBooking() {
  const [selectedDate, setSelectedDate] = React.useState<Date>(new Date())
  const [selectedSlot, setSelectedSlot] = React.useState<string>("10:00")
  const [booked, setBooked] = React.useState(false)

  return (
    <div className="bg-background w-full max-w-lg rounded-2xl border p-5 shadow-xs">
      <div className="mb-4">
        <h3 className="text-base font-semibold">专家一对一咨询预约</h3>
        <p className="text-muted-foreground text-xs">
          选择日期与可用时段完成在线预约
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-[auto_1fr]">
        <Calendar
          value={selectedDate}
          onValueChange={(d) => {
            setSelectedDate(d)
            setBooked(false)
          }}
          className="border rounded-xl"
        />

        <div className="flex flex-col justify-between gap-4">
          <div>
            <div className="text-muted-foreground mb-2 flex items-center gap-1.5 text-xs font-medium">
              <ClockIcon className="size-3.5" />
              <span>可选时段 (30分钟/次)</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {timeSlots.map((slot) => {
                const isSelected = selectedSlot === slot
                return (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => {
                      setSelectedSlot(slot)
                      setBooked(false)
                    }}
                    className={`rounded-lg border px-3 py-2 text-xs font-medium transition-all ${
                      isSelected
                        ? "border-primary bg-primary text-primary-foreground shadow-xs"
                        : "hover:bg-accent border-input text-foreground"
                    }`}
                  >
                    {slot}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="border-t pt-3">
            {booked ? (
              <div className="text-success flex items-center gap-1.5 text-xs font-medium">
                <CheckCircle2Icon className="size-4" />
                <span>已成功预约！确认函已发送至邮箱。</span>
              </div>
            ) : (
              <Button
                size="sm"
                className="w-full"
                onClick={() => setBooked(true)}
              >
                确认预约 {selectedSlot}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
