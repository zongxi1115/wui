"use client"

import * as React from "react"

import { cn } from "@/registry/lib/utils"

export type ChartDatum = Record<string, string | number | null | undefined>

export interface ChartSeries {
  /** 数据字段名。 */
  key: string
  /** 图例和提示框中显示的名称。 */
  label?: string
  /** 覆盖当前序列的颜色。 */
  color?: string
  /** 折线序列的 SVG 虚线模式。 */
  strokeDasharray?: string
}

export interface ChartReferenceLine {
  /** 参考线对应的数值。 */
  value: number
  /** 显示在参考线末端的文字。 */
  label?: React.ReactNode
  /** 覆盖参考线颜色。 */
  color?: string
  /** SVG 虚线模式。 @default "4 4" */
  strokeDasharray?: string
}

export type ChartValueFormatter = (
  value: number,
  series: ChartSeries,
  datum: ChartDatum
) => React.ReactNode

export type ChartLabelFormatter = (
  value: string | number,
  datum: ChartDatum
) => React.ReactNode

export const chartColors = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
] as const

export const linePatterns = [undefined, "6 4", "2 4", "10 4 2 4"] as const

export const chartMargin = {
  top: 12,
  right: 12,
  bottom: 34,
  left: 52,
} as const

export function useChartSize() {
  const ref = React.useRef<HTMLDivElement>(null)
  const [width, setWidth] = React.useState(640)

  React.useLayoutEffect(() => {
    const element = ref.current!
    const observer = new ResizeObserver(([entry]) => {
      setWidth(Math.round(entry.contentRect.width))
    })
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  return { ref, width }
}

export function getChartLayout(width: number, height: number) {
  const left = width < 480 ? 44 : chartMargin.left
  const right = chartMargin.right
  const top = chartMargin.top
  const bottom = chartMargin.bottom

  return {
    left,
    right,
    top,
    bottom,
    plotWidth: width - left - right,
    plotHeight: height - top - bottom,
  }
}

export function getChartValue(datum: ChartDatum, key: string) {
  const value = datum[key]
  return typeof value === "number" && Number.isFinite(value) ? value : null
}

function niceStep(span: number, count: number) {
  const rough = span / Math.max(1, count)
  const power = 10 ** Math.floor(Math.log10(rough))
  const fraction = rough / power
  const niceFraction =
    fraction <= 1 ? 1 : fraction <= 2 ? 2 : fraction <= 5 ? 5 : 10
  return niceFraction * power
}

export function getChartScale({
  data,
  series,
  domain,
  includeZero = false,
  tickCount = 4,
}: {
  data: ChartDatum[]
  series: ChartSeries[]
  domain?: [number, number]
  includeZero?: boolean
  tickCount?: number
}) {
  const values = data.flatMap((datum) =>
    series.flatMap((item) => {
      const value = getChartValue(datum, item.key)
      return value == null ? [] : [value]
    })
  )

  let min = domain?.[0] ?? Math.min(...values)
  let max = domain?.[1] ?? Math.max(...values)

  if (includeZero) {
    min = Math.min(0, min)
    max = Math.max(0, max)
  }
  if (min === max) {
    min -= 1
    max += 1
  }

  const padding = includeZero ? 0 : (max - min) * 0.08
  const paddedMin = domain ? min : min - padding
  const paddedMax = domain ? max : max + padding
  const step = niceStep(paddedMax - paddedMin, tickCount)
  const niceMin = domain ? paddedMin : Math.floor(paddedMin / step) * step
  const niceMax = domain ? paddedMax : Math.ceil(paddedMax / step) * step
  const ticks: number[] = []

  for (let value = niceMin; value <= niceMax + step / 2; value += step) {
    ticks.push(Number(value.toPrecision(12)))
  }

  return { min: niceMin, max: niceMax, ticks }
}

export function scaleValue(
  value: number,
  min: number,
  max: number,
  size: number
) {
  return ((value - min) / (max - min)) * size
}

export function defaultValueFormatter(value: number) {
  return new Intl.NumberFormat("zh-CN", {
    notation: Math.abs(value) >= 10_000 ? "compact" : "standard",
    maximumFractionDigits: 1,
  }).format(value)
}

export function ChartHeader({
  title,
  description,
  actions,
  titleId,
  descriptionId,
}: {
  title: React.ReactNode
  description?: React.ReactNode
  actions?: React.ReactNode
  titleId: string
  descriptionId: string
}) {
  return (
    <div className="mb-5 flex items-start justify-between gap-4">
      <div className="min-w-0">
        <h3 id={titleId} className="text-foreground text-sm font-semibold">
          {title}
        </h3>
        {description ? (
          <p
            id={descriptionId}
            className="text-muted-foreground mt-1 text-xs leading-relaxed"
          >
            {description}
          </p>
        ) : null}
      </div>
      {actions ? <div className="shrink-0">{actions}</div> : null}
    </div>
  )
}

export function ChartLegend({
  series,
  kind,
}: {
  series: ChartSeries[]
  kind: "line" | "bar"
}) {
  if (series.length < 2) return null

  return (
    <div className="mb-3 flex flex-wrap gap-x-5 gap-y-2" aria-hidden="true">
      {series.map((item, index) => {
        const color = item.color ?? chartColors[index % chartColors.length]
        return (
          <span
            key={item.key}
            className="text-muted-foreground inline-flex items-center gap-2 text-xs"
          >
            {kind === "line" ? (
              <svg width="18" height="6" aria-hidden="true">
                <line
                  x1="0"
                  x2="18"
                  y1="3"
                  y2="3"
                  stroke={color}
                  strokeWidth="2"
                  strokeDasharray={
                    item.strokeDasharray ??
                    linePatterns[index % linePatterns.length]
                  }
                />
              </svg>
            ) : (
              <span className="size-2.5" style={{ backgroundColor: color }} />
            )}
            {item.label ?? item.key}
          </span>
        )
      })}
    </div>
  )
}

export function ChartTooltip({
  active,
  x,
  y,
  width,
  label,
  rows,
}: {
  active: boolean
  x: number
  y: number
  width: number
  label: React.ReactNode
  rows: Array<{
    key: string
    label: string
    value: React.ReactNode
    color: string
  }>
}) {
  if (!active) return null

  return (
    <div
      className={cn(
        "border-border bg-popover text-popover-foreground pointer-events-none absolute z-10 min-w-32 border px-3 py-2 text-xs shadow-sm",
        x > width / 2 ? "-translate-x-[calc(100%+10px)]" : "translate-x-[10px]"
      )}
      style={{ left: x, top: Math.max(0, y - 12) }}
      aria-hidden="true"
    >
      <div className="mb-1.5 font-medium">{label}</div>
      <div className="space-y-1">
        {rows.map((row) => (
          <div
            key={row.key}
            className="grid grid-cols-[auto_1fr_auto] items-center gap-2"
          >
            <span className="size-2" style={{ backgroundColor: row.color }} />
            <span className="text-muted-foreground">{row.label}</span>
            <span className="font-mono tabular-nums">{row.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export function ChartDataTable({
  data,
  xKey,
  series,
}: {
  data: ChartDatum[]
  xKey: string
  series: ChartSeries[]
}) {
  return (
    <table className="sr-only">
      <thead>
        <tr>
          <th>{xKey}</th>
          {series.map((item) => (
            <th key={item.key}>{item.label ?? item.key}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((datum, index) => (
          <tr key={index}>
            <th>{String(datum[xKey])}</th>
            {series.map((item) => (
              <td key={item.key}>{String(datum[item.key] ?? "")}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}
