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
  getChartScale,
  getChartValue,
  linePatterns,
  scaleValue,
  useChartSize,
  type ChartDatum,
  type ChartSeries,
  type ChartValueFormatter,
} from "./chart-core"

export interface TimeSeriesChartProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "children" | "title"
> {
  /** 图表标题，用于说明时间趋势指标。 */
  title: React.ReactNode
  /** 补充单位、日期范围或筛选口径的副标题。 */
  description?: React.ReactNode
  /** 标题右侧的操作区。 */
  actions?: React.ReactNode
  /** 每行代表一个时间观测点的数据。 */
  data: ChartDatum[]
  /** ISO 日期、时间戳或可解析日期字段。 */
  timeKey: string
  /** 要绘制的数值序列。 */
  series: ChartSeries[]
  /** 纵轴尺度。 @default "linear" */
  scale?: "linear" | "log"
  /** 图表绘图区高度，单位为像素。 @default 300 */
  height?: number
  /** 手动指定纵轴范围；对数轴必须为正数。 */
  domain?: [number, number]
  /** 是否显示水平参考网格。 @default true */
  showGrid?: boolean
  /** 是否显示数据节点。 @default false */
  showDots?: boolean
  /** 是否显示图例。 @default true */
  showLegend?: boolean
  /** 自定义日期值到时间戳的转换。 */
  dateParser?: (value: string | number, datum: ChartDatum) => number
  /** 自定义横轴日期格式。 */
  dateFormatter?: (timestamp: number, datum?: ChartDatum) => React.ReactNode
  /** 自定义数值格式。 */
  valueFormatter?: ChartValueFormatter
  /** 完全替换默认图例内容。 */
  renderLegend?: (series: ChartSeries[]) => React.ReactNode
  /** 完全替换当前数据点的默认提示内容。 */
  renderTooltip?: (datum: ChartDatum, index: number) => React.ReactNode
}

