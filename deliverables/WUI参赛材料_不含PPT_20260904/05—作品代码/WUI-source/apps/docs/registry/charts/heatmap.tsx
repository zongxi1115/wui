"use client"

import * as React from "react"
import { cn } from "@/registry/lib/utils"
import {
  ChartHeader,
  ChartTooltip,
  useChartSize,
} from "./chart-core"

export interface HeatmapDatum {
  /** 日期字符串（形如 "2026-03-01"）。 */
  date: string
  /** 对应的数值或活跃度计数值。 */
  value: number
}

export interface HeatmapProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children" | "title"> {
  /** 图表标题。 */
  title: React.ReactNode
  /** 补充说明或副标题。 */
  description?: React.ReactNode
  /** 标题右侧操作区。 */
  actions?: React.ReactNode
  /** 日历热力图数据列表。 */
  data: HeatmapDatum[]
  /** 开始日期；未传时自动使用数据最早日期或前半年。 */
  startDate?: string
  /** 结束日期；未传时自动使用数据最晚日期或当天。 */
  endDate?: string
  /** 格子尺寸（像素）。 @default 12 */
  cellSize?: number
  /** 格子间距（像素）。 @default 3 */
  cellGap?: number
  /** 格子圆角半径（像素）。 @default 2 */
  cellRadius?: number
  /** 是否展示星期标签（如 Mon, Wed, Fri）。 @default true */
  showWeekdayLabels?: boolean
  /** 是否展示顶部月份标签。 @default true */
  showMonthLabels?: boolean
  /** 自定义数值展示文案。 */
  valueFormatter?: (value: number, date: string) => React.ReactNode
}

const WEEKDAYS = ["日", "一", "二", "三", "四", "五", "六"]
const MONTHS = [
  "1月",
  "2月",
  "3月",
  "4月",
  "5月",
  "6月",
  "7月",
  "8月",
  "9月",
  "10月",
  "11月",
  "12月",
]

