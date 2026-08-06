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
  getChartLayout,
  getChartValue,
  useChartSize,
  type ChartDatum,
  type ChartLabelFormatter,
  type ChartSeries,
  type ChartValueFormatter,
} from "./chart-core"

export interface StackedAreaChartProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "children" | "title"
> {
  /** 图表标题，用于说明总量及其组成。 */
  title: React.ReactNode
  /** 补充单位、时间范围或分母口径的副标题。 */
  description?: React.ReactNode
  /** 标题右侧的操作区。 */
  actions?: React.ReactNode
  /** 每行代表一个有序横轴节点的数据。 */
  data: ChartDatum[]
  /** 横轴标签字段。 */
  xKey: string
  /** 参与堆叠的数值序列。 */
  series: ChartSeries[]
  /** 是否把每个横轴节点归一化为百分比。 @default false */
  normalize?: boolean
  /** 图表绘图区高度，单位为像素。 @default 300 */
  height?: number
  /** 是否显示水平参考网格。 @default true */
  showGrid?: boolean
  /** 是否显示图例。 @default true */
  showLegend?: boolean
  /** 自定义原始数值的显示格式。 */
  valueFormatter?: ChartValueFormatter
  /** 自定义横轴标签。 */
  labelFormatter?: ChartLabelFormatter
}

/** 展示总量及其组成随有序轴变化的堆叠面积图。 */
function StackedAreaChart({
  title,
  description,
  actions,
  data,
  xKey,
  series,
  normalize = false,
  height = 300,
  showGrid = true,
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
  const layout = getChartLayout(width, height)
  const totals = data.map((datum) =>
    series.reduce(
      (sum, item) => sum + Math.max(0, getChartValue(datum, item.key) ?? 0),
      0
    )
  )
  const maximum = normalize ? 100 : Math.max(...totals)
  const cumulative = series.map((_, seriesIndex) =>
    data.map((datum, dataIndex) => {
      const total = totals[dataIndex]
      return series.slice(0, seriesIndex + 1).reduce((sum, item) => {
        const value = Math.max(0, getChartValue(datum, item.key) ?? 0)
        return sum + (normalize ? (value / total) * 100 : value)
      }, 0)
    })
  )
  const xAt = (index: number) =>
    layout.left + (index / (data.length - 1)) * layout.plotWidth
  const yAt = (value: number) =>
    layout.top + layout.plotHeight - (value / maximum) * layout.plotHeight
  const activeDatum = activeIndex == null ? null : data[activeIndex]
  const labelStep = Math.max(1, Math.ceil(data.length / (width < 480 ? 5 : 8)))

  function selectFromPointer(event: React.PointerEvent<SVGSVGElement>) {
    const rect = event.currentTarget.getBoundingClientRect()
    const pointerX = ((event.clientX - rect.left) / rect.width) * width
    const ratio = (pointerX - layout.left) / layout.plotWidth
    setActiveIndex(
      Math.max(
        0,
        Math.min(data.length - 1, Math.round(ratio * (data.length - 1)))
      )
    )
  }

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
            if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return
            event.preventDefault()
            const direction = event.key === "ArrowLeft" ? -1 : 1
            setActiveIndex((current) =>
              Math.max(
                0,
                Math.min(
                  data.length - 1,
                  (current ?? (direction > 0 ? -1 : data.length)) + direction
                )
              )
            )
          }}
        >
          {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
            const tick = maximum * ratio
            const y = yAt(tick)
            return (
              <g key={ratio}>
                {showGrid ? (
                  <line
                    x1={layout.left}
                    x2={width - layout.right}
                    y1={y}
                    y2={y}
                    stroke="var(--border)"
                    vectorEffect="non-scaling-stroke"
                  />
                ) : null}
                <text
                  x={layout.left - 9}
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
          {series.map((item, seriesIndex) => {
            const upper = cumulative[seriesIndex]
            const lower =
              seriesIndex === 0
                ? data.map(() => 0)
                : cumulative[seriesIndex - 1]
            const path = [
              ...upper.map((value, index) => ({
                x: xAt(index),
                y: yAt(value),
              })),
              ...lower
                .map((value, index) => ({ x: xAt(index), y: yAt(value) }))
                .reverse(),
            ]
              .map(
                (point, index) =>
                  `${index === 0 ? "M" : "L"}${point.x},${point.y}`
              )
              .join(" ")
            const color =
              item.color ?? chartColors[seriesIndex % chartColors.length]
            return (
              <path
                key={item.key}
                d={`${path} Z`}
                fill={color}
                fillOpacity="0.72"
                stroke={color}
                strokeWidth="1"
                vectorEffect="non-scaling-stroke"
              />
            )
          })}
          {data.map((datum, index) =>
            index % labelStep === 0 || index === data.length - 1 ? (
              <text
                key={index}
                x={xAt(index)}
                y={height - 9}
                textAnchor={
                  index === 0
                    ? "start"
                    : index === data.length - 1
                      ? "end"
                      : "middle"
                }
                fill="var(--muted-foreground)"
                fontSize="11"
              >
                {labelFormatter(datum[xKey] as string | number, datum)}
              </text>
            ) : null
          )}
          {activeIndex != null ? (
            <line
              x1={xAt(activeIndex)}
              x2={xAt(activeIndex)}
              y1={layout.top}
              y2={layout.top + layout.plotHeight}
              stroke="var(--foreground)"
              strokeOpacity="0.35"
              strokeDasharray="3 3"
              vectorEffect="non-scaling-stroke"
            />
          ) : null}
        </svg>
        <ChartTooltip
          active={activeDatum != null}
          x={activeIndex == null ? 0 : xAt(activeIndex)}
          y={layout.top}
          width={width}
          label={
            activeDatum
              ? labelFormatter(
                  activeDatum[xKey] as string | number,
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
                      ? `${Math.round((value / totals[activeIndex!]) * 100)}%`
                      : valueFormatter(value, item, activeDatum),
                    color:
                      item.color ?? chartColors[index % chartColors.length],
                  }
                })
              : []
          }
        />
      </div>
      <ChartDataTable data={data} xKey={xKey} series={series} />
    </div>
  )
}

export { StackedAreaChart }
export type {
  ChartDatum,
  ChartLabelFormatter,
  ChartSeries,
  ChartValueFormatter,
}