/** 按真实时间间隔绘制趋势，并支持线性与对数纵轴。 */
function TimeSeriesChart({
  title,
  description,
  actions,
  data,
  timeKey,
  series,
  scale = "linear",
  height = 300,
  domain,
  showGrid = true,
  showDots = false,
  showLegend = true,
  dateParser = (value) =>
    typeof value === "number" ? value : new Date(value).getTime(),
  dateFormatter = (timestamp) =>
    new Intl.DateTimeFormat("zh-CN", {
      month: "short",
      day: "numeric",
    }).format(timestamp),
  valueFormatter = (value) => defaultValueFormatter(value),
  renderLegend,
  renderTooltip,
  className,
  ...props
}: TimeSeriesChartProps) {
  const id = React.useId()
  const titleId = `${id}-title`
  const descriptionId = `${id}-description`
  const { ref, width } = useChartSize()
  const [activeIndex, setActiveIndex] = React.useState<number | null>(null)
  const layout = getChartLayout(width, height)
  const timestamps = data.map((datum) =>
    dateParser(datum[timeKey] as string | number, datum)
  )
  const minTime = Math.min(...timestamps)
  const maxTime = Math.max(...timestamps)
  const linearScale = getChartScale({ data, series, domain })
  const positiveValues = data.flatMap((datum) =>
    series.flatMap((item) => {
      const value = getChartValue(datum, item.key)
      return value != null && value > 0 ? [value] : []
    })
  )
  const logMin = domain?.[0] ?? Math.min(...positiveValues)
  const logMax = domain?.[1] ?? Math.max(...positiveValues)
  const yMin = scale === "log" ? logMin : linearScale.min
  const yMax = scale === "log" ? logMax : linearScale.max
  const yTicks =
    scale === "log"
      ? Array.from(
          {
            length:
              Math.floor(Math.log10(yMax)) - Math.ceil(Math.log10(yMin)) + 1,
          },
          (_, index) => 10 ** (Math.ceil(Math.log10(yMin)) + index)
        )
      : linearScale.ticks
  const xAt = (timestamp: number) =>
    layout.left + scaleValue(timestamp, minTime, maxTime, layout.plotWidth)
  const yAt = (value: number) => {
    const ratio =
      scale === "log"
        ? (Math.log10(value) - Math.log10(yMin)) /
          (Math.log10(yMax) - Math.log10(yMin))
        : (value - yMin) / (yMax - yMin)
    return layout.top + layout.plotHeight - ratio * layout.plotHeight
  }
  const activeDatum = activeIndex == null ? null : data[activeIndex]
  const labelStep = Math.max(1, Math.ceil(data.length / (width < 480 ? 4 : 7)))

  function selectFromPointer(event: React.PointerEvent<SVGSVGElement>) {
    const rect = event.currentTarget.getBoundingClientRect()
    const pointerX = ((event.clientX - rect.left) / rect.width) * width
    let nearest = 0
    let distance = Number.POSITIVE_INFINITY
    timestamps.forEach((timestamp, index) => {
      const nextDistance = Math.abs(xAt(timestamp) - pointerX)
      if (nextDistance < distance) {
        distance = nextDistance
        nearest = index
      }
    })
    setActiveIndex(nearest)
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
      {showLegend
        ? (renderLegend?.(series) ?? (
            <ChartLegend series={series} kind="line" />
          ))
        : null}
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
          {yTicks.map((tick) => {
            const y = yAt(tick)
            return (
              <g key={tick}>
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
                  {defaultValueFormatter(tick)}
                </text>
              </g>
            )
          })}
          {data.map((datum, index) =>
            index % labelStep === 0 || index === data.length - 1 ? (
              <text
                key={index}
                x={xAt(timestamps[index])}
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
                {dateFormatter(timestamps[index], datum)}
              </text>
            ) : null
          )}
          {series.map((item, seriesIndex) => {
            const color =
              item.color ?? chartColors[seriesIndex % chartColors.length]
            const points = data.flatMap((datum, index) => {
              const value = getChartValue(datum, item.key)
              return value == null || (scale === "log" && value <= 0)
                ? []
                : [{ x: xAt(timestamps[index]), y: yAt(value), value, index }]
            })
            const path = points
              .map(
                (point, index) =>
                  `${index === 0 ? "M" : "L"}${point.x},${point.y}`
              )
              .join(" ")
            return (
              <g key={item.key}>
                <path
                  d={path}
                  fill="none"
                  stroke={color}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray={
                    item.strokeDasharray ??
                    linePatterns[seriesIndex % linePatterns.length]
                  }
                  vectorEffect="non-scaling-stroke"
                />
                {showDots
                  ? points.map((point) => (
                      <circle
                        key={point.index}
                        cx={point.x}
                        cy={point.y}
                        r={activeIndex === point.index ? 4 : 2.5}
                        fill="var(--background)"
                        stroke={color}
                        strokeWidth="2"
                      />
                    ))
                  : null}
              </g>
            )
          })}
          {activeIndex != null ? (
            <line
              x1={xAt(timestamps[activeIndex])}
              x2={xAt(timestamps[activeIndex])}
              y1={layout.top}
              y2={layout.top + layout.plotHeight}
              stroke="var(--foreground)"
              strokeOpacity="0.35"
              strokeDasharray="3 3"
            />
          ) : null}
        </svg>
        {activeDatum && renderTooltip ? (
          <div
            className="absolute z-10"
            style={{
              left: xAt(timestamps[activeIndex!]) + 10,
              top: layout.top,
            }}
          >
            {renderTooltip(activeDatum, activeIndex!)}
          </div>
        ) : (
          <ChartTooltip
            active={activeDatum != null}
            x={activeIndex == null ? 0 : xAt(timestamps[activeIndex])}
            y={layout.top}
            width={width}
            label={
              activeIndex == null
                ? ""
                : dateFormatter(
                    timestamps[activeIndex],
                    activeDatum ?? undefined
                  )
            }
            rows={
              activeDatum
                ? series.flatMap((item, index) => {
                    const value = getChartValue(activeDatum, item.key)
                    return value == null
                      ? []
                      : [
                          {
                            key: item.key,
                            label: item.label ?? item.key,
                            value: valueFormatter(value, item, activeDatum),
                            color:
                              item.color ??
                              chartColors[index % chartColors.length],
                          },
                        ]
                  })
                : []
            }
          />
        )}
      </div>
      <ChartDataTable data={data} xKey={timeKey} series={series} />
    </div>
  )
}

export { TimeSeriesChart }
export type { ChartDatum, ChartSeries, ChartValueFormatter }
