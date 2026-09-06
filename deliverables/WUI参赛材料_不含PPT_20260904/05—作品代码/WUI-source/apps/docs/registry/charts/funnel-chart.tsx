"use client"

import * as React from "react"
import { cn } from "@/registry/lib/utils"
import {
  ChartHeader,
  ChartTooltip,
  chartColors,
  defaultValueFormatter,
  useChartSize,
  type ChartDatum,
} from "./chart-core"

export interface FunnelChartProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children" | "title"> {
  /** 图表标题。 */
  title: React.ReactNode
  /** 补充说明或副标题。 */
  description?: React.ReactNode
  /** 标题右侧操作区。 */
  actions?: React.ReactNode
  /** 漏斗图阶段数据列表。 */
  data: ChartDatum[]
  /** 阶段名称字段。 */
  nameKey: string
  /** 阶段数值字段。 */
  valueKey: string
  /** 绘图区高度（像素）。 @default 320 */
  height?: number
  /** 是否展示基于首阶段的转化率百分比。 @default true */
  showConversionRate?: boolean
  /** 是否展示相邻阶段之间的流失率。 @default true */
  showDropOff?: boolean
  /** 数值格式化函数。 */
  valueFormatter?: (value: number, datum: ChartDatum) => React.ReactNode
}

/** 转化漏斗图，展示多阶段业务流转、留存转化与流失分布。 */
function FunnelChart({
  title,
  description,
  actions,
  data,
  nameKey,
  valueKey,
  height = 320,
  showConversionRate = true,
  showDropOff = true,
  valueFormatter = defaultValueFormatter,
  className,
  ...props
}: FunnelChartProps) {
  const { ref, width } = useChartSize()
  const [activeStage, setActiveStage] = React.useState<{
    index: number
    datum: ChartDatum
    value: number
    x: number
    y: number
  } | null>(null)

  const stagesCount = data.length
  const maxValue = React.useMemo(() => {
    const firstVal = Number(data[0]?.[valueKey]) || 0
    return firstVal > 0 ? firstVal : 1
  }, [data, valueKey])

  const stageHeight = stagesCount > 0 ? Math.max(36, (height - (stagesCount - 1) * 8) / stagesCount) : 40

  const id = React.useId()
  const titleId = `${id}-title`
  const descriptionId = `${id}-description`

  return (
    <div
      ref={ref}
      data-slot="funnel-chart"
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

      <div className="relative flex flex-col justify-between select-none py-2" style={{ height }}>
        {data.map((datum, idx) => {
          const rawVal = Number(datum[valueKey]) || 0
          const color = chartColors[idx % chartColors.length]
          const prevVal = idx > 0 ? Number(data[idx - 1]?.[valueKey]) || 0 : rawVal
          const conversionFromFirst = Math.round((rawVal / maxValue) * 100)
          const dropOffFromPrev = prevVal > 0 ? Math.round(((prevVal - rawVal) / prevVal) * 100) : 0

          const barWidthRatio = Math.max(0.15, rawVal / maxValue)
          const barWidthPercent = `${barWidthRatio * 100}%`

          return (
            <div
              key={idx}
              className="group relative flex flex-col gap-1 cursor-pointer transition-all"
              onMouseEnter={() => {
                setActiveStage({
                  index: idx,
                  datum,
                  value: rawVal,
                  x: width / 2,
                  y: idx * (stageHeight + 8) + stageHeight / 2,
                })
              }}
              onMouseLeave={() => setActiveStage(null)}
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-foreground">
                  {String(datum[nameKey])}
                </span>
                <div className="flex items-center gap-2 font-mono">
                  <span className="font-semibold text-foreground">
                    {valueFormatter(rawVal, datum)}
                  </span>
                  {showConversionRate && (
                    <span className="text-[11px] text-muted-foreground">
                      ({conversionFromFirst}%)
                    </span>
                  )}
                </div>
              </div>

              {/* Funnel Bar */}
              <div className="relative flex h-8 w-full items-center justify-center overflow-hidden rounded-lg bg-muted/30">
                <div
                  className="h-full rounded-lg transition-all duration-300 opacity-80 group-hover:opacity-100"
                  style={{
                    width: barWidthPercent,
                    backgroundColor: color,
                  }}
                />
              </div>

              {/* Drop-off rate connector */}
              {showDropOff && idx > 0 && dropOffFromPrev > 0 && (
                <div className="absolute -top-3 right-4 z-10 flex items-center gap-1 rounded-full bg-background px-1.5 py-0.2 text-[10px] text-destructive border border-border/60 shadow-2xs font-mono">
                  ↓ 流失 {dropOffFromPrev}%
                </div>
              )}
            </div>
          )
        })}

        <ChartTooltip
          active={activeStage !== null}
          x={activeStage?.x ?? 0}
          y={activeStage?.y ?? 0}
          width={width}
          label={activeStage ? String(activeStage.datum[nameKey]) : ""}
          rows={
            activeStage
              ? [
                  {
                    key: "value",
                    label: "当前人数/量级",
                    value: valueFormatter(activeStage.value, activeStage.datum),
                    color: chartColors[activeStage.index % chartColors.length],
                  },
                  {
                    key: "rate",
                    label: "总转化率",
                    value: `${Math.round((activeStage.value / maxValue) * 100)}%`,
                    color: "var(--muted-foreground)",
                  },
                ]
              : []
          }
        />
      </div>
    </div>
  )
}

export { FunnelChart }
