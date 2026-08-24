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
  type ChartReferenceLine,
  type ChartSeries,
  type ChartValueFormatter,
  type ChartVariant,
} from "./chart-core"

export interface BarChartProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "children" | "title"> {
  /** 图表标题，用于说明正在比较的指标。 */
  title: React.ReactNode
  /** 补充单位、时间范围或筛选条件的副标题；应说明每一梯级的单位。 */
  description?: React.ReactNode
  /** 标题右侧的操作区。 */
  actions?: React.ReactNode
  /** Lieflat 色彩系统。类目超过 6 个时建议使用 mono。 @default "mono" */
  variant?: ChartVariant
  /** 模板来源行，例如“PAIRED RUNGS · MRR · BILLING”。 */
  source?: React.ReactNode
  /** 每行代表一个横轴分类的数据。 */
  data: ChartDatum[]
  /** 用作横轴分类标签的数据字段。 */
  xKey: string
  /** 要比较的数值序列；一组使用 F1，两组使用 F6。 */
  series: ChartSeries[]
  /** 图表绘图区高度，单位为像素。 @default 280 */
  height?: number
  /** 每一横档代表的真实数值；省略时按数据自动取易读单位。 */
  rungStep?: number
  /** 手动指定纵轴最小值和最大值。保留以兼容旧调用。 */
  domain?: [number, number]
  /** 是否显示水平参考网格。保留以兼容旧调用。 */
  showGrid?: boolean
  /** 是否在梯级顶部显示精确数值。 @default true */
  showValues?: boolean
  /** 是否在两组数据时显示图例。 @default true */
  showLegend?: boolean
  /** 柱形之间的间距比例。保留以兼容旧调用。 */
  gap?: number
  /** 柱形圆角。保留以兼容旧调用。 */
  radius?: number
  /** 目标值、均值或阈值等参考线。保留以兼容旧调用。 */
  referenceLines?: ChartReferenceLine[]
  /** 自定义纵轴刻度的显示格式。保留以兼容旧调用。 */
  yAxisFormatter?: (value: number) => React.ReactNode
  /** 自定义数值的显示格式。 */
  valueFormatter?: ChartValueFormatter
  /** 自定义横轴标签和提示框标题的显示格式。 */
  labelFormatter?: ChartLabelFormatter
}

function niceStep(maximum: number) {
  if (maximum <= 0) return 1
  const raw = maximum / 34
  const exponent = 10 ** Math.floor(Math.log10(raw))
  const fraction = raw / exponent
  const base = fraction <= 1 ? 1 : fraction <= 2 ? 2 : fraction <= 5 ? 5 : 10
  return base * exponent
}

function variation(index: number, seed: number) {
  return Math.abs(((index * 73856093) ^ (seed * 19349663)) % 1000) / 1000
}

