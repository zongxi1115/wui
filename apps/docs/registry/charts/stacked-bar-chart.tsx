"use client"

import * as React from "react"

import { cn } from "@/registry/lib/utils"

import {
  ChartDataTable,
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
} from "./chart-core"

export interface StackedBarChartProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "children" | "title"
> {
  /** 图表标题，用于说明正在比较的总量或构成。 */
  title: React.ReactNode
  /** 补充单位、时间范围或分母口径的副标题。 */
  description?: React.ReactNode
  /** 标题右侧的操作区。 */
  actions?: React.ReactNode
  /** 每行代表一个分类的数据。 */
  data: ChartDatum[]
  /** 分类名称字段。 */
  categoryKey: string
  /** 参与堆叠的数值序列。 */
  series: ChartSeries[]
  /** 柱形方向。 @default "vertical" */
  layout?: "vertical" | "horizontal"
  /** 是否把每个分类归一化为百分比。 @default false */
  normalize?: boolean
  /** 图表绘图区高度，单位为像素。 @default 300 */
  height?: number
  /** 横向布局为分类标签保留的宽度。 @default 112 */
  labelWidth?: number
  /** 是否显示数值参考网格。 @default true */
  showGrid?: boolean
  /** 是否显示图例。 @default true */
  showLegend?: boolean
  /** 是否在足够宽的堆叠段内显示数值。 @default false */
  showValues?: boolean
  /** 自定义原始数值的显示格式。 */
  valueFormatter?: ChartValueFormatter
  /** 自定义分类标签。 */
  labelFormatter?: ChartLabelFormatter
  /** 点击某个堆叠段时触发。 */
  onValueSelect?: (
    datum: ChartDatum,
    series: ChartSeries,
    value: number
  ) => void
}

