"use client"

import * as React from "react"

import { CalendarPanel, type CalendarEvent } from "@/registry/ui/calendar"

const events: CalendarEvent[] = [
  {
    id: "1",
    date: new Date(2026, 6, 2),
    title: "增长周会",
    meta: "10:00",
    tone: "info",
  },
  {
    id: "2",
    date: new Date(2026, 6, 2),
    title: "埋点评审",
    meta: "14:30",
    tone: "warning",
  },
  {
    id: "3",
    date: new Date(2026, 6, 7),
    title: "设计走查",
    meta: "11:00",
    tone: "primary",
  },
  { id: "4", date: new Date(2026, 6, 10), title: "版本冻结", tone: "warning" },
  {
    id: "5",
    date: new Date(2026, 6, 14),
    title: "用户访谈",
    meta: "09:30",
    tone: "success",
  },
  {
    id: "6",
    date: new Date(2026, 6, 14),
    title: "内容验收",
    meta: "13:00",
    tone: "neutral",
  },
  {
    id: "7",
    date: new Date(2026, 6, 18),
    title: "2.8.0 发布",
    meta: "16:00",
    tone: "primary",
  },
  {
    id: "8",
    date: new Date(2026, 6, 18),
    title: "发布复盘",
    meta: "17:30",
    tone: "info",
  },
  { id: "9", date: new Date(2026, 6, 18), title: "监控值班", tone: "warning" },
  { id: "10", date: new Date(2026, 6, 18), title: "公告同步", tone: "neutral" },
  {
    id: "11",
    date: new Date(2026, 6, 23),
    title: "季度规划",
    meta: "全天",
    tone: "success",
  },
  {
    id: "12",
    date: new Date(2026, 6, 28),
    title: "组件库评审",
    meta: "15:00",
    tone: "primary",
  },
  {
    id: "13",
    date: new Date(2026, 6, 31),
    title: "月度复盘",
    meta: "16:30",
    tone: "info",
  },
]

export default function CalendarPanelDemo() {
  const [date, setDate] = React.useState(new Date(2026, 6, 28))
  const [activeEvent, setActiveEvent] = React.useState<CalendarEvent | null>(
    null
  )

  return (
    <div className="w-full min-w-0">
      <CalendarPanel
        value={date}
        onValueChange={setDate}
        defaultMonth={new Date(2026, 6, 1)}
        events={events}
        onEventClick={setActiveEvent}
      />
      <div className="text-muted-foreground flex flex-wrap items-center justify-between gap-2 border border-t-0 px-4 py-2.5 text-xs">
        <span>
          {new Intl.DateTimeFormat("zh-CN", { dateStyle: "full" }).format(date)}
        </span>
        <span>
          {activeEvent
            ? `当前日程：${activeEvent.title}`
            : "选择日期或日程查看详情"}
        </span>
      </div>
    </div>
  )
}
