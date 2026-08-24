"use client"

import * as React from "react"

import { cn } from "@/registry/lib/utils"

import {
  ChartDataTable,
  ChartFrame,
  ChartHeader,
  ChartLegend,
  ChartTooltip,
  defaultValueFormatter,
  getChartValue,
  useChartSize,
  type ChartDatum,
  type ChartLabelFormatter,
  type ChartSeries,
  type ChartValueFormatter,
  type ChartVariant,
} from "./chart-core"

export interface StackedBarChartProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "children" | "title"> {
  /** 图表标题，用于说明正在比较的总量或构成。 */
  title: React.ReactNode
  /** 补充单位、时间范围或分母口径；应说明一梯级代表多少单位。 */
  description?: React.ReactNode
  /** 标题右侧的操作区。 */
  actions?: React.ReactNode
  /** Lieflat 色彩系统；并列构成且不超过四类时可用 palm。 @default "mono" */
  variant?: ChartVariant
  /** 模板来源行，例如“STACKED RUNGS · REVENUE MIX · BILLING”。 */
  source?: React.ReactNode
  /** 每行代表一个分类的数据。 */
  data: ChartDatum[]
  /** 分类名称字段。 */
  categoryKey: string
  /** 参与堆叠的数值序列，F7 最多四段。 */
  series: ChartSeries[]
  /** F7 为纵向梯级堆叠；该属性仅为兼容旧调用保留。 */
  layout?: "vertical" | "horizontal"
  /** 是否把每个分类归一化为百分比。 @default false */
  normalize?: boolean
  /** 图表绘图区高度，单位为像素。 @default 300 */
  height?: number
  /** 保留以兼容旧调用。 */
  labelWidth?: number
  /** 保留以兼容旧调用。 */
  showGrid?: boolean
  /** 是否显示图例。 @default true */
  showLegend?: boolean
  /** 是否在每段旁显示数值。 @default false */
  showValues?: boolean
  /** 每一横档代表的真实数值；省略时按数据自动取易读单位。 */
  rungStep?: number
  /** 自定义原始数值的显示格式。 */
  valueFormatter?: ChartValueFormatter
  /** 自定义分类标签。 */
  labelFormatter?: ChartLabelFormatter
  /** 点击某个堆叠段时触发。 */
  onValueSelect?: (datum: ChartDatum, series: ChartSeries, value: number) => void
}

const rungShades = ["var(--chart-ink)", "var(--chart-muted)", "var(--chart-faint)", "var(--chart-grid)"]

function niceStep(maximum: number) {
  if (maximum <= 0) return 1
  const raw = maximum / 31
  const exponent = 10 ** Math.floor(Math.log10(raw))
  const fraction = raw / exponent
  return (fraction <= 1 ? 1 : fraction <= 2 ? 2 : fraction <= 5 ? 5 : 10) * exponent
}

function variation(index: number, seed: number) {
  return Math.abs(((index * 73856093) ^ (seed * 19349663)) % 1000) / 1000
}

