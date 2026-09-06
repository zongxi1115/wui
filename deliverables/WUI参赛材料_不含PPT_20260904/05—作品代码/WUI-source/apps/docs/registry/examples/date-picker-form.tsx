"use client"

import * as React from "react"
import { CalendarRange, CheckCircle2 } from "lucide-react"

import { Button } from "@/registry/ui/button"
import { DatePicker } from "@/registry/ui/date-picker"

export default function DatePickerForm() {
  const [startDate, setStartDate] = React.useState<Date | undefined>(new Date())
  const [endDate, setEndDate] = React.useState<Date | undefined>(() => {
    const d = new Date()
    d.setDate(d.getDate() + 14)
    return d
  })
  const [saved, setSaved] = React.useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-md flex-col gap-4 rounded-xl border bg-card p-5 text-card-foreground shadow-xs">
      <div className="flex items-center gap-2 border-b pb-3">
        <CalendarRange className="size-4 text-primary" />
        <h4 className="text-sm font-semibold">项目迭代周期规划表单</h4>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-foreground">
            迭代启动日期
          </label>
          <DatePicker
            value={startDate}
            onValueChange={setStartDate}
            placeholder="开始日期"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-foreground">
            验收发布日期
          </label>
          <DatePicker
            value={endDate}
            onValueChange={setEndDate}
            min={startDate}
            placeholder="结束日期"
          />
        </div>
      </div>

      <div className="rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground">
        预计开发周期：{startDate && endDate ? `${Math.max(1, Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)))} 天` : "请选定完整的起止日期"}
      </div>

      <div className="flex items-center justify-between pt-1">
        {saved ? (
          <span className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="size-3.5" />
            迭代计划已提交
          </span>
        ) : <span />}
        <Button type="submit" size="sm">
          保存迭代计划
        </Button>
      </div>
    </form>
  )
}
