"use client"

import * as React from "react"

import { cn } from "@/registry/lib/utils"

import {
  ChartFrame,
  ChartHeader,
  ChartTooltip,
  chartColors,
  defaultValueFormatter,
  useChartSize,
  type ChartDatum,
  type ChartVariant,
} from "./chart-core"

export interface PieChartProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "children" | "title"> {
  /** 图表标题，用于说明正在展示的 100% 构成指标。 */
  title: React.ReactNode
  /** 补充总体、时间范围或数据口径；应明确整体分母。 */
  description?: React.ReactNode
  /** 标题右侧的操作区。 */
  actions?: React.ReactNode
  /** Lieflat 色彩系统；无序构成不超过四类时可用 palm。 @default "mono" */
  variant?: ChartVariant
  /** 模板来源行，例如“TICK DONUT · ACQUISITION · ANALYTICS”。 */
  source?: React.ReactNode
  /** 每行代表一个构成类别的数据，最多六类。 */
  data: ChartDatum[]
  /** 类别名称字段。 */
  nameKey: string
  /** 类别数值字段。 */
  valueKey: string
  /** 可选的类别颜色字段。 */
  colorKey?: string
  /** 图表绘图区高度，单位为像素。 @default 320 */
  height?: number
  /** 保留以兼容旧调用；F4 固定采用刻度环。 */
  innerRadius?: number
  /** 保留以兼容旧调用；刻度段之间自然留白。 */
  padAngle?: number
  /** 是否显示类别和占比标签。 @default true */
  showLabels?: boolean
  /** 是否显示类别图例。 @default true */
  showLegend?: boolean
  /** 环图中心显示的内容。 */
  centerContent?: React.ReactNode
  /** 自定义数值的显示格式。 */
  valueFormatter?: (value: number, datum: ChartDatum) => React.ReactNode
  /** 自定义类别标签。 */
  labelFormatter?: (name: string, value: number, percentage: number, datum: ChartDatum) => React.ReactNode
}

function polar(cx: number, cy: number, radius: number, degrees: number) {
  const radians = (degrees * Math.PI) / 180
  return { x: cx + Math.cos(radians) * radius, y: cy + Math.sin(radians) * radius }
}

function variation(index: number, seed: number) {
  return Math.abs(((index * 73856093) ^ (seed * 19349663)) % 1000) / 1000
}