/** F7 Stacked Rungs：每段由可数横档组成，段间留出一档呼吸。 */
function StackedBarChart({
  title,
  description,
  actions,
  variant = "mono",
  source,
  data,
  categoryKey,
  series,
  layout: _layout,
  normalize = false,
  height = 300,
  labelWidth: _labelWidth,
  showGrid: _showGrid,
  showLegend = true,
  showValues = false,
  rungStep,
  valueFormatter = (value) => defaultValueFormatter(value),
  labelFormatter = (label) => String(label),
  onValueSelect,
  className,
  ...props
}: StackedBarChartProps) {
  const id = React.useId()
  const titleId = `${id}-title`
  const descriptionId = `${id}-description`
  const { ref, width } = useChartSize()
  const [active, setActive] = React.useState<{ dataIndex: number; seriesIndex: number } | null>(null)
  const visibleSeries = series.slice(0, 4)
  const totals = data.map((datum) => visibleSeries.reduce((sum, item) => sum + Math.max(0, getChartValue(datum, item.key) ?? 0), 0))
  const maximum = normalize ? 100 : Math.max(0, ...totals)
  const step = rungStep && rungStep > 0 ? rungStep : niceStep(maximum)
  const baseline = height - 35
  const plotHeight = Math.max(92, baseline - 24)
  const rungHeight = Math.min(5.2, Math.max(2.5, plotHeight / Math.max(1, Math.ceil(maximum / step) + visibleSeries.length)))
  const groupWidth = (width - 54) / Math.max(1, data.length)
  const activeDatum = active ? data[active.dataIndex] : null

  return (
    <ChartFrame variant={variant} source={source} className={cn(className)} {...props}>
      <ChartHeader title={title} description={description} actions={actions} titleId={titleId} descriptionId={descriptionId} />
      {showLegend ? <ChartLegend series={visibleSeries} kind="bar" /> : null}
      <div ref={ref} className="relative w-full">
        <svg className="block w-full overflow-visible" width={width} height={height} viewBox={`0 0 ${width} ${height}`} role="img" aria-labelledby={`${titleId}${description ? ` ${descriptionId}` : ""}`}>
          <line x1="30" y1={baseline + 4} x2={width - 18} y2={baseline + 4} stroke="var(--chart-grid)" strokeWidth="0.8" />
          {data.map((datum, dataIndex) => {
            const center = 30 + dataIndex * groupWidth + groupWidth / 2
            const halfWidth = Math.min(15, groupWidth * 0.23)
            const total = totals[dataIndex]
            let rungOffset = 0
            return (
              <g key={dataIndex} opacity={active && active.dataIndex !== dataIndex ? 0.42 : 1}>
                {visibleSeries.map((item, seriesIndex) => {
                  const rawValue = Math.max(0, getChartValue(datum, item.key) ?? 0)
                  const plottedValue = normalize && total > 0 ? (rawValue / total) * 100 : rawValue
                  const rungs = Math.round(plottedValue / step)
                  const start = rungOffset
                  rungOffset += rungs + (rungs > 0 ? 1 : 0)
                  const color = item.color ?? rungShades[seriesIndex]
                  const segmentTop = baseline - Math.max(0, start + rungs - 1) * rungHeight
                  return (
                    <g key={item.key} tabIndex={0} className={cn("outline-none", onValueSelect && "cursor-pointer")} onPointerEnter={() => setActive({ dataIndex, seriesIndex })} onPointerLeave={() => setActive(null)} onFocus={() => setActive({ dataIndex, seriesIndex })} onBlur={() => setActive(null)} onClick={() => onValueSelect?.(datum, item, rawValue)}>
                      {Array.from({ length: rungs }, (_, rungIndex) => {
                        const y = baseline - (start + rungIndex) * rungHeight
                        const widthJitter = halfWidth - 1.4 + variation(rungIndex + 1, dataIndex * 9 + seriesIndex + 2) * 2.8
                        return <line key={rungIndex} x1={center - widthJitter} y1={y} x2={center + widthJitter} y2={y} stroke={color} strokeWidth="1" opacity={0.6 + variation(rungIndex + 2, dataIndex * 11 + seriesIndex + 5) * 0.4} vectorEffect="non-scaling-stroke" />
                      })}
                      {showValues && rungs >= 3 ? <text x={center + halfWidth + 7} y={segmentTop + Math.max(0, (rungs * rungHeight) / 2)} dy="0.32em" fill={color} fontSize="8" fontWeight="800" style={{ fontVariantNumeric: "tabular-nums" }}>{normalize ? `${Math.round(plottedValue)}%` : valueFormatter(rawValue, item, datum)}</text> : null}
                    </g>
                  )
                })}
                <text x={center} y={baseline + 20} textAnchor="middle" fill="var(--chart-muted)" fontSize="7.5" fontWeight="700" letterSpacing="0.08em">
                  {labelFormatter(datum[categoryKey] as string | number, datum)}
                </text>
              </g>
            )
          })}
          <text x={width / 2} y={height - 4} textAnchor="middle" fill="var(--chart-faint)" fontSize="7" fontWeight="600" letterSpacing="0.12em">
            ONE RUNG = {normalize ? `${defaultValueFormatter(step)}%` : defaultValueFormatter(step)} · PALE GAPS SEPARATE SEGMENTS
          </text>
        </svg>
        <ChartTooltip active={activeDatum !== null && active !== null} x={active ? 30 + active.dataIndex * groupWidth + groupWidth / 2 : 0} y={24} width={width} label={activeDatum ? labelFormatter(activeDatum[categoryKey] as string | number, activeDatum) : ""} rows={activeDatum ? visibleSeries.map((item, index) => {
          const value = Math.max(0, getChartValue(activeDatum, item.key) ?? 0)
          return { key: item.key, label: item.label ?? item.key, value: normalize && totals[active!.dataIndex] > 0 ? `${Math.round((value / totals[active!.dataIndex]) * 100)}%` : valueFormatter(value, item, activeDatum), color: item.color ?? rungShades[index] }
        }) : []} />
      </div>
      <ChartDataTable data={data} xKey={categoryKey} series={visibleSeries} />
    </ChartFrame>
  )
}

export { StackedBarChart }
export type { ChartDatum, ChartLabelFormatter, ChartSeries, ChartValueFormatter }
