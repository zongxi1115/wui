"use client"

import * as React from "react"

import { cn } from "@/registry/lib/utils"

import {
  ChartDataTable,
  ChartFrame,
  ChartHeader,
  ChartLegend,
  ChartTooltip,
  chartColors,
  defaultValueFormatter,
  getChartValue,
  useChartSize,
  type ChartDatum,
  type ChartLabelFormatter,
  type ChartSeries,
  type ChartValueFormatter,
  type ChartVariant,
} from "./chart-core"

export interface StackedAreaChartProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "children" | "title"> {
  /** 图表标题，用于说明连续时间上的总量和构成。 */
  title: React.ReactNode
  /** 应说明这是连续时间构成，而不是离散类目比较。 */
  description?: React.ReactNode
  /** 标题右侧的操作区。 */
  actions?: React.ReactNode
  /** Lieflat 色彩系统；连续构成流推荐 mono 或 porcelain。 @default "mono" */
  variant?: ChartVariant
  /** 模板来源行，例如“STREAM RIBBON · ACTIVE ACCOUNTS · PRODUCT”。 */
  source?: React.ReactNode
  /** 每行代表一个有序横轴节点的数据。 */
  data: ChartDatum[]
  /** 横轴标签字段。 */
  xKey: string
  /** F16 最多五条连续构成流。 */
  series: ChartSeries[]
  /** 是否将每个时间点归一化为百分比。 @default false */
  normalize?: boolean
  /** 图表绘图区高度，单位为像素。 @default 300 */
  height?: number
  /** 保留以兼容旧调用；F16 不使用常规网格。 */
  showGrid?: boolean
  /** 是否显示图例。 @default true */
  showLegend?: boolean
  /** 自定义原始数值的显示格式。 */
  valueFormatter?: ChartValueFormatter
  /** 自定义横轴标签。 */
  labelFormatter?: ChartLabelFormatter
}

function ribbonPath(top: Array<{ x: number; y: number }>, bottom: Array<{ x: number; y: number }>) {
  if (!top.length) return ""
  return `${top.map((point, index) => `${index === 0 ? "M" : "L"}${point.x.toFixed(1)} ${point.y.toFixed(1)}`).join(" ")} ${bottom.slice().reverse().map((point) => `L${point.x.toFixed(1)} ${point.y.toFixed(1)}`).join(" ")} Z`
}