/** F4 Tick Donut：一个细刻度代表整体的一个百分点，而不是一块扇形。 */
function PieChart({
  title,
  description,
  actions,
  variant = "mono",
  source,
  data,
  nameKey,
  valueKey,
  colorKey,
  height = 320,
  innerRadius: _innerRadius,
  padAngle: _padAngle,
  showLabels = true,
  showLegend = true,
  centerContent,
  valueFormatter = (value) => defaultValueFormatter(value),
  labelFormatter = (name, _value, percentage) => `${name} · ${Math.round(percentage * 100)}%`,
  className,
  ...props
}: PieChartProps) {
  const id = React.useId()
  const titleId = `${id}-title`
  const descriptionId = `${id}-description`
  const { ref, width } = useChartSize()
  const [activeIndex, setActiveIndex] = React.useState<number | null>(null)
  const entries = data.slice(0, 6)
  const total = entries.reduce((sum, datum) => sum + Math.max(0, Number(datum[valueKey]) || 0), 0)
  const cx = width / 2
  const cy = height * 0.47
  const radius = Math.min(width, height) * (showLabels ? 0.2 : 0.25)
  let cursor = 0
  const segments = entries.map((datum, index) => {
    const value = Math.max(0, Number(datum[valueKey]) || 0)
    const percentage = total > 0 ? value / total : 0
    const ticks = Math.round(percentage * 100)
    const start = cursor
    cursor += ticks
    const color = (colorKey ? (datum[colorKey] as string | undefined) : undefined) ?? chartColors[index % chartColors.length]
    return { datum, value, percentage, ticks, start, color }
  })
  const activeSegment = activeIndex === null ? null : segments[activeIndex]
  const tooltipPoint = activeSegment ? polar(cx, cy, radius + 18, -90 + (activeSegment.start + activeSegment.ticks / 2) * 3.6) : { x: 0, y: 0 }

  return (
    <ChartFrame variant={variant} source={source} className={cn(className)} {...props}>
      <ChartHeader title={title} description={description} actions={actions} titleId={titleId} descriptionId={descriptionId} />
      <div ref={ref} className="relative w-full">
        <svg className="block w-full overflow-visible" width={width} height={height} viewBox={`0 0 ${width} ${height}`} role="img" aria-labelledby={`${titleId}${description ? ` ${descriptionId}` : ""}`}>
          {segments.map((segment, segmentIndex) => {
            const middle = -90 + (segment.start + segment.ticks / 2) * 3.6
            const labelPoint = polar(cx, cy, radius + 37, middle)
            const guideStart = polar(cx, cy, radius + 19, middle)
            const guideEnd = polar(cx, cy, radius + 31, middle)
            const anchor = Math.cos((middle * Math.PI) / 180) > 0.3 ? "start" : Math.cos((middle * Math.PI) / 180) < -0.3 ? "end" : "middle"
            return (
              <g key={segmentIndex} opacity={activeIndex === null || activeIndex === segmentIndex ? 1 : 0.42} tabIndex={0} className="outline-none" onPointerEnter={() => setActiveIndex(segmentIndex)} onPointerLeave={() => setActiveIndex(null)} onFocus={() => setActiveIndex(segmentIndex)} onBlur={() => setActiveIndex(null)}>
                {Array.from({ length: segment.ticks }, (_, tickIndex) => {
                  const index = segment.start + tickIndex
                  const angle = -90 + index * 3.6
                  const from = polar(cx, cy, radius, angle)
                  const to = polar(cx, cy, radius + 10 + variation(index + 1, segmentIndex + 2) * 6, angle)
                  return <line key={tickIndex} x1={from.x} y1={from.y} x2={to.x} y2={to.y} stroke={segment.color} strokeWidth="1" vectorEffect="non-scaling-stroke" />
                })}
                {showLabels && segment.ticks >= 5 ? <g>
                  <line x1={guideStart.x} y1={guideStart.y} x2={guideEnd.x} y2={guideEnd.y} stroke="var(--chart-faint)" strokeWidth="0.7" strokeDasharray="1 3" />
                  <text x={labelPoint.x} y={labelPoint.y + 3} textAnchor={anchor} fill={segment.color} fontSize="8" fontWeight="800" letterSpacing="0.04em">
                    {labelFormatter(String(segment.datum[nameKey]), segment.value, segment.percentage, segment.datum)}
                  </text>
                </g> : null}
              </g>
            )
          })}
          {Array.from({ length: 10 }, (_, index) => {
            const point = polar(cx, cy, radius - 5, -90 + index * 36)
            return <circle key={index} cx={point.x} cy={point.y} r="0.8" fill="var(--chart-faint)" />
          })}
          {centerContent ? <foreignObject x={cx - radius * 0.72} y={cy - 16} width={radius * 1.44} height="32"><div className="flex size-full items-center justify-center text-center text-sm font-semibold">{centerContent}</div></foreignObject> : <>
            <text x={cx} y={cy - 2} textAnchor="middle" fill="var(--chart-ink)" fontSize="22" fontWeight="800" style={{ fontVariantNumeric: "tabular-nums" }}>100</text>
            <text x={cx} y={cy + 14} textAnchor="middle" fill="var(--chart-muted)" fontSize="7" fontWeight="600" letterSpacing="0.1em">TICKS · ONE = 1%</text>
          </>}
          <text x={cx} y={height - 8} textAnchor="middle" fill="var(--chart-faint)" fontSize="7" fontWeight="600" letterSpacing="0.12em">TWELVE O’CLOCK IS ZERO · DOT MARKS EVERY TENTH</text>
        </svg>
        <ChartTooltip active={activeSegment !== null} x={tooltipPoint.x} y={tooltipPoint.y} width={width} label={activeSegment ? String(activeSegment.datum[nameKey]) : ""} rows={activeSegment ? [{ key: valueKey, label: `${Math.round(activeSegment.percentage * 100)}%`, value: valueFormatter(activeSegment.value, activeSegment.datum), color: activeSegment.color }] : []} />
      </div>
      {showLegend ? <div className="flex flex-wrap justify-center gap-x-5 gap-y-2" aria-hidden="true">{segments.map((segment, index) => <span key={index} className="inline-flex items-center gap-2 text-xs text-[var(--chart-muted)]"><span className="size-1.5 rounded-none" style={{ backgroundColor: segment.color }} />{String(segment.datum[nameKey])}</span>)}</div> : null}
      <table className="sr-only"><thead><tr><th>{nameKey}</th><th>{valueKey}</th></tr></thead><tbody>{entries.map((datum, index) => <tr key={index}><th>{String(datum[nameKey])}</th><td>{String(datum[valueKey])}</td></tr>)}</tbody></table>
    </ChartFrame>
  )
}

export { PieChart }
export type { ChartDatum }