/** 日历活跃度热力图，展示按天分布的高频活动矩阵与密度趋势。 */
function Heatmap({
  title,
  description,
  actions,
  data,
  startDate,
  endDate,
  cellSize = 12,
  cellGap = 3,
  cellRadius = 2,
  showWeekdayLabels = true,
  showMonthLabels = true,
  valueFormatter = (val, date) => `${val} 次活动 · ${date}`,
  className,
  ...props
}: HeatmapProps) {
  const { ref, width } = useChartSize()
  const [activeCell, setActiveCell] = React.useState<{
    date: string
    value: number
    x: number
    y: number
  } | null>(null)

  const dataMap = React.useMemo(() => {
    const map = new Map<string, number>()
    for (const d of data) {
      map.set(d.date, d.value)
    }
    return map
  }, [data])

  const maxValue = React.useMemo(() => {
    let max = 0
    for (const d of data) {
      if (d.value > max) max = d.value
    }
    return max > 0 ? max : 1
  }, [data])

  const { days, monthLabels, totalWeeks } = React.useMemo(() => {
    const end = endDate ? new Date(endDate) : new Date()
    const start = startDate
      ? new Date(startDate)
      : new Date(end.getTime() - 28 * 7 * 24 * 60 * 60 * 1000)

    const list: Array<{
      dateStr: string
      date: Date
      weekIndex: number
      dayIndex: number
      value: number
    }> = []

    const mLabels: Array<{ monthName: string; weekIndex: number }> = []

    const cur = new Date(start)
    let currentWeekIndex = 0
    let lastMonth = -1

    while (cur <= end) {
      const year = cur.getFullYear()
      const month = String(cur.getMonth() + 1).padStart(2, "0")
      const day = String(cur.getDate()).padStart(2, "0")
      const dateStr = `${year}-${month}-${day}`
      const dayOfWeek = cur.getDay()

      if (cur.getMonth() !== lastMonth) {
        mLabels.push({
          monthName: MONTHS[cur.getMonth()],
          weekIndex: currentWeekIndex,
        })
        lastMonth = cur.getMonth()
      }

      list.push({
        dateStr,
        date: new Date(cur),
        weekIndex: currentWeekIndex,
        dayIndex: dayOfWeek,
        value: dataMap.get(dateStr) ?? 0,
      })

      if (dayOfWeek === 6) {
        currentWeekIndex++
      }
      cur.setDate(cur.getDate() + 1)
    }

    return { days: list, monthLabels: mLabels, totalWeeks: currentWeekIndex + 1 }
  }, [dataMap, endDate, startDate])

  const weekdayMarginLeft = showWeekdayLabels ? 28 : 0
  const monthMarginTop = showMonthLabels ? 20 : 0
  const svgWidth = weekdayMarginLeft + totalWeeks * (cellSize + cellGap) + 16
  const svgHeight = monthMarginTop + 7 * (cellSize + cellGap) + 8

  const getColorClass = (val: number) => {
    if (val <= 0) return "fill-muted/50"
    const ratio = val / maxValue
    if (ratio < 0.25) return "fill-primary/20"
    if (ratio < 0.5) return "fill-primary/45"
    if (ratio < 0.75) return "fill-primary/70"
    return "fill-primary"
  }

  const id = React.useId()
  const titleId = `${id}-title`
  const descriptionId = `${id}-description`

  return (
    <div
      ref={ref}
      data-slot="heatmap"
      className={cn("flex flex-col gap-3 rounded-xl border border-border bg-card p-4", className)}
      {...props}
    >
      <ChartHeader
        title={title}
        description={description}
        actions={actions}
        titleId={titleId}
        descriptionId={descriptionId}
      />

      <div className="relative w-full overflow-x-auto select-none py-1">
        <svg
          width={Math.max(width - 32, svgWidth)}
          height={svgHeight}
          className="overflow-visible"
        >
          {/* Month Labels */}
          {showMonthLabels &&
            monthLabels.map((m, idx) => {
              const x = weekdayMarginLeft + m.weekIndex * (cellSize + cellGap)
              return (
                <text
                  key={idx}
                  x={x}
                  y={12}
                  className="fill-muted-foreground text-[10px] font-medium"
                >
                  {m.monthName}
                </text>
              )
            })}

          {/* Weekday Labels */}
          {showWeekdayLabels &&
            [1, 3, 5].map((dayIdx) => {
              const y = monthMarginTop + dayIdx * (cellSize + cellGap) + cellSize / 2
              return (
                <text
                  key={dayIdx}
                  x={0}
                  y={y}
                  dominantBaseline="central"
                  className="fill-muted-foreground text-[10px] font-medium"
                >
                  {WEEKDAYS[dayIdx]}
                </text>
              )
            })}

          {/* Day Cells */}
          {days.map((d) => {
            const x = weekdayMarginLeft + d.weekIndex * (cellSize + cellGap)
            const y = monthMarginTop + d.dayIndex * (cellSize + cellGap)

            return (
              <rect
                key={d.dateStr}
                x={x}
                y={y}
                width={cellSize}
                height={cellSize}
                rx={cellRadius}
                className={cn(
                  getColorClass(d.value),
                  "transition-all hover:stroke-foreground hover:stroke-1 cursor-pointer"
                )}
                onMouseEnter={() =>
                  setActiveCell({
                    date: d.dateStr,
                    value: d.value,
                    x: x + cellSize / 2,
                    y: y + cellSize / 2,
                  })
                }
                onMouseLeave={() => setActiveCell(null)}
              />
            )
          })}
        </svg>

        <ChartTooltip
          active={activeCell !== null}
          x={activeCell?.x ?? 0}
          y={activeCell?.y ?? 0}
          width={width}
          label={activeCell ? activeCell.date : ""}
          rows={
            activeCell
              ? [
                  {
                    key: "activity",
                    label: "活跃度",
                    value: valueFormatter(activeCell.value, activeCell.date),
                    color: "var(--primary)",
                  },
                ]
              : []
          }
        />
      </div>

      {/* Legend */}
      <div className="flex items-center justify-end gap-2 text-xs text-muted-foreground pt-1">
        <span>少</span>
        <div className="flex items-center gap-1">
          <span className="size-2.5 rounded-xs bg-muted/50" />
          <span className="size-2.5 rounded-xs bg-primary/20" />
          <span className="size-2.5 rounded-xs bg-primary/45" />
          <span className="size-2.5 rounded-xs bg-primary/70" />
          <span className="size-2.5 rounded-xs bg-primary" />
        </div>
        <span>多</span>
      </div>
    </div>
  )
}

export { Heatmap }
