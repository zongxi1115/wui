"use client"

import * as React from "react"

import { cn } from "@/registry/lib/utils"

import {
  ChartFrame,
  ChartHeader,
  ChartTooltip,
  defaultValueFormatter,
  useChartSize,
  type ChartDatum,
  type ChartVariant,
} from "./chart-core"

export interface FunnelChartProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "children" | "title"> {
  /** 图表标题。 */
  title: React.ReactNode
  /** 补充说明或副标题；应明确每一刻度代表多少人或单位。 */
  description?: React.ReactNode
  /** 标题右侧操作区。 */
  actions?: React.ReactNode
  /** Lieflat 色彩系统；漏斗默认 mono。 @default "mono" */
  variant?: ChartVariant
  /** 模板来源行，例如“HOURGLASS STREAM · FUNNEL · GROWTH”。 */
  source?: React.ReactNode
  /** 漏斗图阶段数据列表。 */
  data: ChartDatum[]
  /** 阶段名称字段。 */
  nameKey: string
  /** 阶段数值字段。 */
  valueKey: string
  /** 绘图区高度（像素）。 @default 320 */
  height?: number
  /** 是否展示相邻阶段转化率。 @default true */
  showConversionRate?: boolean
  /** 是否展示相邻阶段流失率。 @default true */
  showDropOff?: boolean
  /** 每一竖刻度代表的真实数量；省略时自动取易读单位。 */
  tickStep?: number
  /** 数值格式化函数。 */
  valueFormatter?: (value: number, datum: ChartDatum) => React.ReactNode
}

function niceStep(maximum: number) {
  if (maximum <= 0) return 1
  const raw = maximum / 48
  const exponent = 10 ** Math.floor(Math.log10(raw))
  const fraction = raw / exponent
  return (fraction <= 1 ? 1 : fraction <= 2 ? 2 : fraction <= 5 ? 5 : 10) * exponent
}

function variation(index: number, seed: number) {
  return Math.abs(((index * 73856093) ^ (seed * 19349663)) % 1000) / 1000
}

