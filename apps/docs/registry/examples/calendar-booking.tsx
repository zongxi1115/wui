"use client"

import * as React from "react"
import { motion, useReducedMotion } from "motion/react"

import { Button } from "@/registry/ui/button"
import { Calendar } from "@/registry/ui/calendar"
import { cn } from "@/registry/lib/utils"

const slots = ["09:00", "10:00", "11:30", "14:00", "15:30", "17:00"]

function isWeekend(date: Date) {
  return date.getDay() === 0 || date.getDay() === 6
}

// 用日期生成稳定的“已约满”时段，模拟后端返回的排班数据。
function bookedSlots(date: Date) {
  const seed = date.getDate() + date.getMonth()
  return slots.filter((_, index) => (seed + index) % 4 === 0)
}

function nextWorkday() {
  const date = new Date()
  date.setHours(0, 0, 0, 0)
  while (isWeekend(date)) date.setDate(date.getDate() + 1)
  return date
}

export default function CalendarBooking() {
  const reduceMotion = useReducedMotion()
  const slotLayoutId = React.useId()
  const [date, setDate] = React.useState(nextWorkday)
  const [slot, setSlot] = React.useState<string | null>(null)
  const [confirmed, setConfirmed] = React.useState<string | null>(null)
  const booked = bookedSlots(date)
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  return (
    <div className="grid w-full max-w-xl gap-6 sm:grid-cols-[auto_1fr]">
      <Calendar
        value={date}
        onValueChange={(next) => {
          setDate(next)
          setSlot(null)
          setConfirmed(null)
        }}
        min={today}
        disabled={isWeekend}
        className="bg-background rounded-lg border"
      />

      <div className="flex min-w-0 flex-col">
        <p className="text-sm font-medium">
          {new Intl.DateTimeFormat("zh-CN", {
            month: "long",
            day: "numeric",
            weekday: "long",
          }).format(date)}
        </p>
        <p className="text-muted-foreground mt-0.5 text-xs">
          产品咨询 · 30 分钟 · 腾讯会议
        </p>

        <div
          role="radiogroup"
          aria-label="可预约时段"
          className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-2"
        >
          {slots.map((item) => {
            const full = booked.includes(item)
            const active = slot === item
            return (
              <button
                key={item}
                type="button"
                role="radio"
                aria-checked={active}
                disabled={full}
                onClick={() => {
                  setSlot(item)
                  setConfirmed(null)
                }}
                className={cn(
                  "focus-visible:ring-ring/30 relative isolate h-9 rounded-md border text-sm tabular-nums outline-none transition-colors duration-150 focus-visible:ring-[3px] disabled:pointer-events-none disabled:line-through disabled:opacity-40",
                  active
                    ? "text-primary-foreground border-transparent"
                    : "hover:bg-accent"
                )}
              >
                {active ? (
                  <motion.span
                    aria-hidden
                    layoutId={slotLayoutId}
                    className="bg-primary absolute -inset-px z-[-1] rounded-md"
                    transition={
                      reduceMotion
                        ? { duration: 0 }
                        : { type: "spring", stiffness: 520, damping: 38, mass: 0.7 }
                    }
                  />
                ) : null}
                {item}
              </button>
            )
          })}
        </div>

        <div className="mt-auto pt-4">
          {confirmed ? (
            <p className="text-success text-sm font-medium">
              已预约 {confirmed}，会议链接已发送至邮箱。
            </p>
          ) : (
            <Button
              className="w-full"
              disabled={!slot}
              onClick={() => setConfirmed(slot)}
            >
              {slot ? `预约 ${slot}` : "请选择时段"}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
