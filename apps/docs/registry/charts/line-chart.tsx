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
  getChartScale,
  getChartValue,
  scaleValue,
  useChartSize,
  type ChartDatum,
  type ChartLabelFormatter,
  type ChartReferenceLine,
  type ChartSeries,
  type ChartValueFormatter,
  type ChartVariant,
} from "./chart-core"

export interface LineChartProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "children" | "title"> {
  /** 图表标题，用于说明正在展示的指标。 */
  title: React.ReactNode
  /** 补充单位、时间范围或筛选条件；日序列应说明一个点对应一天。 */
  description?: React.ReactNode
  /** 标题右侧的操作区。 */
  actions?: React.ReactNode
  /** Lieflat 色彩系统；有序单序列适合 porcelain。 @default "mono" */
  variant?: ChartVariant
  /** 模板来源行，例如“HAIRLINE LINE · DAILY · GROWTH”。 */
  source?: React.ReactNode
  /** 每行代表一个时间节点的数据。 */
  data: ChartDatum[]
  /** 用作横轴标签的数据字段。 */
  xKey: string
  /** 要绘制的数值序列；F2 最适合一至两条序列。 */
  series: ChartSeries[]
  /** 图表绘图区高度，单位为像素。 @default 280 */
  height?: number
  /** 手动指定纵轴最小值和最大值。 */
  domain?: [number, number]
  /** 保留以兼容旧调用；F2 不绘制常规网格。 */
  showGrid?: boolean
  /** 是否显示数据节点。 @default true */
  showDots?: boolean
  /** 是否在多序列时显示图例。 @default true */
  showLegend?: boolean
  /** 大于零时切换为 F3 Hairline Area（一天一根发丝）。 @default 0 */
  fillOpacity?: number
  /** 参考线配置，保留以兼容旧调用。 */
  referenceLines?: ChartReferenceLine[]
  /** 自定义纵轴刻度的显示格式，保留以兼容旧调用。 */
  yAxisFormatter?: (value: number) => React.ReactNode
  /** 自定义数值的显示格式。 */
  valueFormatter?: ChartValueFormatter
  /** 自定义横轴标签和提示框标题的显示格式。 */
  labelFormatter?: ChartLabelFormatter
}