/** L13 Hourglass Stream：阶段是由可数刻度组成的流束，损失通过细线显现。 */
function FunnelChart({
  title,
  description,
  actions,
  variant = "mono",
  source,
  data,
  nameKey,
  valueKey,
  height = 320,
  showConversionRate = true,
  showDropOff = true,
  tickStep,
  valueFormatter = defaultValueFormatter,
  className,
  ...props
}: FunnelChartProps) {
  const { ref, width } = useChartSize()
  const id = React.useId()
  const titleId = `${id}-title`
  const descriptionId = `${id}-description`
  const [activeIndex, setActiveIndex] = React.useState<number | null>(null)
  const stages = data.slice(0, 7).map((datum) => ({ datum, value: Math.max(0, Number(datum[valueKey]) || 0) }))
  const firstValue = stages[0]?.value || 1
  const step = tickStep && tickStep > 0 ? tickStep : niceStep(firstValue)
  const center = Math.max(130, width * 0.46)
  const labelX = Math.min(width - 90, center + Math.min(160, width * 0.31))
  const top = 28
  const rowGap = stages.length > 1 ? Math.min(64, (height - 72) / (stages.length - 1)) : 0
  const availableWidth = Math.max(80, Math.min(290, labelX - center - 18, center - 38) * 2)
  const yAt = (index: number) => top + index * rowGap
  const active = activeIndex === null ? null : stages[activeIndex]

  return (
    <ChartFrame ref={ref} variant={variant} source={source} data-slot="funnel-chart" className={cn(className)} {...props}>
      <ChartHeader title={title} description={description} actions={actions} titleId={titleId} descriptionId={descriptionId} />
      <div className="relative w-full">
        <svg className="block w-full overflow-visible" width={width} height={height} viewBox={`0 0 ${width} ${height}`} role="img" aria-labelledby={`${titleId}${description ? ` ${descriptionId}` : ""}`}>
          {stages.map((stage, index) => {
            const y = yAt(index)
            const halfWidth = (stage.value / firstValue) * availableWidth * 0.5
            const ticks = Math.round(stage.value / step)
            const previous = stages[index - 1]
            const conversion = previous?.value ? Math.round((stage.value / previous.value) * 100) : 100
            const dropOff = previous?.value ? Math.max(0, Math.round(((previous.value - stage.value) / previous.value) * 100)) : 0
            return (
              <g key={index} opacity={activeIndex === null || activeIndex === index ? 1 : 0.42} tabIndex={0} className="outline-none" onPointerEnter={() => setActiveIndex(index)} onPointerLeave={() => setActiveIndex(null)} onFocus={() => setActiveIndex(index)} onBlur={() => setActiveIndex(null)}>
                {index > 0 ? (() => {
                  const previousHalfWidth = (previous.value / firstValue) * availableWidth * 0.5
                  const threadCount = Math.min(34, Math.max(7, Math.round(previous.value / step)))
                  return <>
                    {Array.from({ length: threadCount }, (_, threadIndex) => {
                      const topX = center + (variation(threadIndex + 1, index * 7 + 1) - 0.5) * previousHalfWidth * 1.88
                      const bottomX = center + (variation(threadIndex + 3, index * 7 + 5) - 0.5) * halfWidth * 1.88
                      return <path key={threadIndex} d={`M${topX} ${yAt(index - 1) + 8} C${topX} ${yAt(index - 1) + rowGap * 0.45} ${bottomX} ${y - rowGap * 0.45} ${bottomX} ${y - 8}`} fill="none" stroke="var(--chart-faint)" strokeWidth="0.5" opacity="0.38" vectorEffect="non-scaling-stroke" />
                    })}
                    {showConversionRate ? <text x="24" y={(yAt(index - 1) + y) / 2 - (showDropOff && dropOff > 0 ? 2 : 0)} fill="var(--chart-muted)" fontSize="8.5" fontWeight="800" style={{ fontVariantNumeric: "tabular-nums" }}>{conversion}%</text> : null}
                    {showConversionRate ? <text x="24" y={(yAt(index - 1) + y) / 2 + 9} fill="var(--chart-faint)" fontSize="6" fontWeight="600" letterSpacing="0.08em">GET THROUGH</text> : null}
                    {showDropOff && dropOff > 0 ? <text x="24" y={(yAt(index - 1) + y) / 2 + 20} fill="var(--chart-faint)" fontSize="6.5" fontWeight="600">−{dropOff}% LOST</text> : null}
                  </>
                })() : null}
                {Array.from({ length: ticks }, (_, tickIndex) => {
                  const x = center - halfWidth + ((tickIndex + 0.5) / Math.max(1, ticks)) * halfWidth * 2 + (variation(tickIndex + 1, index + 3) - 0.5) * 3
                  return <line key={tickIndex} x1={x} y1={y - 6} x2={x} y2={y + 6} stroke="var(--chart-ink)" strokeWidth="0.8" opacity={0.45 + variation(tickIndex + 2, index + 5) * 0.5} vectorEffect="non-scaling-stroke" />
                })}
                <line x1={center + halfWidth + 6} y1={y} x2={labelX - 4} y2={y} stroke="var(--chart-grid)" strokeWidth="0.8" />
                <text x={labelX} y={y - 1} fill="var(--chart-muted)" fontSize="7.5" fontWeight="700" letterSpacing="0.08em">{String(stage.datum[nameKey])}</text>
                <text x={labelX} y={y + 11} fill="var(--chart-ink)" fontSize="9.5" fontWeight="800" style={{ fontVariantNumeric: "tabular-nums" }}>{valueFormatter(stage.value, stage.datum)}</text>
              </g>
            )
          })}
          <text x={center} y={height - 8} textAnchor="middle" fill="var(--chart-faint)" fontSize="7" fontWeight="600" letterSpacing="0.12em">ONE TICK = {defaultValueFormatter(step)} · THREADS SHOW WHO GETS THROUGH</text>
        </svg>
        <ChartTooltip active={active !== null} x={center} y={activeIndex === null ? 0 : yAt(activeIndex)} width={width} label={active ? String(active.datum[nameKey]) : ""} rows={active ? [{ key: "value", label: "当前数量", value: valueFormatter(active.value, active.datum), color: "var(--chart-ink)" }, { key: "rate", label: "相对首阶段", value: `${Math.round((active.value / firstValue) * 100)}%`, color: "var(--chart-muted)" }] : []} />
      </div>
    </ChartFrame>
  )
}

export { FunnelChart }