/** F16 Stream Ribbon：以总量中心线为基线，让构成的交换和总量一起可见。 */
function StackedAreaChart({
  title,
  description,
  actions,
  variant = "mono",
  source,
  data,
  xKey,
  series,
  normalize = false,
  height = 300,
  showGrid: _showGrid,
  showLegend = true,
  valueFormatter = (value) => defaultValueFormatter(value),
  labelFormatter = (value) => String(value),
  className,
  ...props
}: StackedAreaChartProps) {
  const id = React.useId()
  const titleId = `${id}-title`
  const descriptionId = `${id}-description`
  const { ref, width } = useChartSize()
  const [activeIndex, setActiveIndex] = React.useState<number | null>(null)
  const visibleSeries = series.slice(0, 5)
  const totals = data.map((datum) => visibleSeries.reduce((sum, item) => sum + Math.max(0, getChartValue(datum, item.key) ?? 0), 0))
  const maximum = normalize ? 100 : Math.max(1, ...totals)
  const left = 24
  const right = 24
  const centerY = height * 0.45
  const scale = Math.min((height - 72) / maximum, 1.4)
  const xAt = (index: number) => data.length <= 1 ? width / 2 : left + (index / (data.length - 1)) * (width - left - right)
  const bottoms = data.map((_, index) => centerY - (normalize ? 100 : totals[index]) * scale / 2)
  const bands = visibleSeries.map((item, seriesIndex) => {
    const top: Array<{ x: number; y: number }> = []
    const bottom: Array<{ x: number; y: number }> = []
    data.forEach((datum, index) => {
      const total = totals[index]
      const before = visibleSeries.slice(0, seriesIndex).reduce((sum, previous) => sum + Math.max(0, getChartValue(datum, previous.key) ?? 0), 0)
      const value = Math.max(0, getChartValue(datum, item.key) ?? 0)
      const unit = normalize && total > 0 ? 100 / total : 1
      const y0 = bottoms[index] + before * unit * scale
      bottom.push({ x: xAt(index), y: y0 })
      top.push({ x: xAt(index), y: y0 + value * unit * scale })
    })
    return { item, top, bottom, color: item.color ?? chartColors[seriesIndex % chartColors.length] }
  })
  const activeDatum = activeIndex === null ? null : data[activeIndex]

  return (
    <ChartFrame variant={variant} source={source} className={cn(className)} {...props}>
      <ChartHeader title={title} description={description} actions={actions} titleId={titleId} descriptionId={descriptionId} />
      {showLegend ? <ChartLegend series={visibleSeries} kind="bar" /> : null}
      <div ref={ref} className="relative w-full">
        <svg
          className="focus-visible:outline-ring block w-full touch-pan-y overflow-visible outline-none focus-visible:outline-2 focus-visible:outline-offset-4"
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          role="img"
          aria-labelledby={`${titleId}${description ? ` ${descriptionId}` : ""}`}
          tabIndex={0}
          onPointerMove={(event) => {
            const rect = event.currentTarget.getBoundingClientRect()
            const x = ((event.clientX - rect.left) / rect.width) * width
            const index = Math.round(
              ((x - left) / Math.max(1, width - left - right)) * (data.length - 1),
            )

            setActiveIndex(Math.max(0, Math.min(data.length - 1, index)))
          }}
          onPointerLeave={() => setActiveIndex(null)}
        >
          <line x1={left} y1={centerY} x2={width - right} y2={centerY} stroke="var(--chart-grid)" strokeWidth="0.7" strokeDasharray="2 5" />
          {bands.map((band, index) => <path key={band.item.key} d={ribbonPath(band.bottom, band.top)} fill={band.color} stroke="var(--chart-bg)" strokeWidth="1.6" opacity={activeIndex === null ? 1 : 0.55} vectorEffect="non-scaling-stroke" />)}
          {bands.map((band, index) => {
            const widest = band.top.reduce((best, point, pointIndex) => point.y - band.bottom[pointIndex].y > band.top[best].y - band.bottom[best].y ? pointIndex : best, 0)
            const point = band.top[widest]
            const bottom = band.bottom[widest]
            return point.y - bottom.y < 15 ? null : <text key={band.item.key} x={point.x} y={(point.y + bottom.y) / 2 + 3} textAnchor="middle" fill={index > 1 ? "var(--chart-ink)" : "var(--chart-bg)"} fontSize="7.5" fontWeight="800" letterSpacing="0.06em">{band.item.label ?? band.item.key}</text>
          })}
          {[0, Math.floor((data.length - 1) / 2), Math.max(0, data.length - 1)].map((index) => <text key={index} x={xAt(index)} y={height - 18} textAnchor={index === 0 ? "start" : index === data.length - 1 ? "end" : "middle"} fill="var(--chart-muted)" fontSize="7.5" fontWeight="600" letterSpacing="0.08em">{labelFormatter(data[index]?.[xKey] as string | number, data[index])}</text>)}
          <text x={width / 2} y={height - 4} textAnchor="middle" fill="var(--chart-faint)" fontSize="7" fontWeight="600" letterSpacing="0.12em">BAND WIDTH = VALUE · THE RIVER SWELLS WITH THE TOTAL</text>
          {activeIndex !== null ? <line x1={xAt(activeIndex)} x2={xAt(activeIndex)} y1="18" y2={height - 28} stroke="var(--chart-ink)" strokeOpacity="0.28" strokeDasharray="2 4" /> : null}
        </svg>
        <ChartTooltip active={activeDatum !== null} x={activeIndex === null ? 0 : xAt(activeIndex)} y={18} width={width} label={activeDatum ? labelFormatter(activeDatum[xKey] as string | number, activeDatum) : ""} rows={activeDatum ? visibleSeries.map((item, index) => { const value = Math.max(0, getChartValue(activeDatum, item.key) ?? 0); return { key: item.key, label: item.label ?? item.key, value: normalize && totals[activeIndex!] > 0 ? `${Math.round((value / totals[activeIndex!]) * 100)}%` : valueFormatter(value, item, activeDatum), color: item.color ?? chartColors[index % chartColors.length] } }) : []} />
      </div>
      <ChartDataTable data={data} xKey={xKey} series={visibleSeries} />
    </ChartFrame>
  )
}

export { StackedAreaChart }
export type { ChartDatum, ChartLabelFormatter, ChartSeries, ChartValueFormatter }