/** F2/F3：日历地板 + 发丝趋势；面积由一根根日期线组成而非色块。 */
function LineChart({
  title,
  description,
  actions,
  variant = "mono",
  source,
  data,
  xKey,
  series,
  height = 280,
  domain,
  showGrid: _showGrid,
  showDots = true,
  showLegend = true,
  fillOpacity = 0,
  referenceLines: _referenceLines,
  yAxisFormatter: _yAxisFormatter,
  valueFormatter = (value) => defaultValueFormatter(value),
  labelFormatter = (value) => String(value),
  className,
  ...props
}: LineChartProps) {
  const id = React.useId()
  const titleId = `${id}-title`
  const descriptionId = `${id}-description`
  const { ref, width } = useChartSize()
  const [activeIndex, setActiveIndex] = React.useState<number | null>(null)
  const visibleSeries = series.slice(0, 2)
  const scale = getChartScale({ data, series: visibleSeries, domain })
  const left = 28
  const right = 28
  const baseline = height - 34
  const plotHeight = Math.max(86, baseline - 22)
  const plotWidth = Math.max(1, width - left - right)
  const xAt = (index: number) => data.length <= 1 ? width / 2 : left + (index / (data.length - 1)) * plotWidth
  const yAt = (value: number) => baseline - scaleValue(value, scale.min, scale.max, plotHeight)
  const activeDatum = activeIndex === null ? null : data[activeIndex]
  const labelIndexes = Array.from(new Set([0, Math.floor((data.length - 1) / 2), Math.max(0, data.length - 1)]))

  function selectFromPointer(event: React.PointerEvent<SVGSVGElement>) {
    const rect = event.currentTarget.getBoundingClientRect()
    const pointerX = ((event.clientX - rect.left) / rect.width) * width
    setActiveIndex(Math.max(0, Math.min(data.length - 1, Math.round(((pointerX - left) / plotWidth) * (data.length - 1)))) )
  }

  return (
    <ChartFrame variant={variant} source={source} className={cn(className)} {...props}>
      <ChartHeader title={title} description={description} actions={actions} titleId={titleId} descriptionId={descriptionId} />
      {visibleSeries.length > 1 && showLegend ? <ChartLegend series={visibleSeries} kind="line" /> : null}
      <div ref={ref} className="relative w-full">
        <svg className="focus-visible:outline-ring block w-full touch-pan-y overflow-visible outline-none focus-visible:outline-2 focus-visible:outline-offset-4" width={width} height={height} viewBox={`0 0 ${width} ${height}`} role="img" aria-labelledby={`${titleId}${description ? ` ${descriptionId}` : ""}`} tabIndex={0} onPointerMove={selectFromPointer} onPointerLeave={() => setActiveIndex(null)} onFocus={() => setActiveIndex((current) => current ?? 0)} onBlur={() => setActiveIndex(null)} onKeyDown={(event) => { if (event.key === "ArrowLeft" || event.key === "ArrowRight") { event.preventDefault(); setActiveIndex((current) => Math.max(0, Math.min(data.length - 1, (current ?? 0) + (event.key === "ArrowLeft" ? -1 : 1)))) } }}>
          <line x1={left - 6} y1={baseline} x2={width - right + 6} y2={baseline} stroke="var(--chart-grid)" strokeWidth="0.8" />
          {data.map((_, index) => <line key={index} x1={xAt(index)} x2={xAt(index)} y1={baseline} y2={baseline - (index % 7 === 5 || index % 7 === 6 ? 8 : 5)} stroke="var(--chart-faint)" strokeWidth="0.65" vectorEffect="non-scaling-stroke" />)}
          {visibleSeries.map((item, seriesIndex) => {
            const points = data.flatMap((datum, index) => {
              const value = getChartValue(datum, item.key)
              return value === null || value === undefined ? [] : [{ x: xAt(index), y: yAt(value), value, index }]
            })
            const peak = points.reduce((best, point) => point.value > best.value ? point : best, points[0])
            const color = item.color ?? chartColors[seriesIndex % chartColors.length]
            const path = points.map((point, index) => `${index === 0 ? "M" : "L"}${point.x} ${point.y}`).join(" ")
            return <g key={item.key}>
              {fillOpacity > 0 ? points.map((point) => <line key={point.index} x1={point.x} y1={baseline} x2={point.x} y2={point.y} stroke={color} strokeWidth={seriesIndex === 0 ? "0.65" : "0.45"} opacity={seriesIndex === 0 ? Math.min(0.9, Math.max(0.35, fillOpacity * 3)) : 0.38} vectorEffect="non-scaling-stroke" />) : null}
              <path d={path} fill="none" stroke={color} strokeWidth="1.15" strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
              {showDots ? points.map((point) => {
                const weekend = point.index % 7 === 5 || point.index % 7 === 6
                const isPeak = peak?.index === point.index
                return <g key={point.index}><circle cx={point.x} cy={point.y} r={isPeak || activeIndex === point.index ? "4.1" : "2.1"} fill={weekend ? "var(--chart-bg)" : color} stroke={color} strokeWidth={weekend ? "1" : "0"} vectorEffect="non-scaling-stroke" />{isPeak ? <text x={point.x} y={point.y - 10} textAnchor="middle" fill="var(--chart-ink)" fontSize="9.5" fontWeight="800" style={{ fontVariantNumeric: "tabular-nums" }}>{valueFormatter(point.value, item, data[point.index])}</text> : null}</g>
              }) : null}
            </g>
          })}
          {labelIndexes.map((index) => <text key={index} x={xAt(index)} y={baseline + 19} textAnchor={index === 0 ? "start" : index === data.length - 1 ? "end" : "middle"} fill="var(--chart-muted)" fontSize="7.5" fontWeight="600" letterSpacing="0.08em">{labelFormatter(data[index]?.[xKey] as string | number, data[index])}</text>)}
          <text x={width / 2} y={height - 4} textAnchor="middle" fill="var(--chart-faint)" fontSize="7" fontWeight="600" letterSpacing="0.12em">ONE DOT = ONE DATE · HOLLOW = WEEKEND · BARCODE KEEPS THE CALENDAR HONEST</text>
          {activeIndex !== null ? <line x1={xAt(activeIndex)} x2={xAt(activeIndex)} y1={22} y2={baseline} stroke="var(--chart-ink)" strokeOpacity="0.22" strokeDasharray="2 4" vectorEffect="non-scaling-stroke" /> : null}
        </svg>
        <ChartTooltip active={activeDatum !== null} x={activeIndex === null ? 0 : xAt(activeIndex)} y={22} width={width} label={activeDatum ? labelFormatter(activeDatum[xKey] as string | number, activeDatum) : ""} rows={activeDatum ? visibleSeries.flatMap((item, index) => { const value = getChartValue(activeDatum, item.key); return value === null || value === undefined ? [] : [{ key: item.key, label: item.label ?? item.key, value: valueFormatter(value, item, activeDatum), color: item.color ?? chartColors[index % chartColors.length] }] }) : []} />
      </div>
      <ChartDataTable data={data} xKey={xKey} series={visibleSeries} />
    </ChartFrame>
  )
}

export { LineChart }
export type { ChartDatum, ChartLabelFormatter, ChartReferenceLine, ChartSeries, ChartValueFormatter }