/** 展示分类总量构成，支持纵向、横向与百分比堆叠。 */
function StackedBarChart({
  title,
  description,
  actions,
  data,
  categoryKey,
  series,
  layout = "vertical",
  normalize = false,
  height = 300,
  labelWidth = 112,
  showGrid = true,
  showLegend = true,
  showValues = false,
  valueFormatter = (value) => defaultValueFormatter(value),
  labelFormatter = (value) => String(value),
  onValueSelect,
  className,
  ...props
}: StackedBarChartProps) {
  const id = React.useId()
  const titleId = `${id}-title`
  const descriptionId = `${id}-description`
  const { ref, width } = useChartSize()
  const [active, setActive] = React.useState<{
    dataIndex: number
    seriesIndex: number
  } | null>(null)
  const margins =
    layout === "horizontal"
      ? { top: 8, right: 20, bottom: 28, left: labelWidth }
      : { top: 8, right: 12, bottom: 34, left: 52 }
  const plotWidth = width - margins.left - margins.right
  const plotHeight = height - margins.top - margins.bottom
  const totals = data.map((datum) =>
    series.reduce(
      (sum, item) => sum + Math.max(0, getChartValue(datum, item.key) ?? 0),
      0
    )
  )
  const maximum = normalize ? 100 : Math.max(...totals)
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((ratio) => maximum * ratio)
  const activeDatum = active ? data[active.dataIndex] : null
  const activeSeries = active ? series[active.seriesIndex] : null

  return (
    <div className={cn("w-full", className)} {...props}>
      <ChartHeader
        title={title}
        description={description}
        actions={actions}
        titleId={titleId}
        descriptionId={descriptionId}
      />
      {showLegend ? <ChartLegend series={series} kind="bar" /> : null}
      <div ref={ref} className="relative w-full">
        <svg
          className="block w-full overflow-visible"
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          role="img"
          aria-labelledby={`${titleId}${description ? ` ${descriptionId}` : ""}`}
        >
          {ticks.map((tick) => {
            const ratio = tick / maximum
            const x = margins.left + ratio * plotWidth
            const y = margins.top + plotHeight - ratio * plotHeight
            return layout === "horizontal" ? (
              <g key={tick}>
                {showGrid ? (
                  <line
                    x1={x}
                    x2={x}
                    y1={margins.top}
                    y2={margins.top + plotHeight}
                    stroke="var(--border)"
                    vectorEffect="non-scaling-stroke"
                  />
                ) : null}
                <text
                  x={x}
                  y={height - 8}
                  textAnchor="middle"
                  fill="var(--muted-foreground)"
                  fontSize="11"
                  className="font-mono tabular-nums"
                >
                  {normalize
                    ? `${Math.round(tick)}%`
                    : defaultValueFormatter(tick)}
                </text>
              </g>
            ) : (
              <g key={tick}>
                {showGrid ? (
                  <line
                    x1={margins.left}
                    x2={width - margins.right}
                    y1={y}
                    y2={y}
                    stroke="var(--border)"
                    vectorEffect="non-scaling-stroke"
                  />
                ) : null}
                <text
                  x={margins.left - 9}
                  y={y}
                  dy="0.32em"
                  textAnchor="end"
                  fill="var(--muted-foreground)"
                  fontSize="11"
                  className="font-mono tabular-nums"
                >
                  {normalize
                    ? `${Math.round(tick)}%`
                    : defaultValueFormatter(tick)}
                </text>
              </g>
            )
          })}

          {data.map((datum, dataIndex) => {
            const total = totals[dataIndex]
            const band =
              (layout === "horizontal" ? plotHeight : plotWidth) / data.length
            const thickness = band * 0.58
            let offset = 0
            return (
              <g key={dataIndex}>
                {series.map((item, seriesIndex) => {
                  const value = Math.max(0, getChartValue(datum, item.key) ?? 0)
                  const plotted = normalize ? (value / total) * 100 : value
                  const start = offset
                  offset += plotted
                  const color =
                    item.color ?? chartColors[seriesIndex % chartColors.length]
                  const segmentSize =
                    (plotted / maximum) *
                    (layout === "horizontal" ? plotWidth : plotHeight)
                  const x =
                    layout === "horizontal"
                      ? margins.left + (start / maximum) * plotWidth
                      : margins.left + dataIndex * band + (band - thickness) / 2
                  const y =
                    layout === "horizontal"
                      ? margins.top + dataIndex * band + (band - thickness) / 2
                      : margins.top +
                        plotHeight -
                        (offset / maximum) * plotHeight
                  const segmentWidth =
                    layout === "horizontal" ? segmentSize : thickness
                  const segmentHeight =
                    layout === "horizontal" ? thickness : segmentSize
                  return (
                    <g key={item.key}>
                      <rect
                        x={x}
                        y={y}
                        width={segmentWidth}
                        height={segmentHeight}
                        fill={color}
                        opacity={
                          active &&
                          (active.dataIndex !== dataIndex ||
                            active.seriesIndex !== seriesIndex)
                            ? 0.56
                            : 1
                        }
                        tabIndex={0}
                        className={cn(
                          "focus-visible:stroke-foreground outline-none focus-visible:stroke-2",
                          onValueSelect && "cursor-pointer"
                        )}
                        onPointerEnter={() =>
                          setActive({ dataIndex, seriesIndex })
                        }
                        onPointerLeave={() => setActive(null)}
                        onFocus={() => setActive({ dataIndex, seriesIndex })}
                        onBlur={() => setActive(null)}
                        onClick={() => onValueSelect?.(datum, item, value)}
                      />
                      {showValues && segmentSize >= 34 ? (
                        <text
                          x={x + segmentWidth / 2}
                          y={y + segmentHeight / 2}
                          dy="0.32em"
                          textAnchor="middle"
                          fill="var(--primary-foreground)"
                          fontSize="10"
                          className="font-mono tabular-nums"
                          pointerEvents="none"
                        >
                          {normalize
                            ? `${Math.round((value / total) * 100)}%`
                            : valueFormatter(value, item, datum)}
                        </text>
                      ) : null}
                    </g>
                  )
                })}
                <text
                  x={
                    layout === "horizontal"
                      ? margins.left - 10
                      : margins.left + dataIndex * band + band / 2
                  }
                  y={
                    layout === "horizontal"
                      ? margins.top + dataIndex * band + band / 2
                      : height - 9
                  }
                  dy={layout === "horizontal" ? "0.32em" : undefined}
                  textAnchor={layout === "horizontal" ? "end" : "middle"}
                  fill="var(--muted-foreground)"
                  fontSize="11"
                >
                  {labelFormatter(datum[categoryKey] as string | number, datum)}
                </text>
              </g>
            )
          })}
        </svg>
        <ChartTooltip
          active={activeDatum != null && activeSeries != null}
          x={
            active
              ? layout === "horizontal"
                ? margins.left + plotWidth / 2
                : margins.left +
                  ((active.dataIndex + 0.5) / data.length) * plotWidth
              : 0
          }
          y={
            active
              ? margins.top + (active.dataIndex / data.length) * plotHeight
              : 0
          }
          width={width}
          label={
            activeDatum
              ? labelFormatter(
                  activeDatum[categoryKey] as string | number,
                  activeDatum
                )
              : ""
          }
          rows={
            activeDatum
              ? series.map((item, index) => {
                  const value = getChartValue(activeDatum, item.key) ?? 0
                  return {
                    key: item.key,
                    label: item.label ?? item.key,
                    value: normalize
                      ? `${Math.round((value / totals[active!.dataIndex]) * 100)}%`
                      : valueFormatter(value, item, activeDatum),
                    color:
                      item.color ?? chartColors[index % chartColors.length],
                  }
                })
              : []
          }
        />
      </div>
      <ChartDataTable data={data} xKey={categoryKey} series={series} />
    </div>
  )
}

export { StackedBarChart }
export type {
  ChartDatum,
  ChartLabelFormatter,
  ChartSeries,
  ChartValueFormatter,
}