/** F1/F6 Rung Bars：一个横档是一份可数、可说明的真实单位。 */
function BarChart({
  title,
  description,
  actions,
  variant = "mono",
  source,
  data,
  xKey,
  series,
  height = 280,
  rungStep,
  domain: _domain,
  showGrid: _showGrid,
  showValues = true,
  showLegend = true,
  gap: _gap,
  radius: _radius,
  referenceLines: _referenceLines,
  yAxisFormatter: _yAxisFormatter,
  valueFormatter = (value) => defaultValueFormatter(value),
  labelFormatter = (label) => String(label),
  className,
  ...props
}: BarChartProps) {
  const id = React.useId()
  const titleId = `${id}-title`
  const descriptionId = `${id}-description`
  const { ref, width } = useChartSize()
  const [activeIndex, setActiveIndex] = React.useState<number | null>(null)
  const supportedSeries = series.slice(0, 2)
  const maximum = Math.max(0, ...data.flatMap((datum) => supportedSeries.map((item) => getChartValue(datum, item.key) ?? 0)))
  const step = rungStep && rungStep > 0 ? rungStep : niceStep(maximum)
  const paired = supportedSeries.length === 2
  const left = 28
  const right = 22
  const baseline = height - 35
  const plotHeight = Math.max(88, baseline - 24)
  const rungHeight = Math.min(5.6, Math.max(2.6, plotHeight / Math.max(1, Math.ceil(maximum / step))))
  const groupWidth = (width - left - right) / Math.max(1, data.length)
  const activeDatum = activeIndex === null ? null : data[activeIndex]

  function selectFromPointer(event: React.PointerEvent<SVGSVGElement>) {
    const rect = event.currentTarget.getBoundingClientRect()
    const pointerX = ((event.clientX - rect.left) / rect.width) * width
    setActiveIndex(Math.max(0, Math.min(data.length - 1, Math.floor((pointerX - left) / groupWidth))))
  }

  return (
    <ChartFrame variant={variant} source={source} className={cn(className)} {...props}>
      <ChartHeader title={title} description={description} actions={actions} titleId={titleId} descriptionId={descriptionId} />
      {paired && showLegend ? <ChartLegend series={supportedSeries} kind="bar" /> : null}
      <div ref={ref} className="relative w-full">
        <svg
          className="focus-visible:outline-ring block w-full touch-pan-y overflow-visible outline-none focus-visible:outline-2 focus-visible:outline-offset-4"
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          role="img"
          aria-labelledby={`${titleId}${description ? ` ${descriptionId}` : ""}`}
          tabIndex={0}
          onPointerMove={selectFromPointer}
          onPointerLeave={() => setActiveIndex(null)}
          onFocus={() => setActiveIndex((current) => current ?? 0)}
          onBlur={() => setActiveIndex(null)}
          onKeyDown={(event) => {
            if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
              event.preventDefault()
              setActiveIndex((current) => Math.max(0, Math.min(data.length - 1, (current ?? 0) + (event.key === "ArrowLeft" ? -1 : 1))))
            }
          }}
        >
          <line x1={left - 5} y1={baseline + 4} x2={width - right + 5} y2={baseline + 4} stroke="var(--chart-grid)" strokeWidth="0.8" />
          {data.map((datum, dataIndex) => {
            const center = left + dataIndex * groupWidth + groupWidth / 2
            const positions = paired ? [center - Math.min(13, groupWidth * 0.18), center + Math.min(13, groupWidth * 0.18)] : [center]
            return (
              <g key={dataIndex} opacity={activeIndex === null || activeIndex === dataIndex ? 1 : 0.42}>
                {supportedSeries.map((item, seriesIndex) => {
                  const value = Math.max(0, getChartValue(datum, item.key) ?? 0)
                  const count = Math.round(value / step)
                  const x = positions[seriesIndex]
                  const halfWidth = paired ? Math.min(10, groupWidth * 0.14) : Math.min(18, groupWidth * 0.26)
                  const color = item.color ?? (seriesIndex === 0 && paired ? "var(--chart-faint)" : chartColors[seriesIndex % chartColors.length])
                  return (
                    <g key={item.key}>
                      {Array.from({ length: count }, (_, rungIndex) => {
                        const y = baseline - rungIndex * rungHeight
                        const widthJitter = halfWidth - 1.5 + variation(rungIndex + 1, dataIndex * 5 + seriesIndex + 2) * 3
                        return <line key={rungIndex} x1={x - widthJitter} y1={y} x2={x + widthJitter} y2={y} stroke={color} strokeWidth="1" opacity={0.56 + variation(rungIndex + 2, dataIndex * 7 + seriesIndex + 4) * 0.44} vectorEffect="non-scaling-stroke" />
                      })}
                      {showValues ? <text x={x} y={baseline - Math.max(0, count - 1) * rungHeight - 9} textAnchor="middle" fill={seriesIndex === 0 && paired ? "var(--chart-muted)" : "var(--chart-ink)"} fontSize={seriesIndex === 0 && paired ? "8.5" : "10.5"} fontWeight={seriesIndex === 0 && paired ? "700" : "800"} style={{ fontVariantNumeric: "tabular-nums" }}>{valueFormatter(value, item, datum)}</text> : null}
                    </g>
                  )
                })}
                <text x={center} y={baseline + 20} textAnchor="middle" fill="var(--chart-muted)" fontSize="7.5" fontWeight="700" letterSpacing="0.08em">
                  {labelFormatter(datum[xKey] as string | number, datum)}
                </text>
              </g>
            )
          })}
          <text x={width / 2} y={height - 4} textAnchor="middle" fill="var(--chart-faint)" fontSize="7" fontWeight="600" letterSpacing="0.12em">
            {paired ? "FAINT = FIRST SERIES · INK = SECOND SERIES" : "ONE RUNG = ONE UNIT"} · 1 RUNG = {defaultValueFormatter(step)}
          </text>
        </svg>
        <ChartTooltip
          active={activeDatum !== null}
          x={activeIndex === null ? 0 : left + activeIndex * groupWidth + groupWidth / 2}
          y={24}
          width={width}
          label={activeDatum ? labelFormatter(activeDatum[xKey] as string | number, activeDatum) : ""}
          rows={activeDatum ? supportedSeries.flatMap((item, index) => {
            const value = getChartValue(activeDatum, item.key)
            return value === null || value === undefined ? [] : [{ key: item.key, label: item.label ?? item.key, value: valueFormatter(value, item, activeDatum), color: item.color ?? chartColors[index % chartColors.length] }]
          }) : []}
        />
      </div>
      <ChartDataTable data={data} xKey={xKey} series={supportedSeries} />
    </ChartFrame>
  )
}

export { BarChart }
export type { ChartDatum, ChartLabelFormatter, ChartReferenceLine, ChartSeries, ChartValueFormatter }
