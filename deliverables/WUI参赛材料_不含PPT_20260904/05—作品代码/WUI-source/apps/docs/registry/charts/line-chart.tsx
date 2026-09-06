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
  type ChartLabelFormatter,
  type ChartReferenceLine,
  type ChartSeries,
  type ChartValueFormatter,
} from "./chart-core"

export interface LineChartProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "children" | "title"
> {
  /** 图表标题，用于说明正在展示的指标。 */
  title: React.ReactNode
  /** 补充单位、时间范围或筛选条件的副标题。 */
  description?: React.ReactNode
  /** 标题右侧的操作区，适合组合 Button、Select 或业务工具栏。 */
  actions?: React.ReactNode
  /** 每行代表一个横轴节点的数据。 */
  data: ChartDatum[]
  /** 用作横轴标签的数据字段。 */
  xKey: string
  /** 要绘制的数值序列。 */
  series: ChartSeries[]
  /** 图表绘图区高度，单位为像素。 @default 280 */
  height?: number
  /** 手动指定纵轴最小值和最大值。 */
  domain?: [number, number]
  /** 是否显示水平参考网格。 @default true */
  showGrid?: boolean
  /** 是否显示数据节点。 @default true */
  showDots?: boolean
  /** 是否在多序列时显示图例。 @default true */
  showLegend?: boolean
  /** 面积填充的不透明度；大于零时绘制为面积趋势。 @default 0 */
  fillOpacity?: number
  /** 目标值、均值或阈值等纵轴参考线。 */
  referenceLines?: ChartReferenceLine[]
  /** 自定义纵轴刻度的显示格式。 */
  yAxisFormatter?: (value: number) => React.ReactNode
  /** 自定义数值的显示格式。 */
  valueFormatter?: ChartValueFormatter
  /** 自定义横轴标签和提示框标题的显示格式。 */
  labelFormatter?: ChartLabelFormatter
}

/** 展示有序数据趋势并支持多序列比较的折线图。 */
function LineChart({
  title,
  description,
  actions,
  data,
  xKey,
  series,
  height = 280,
  domain,
  showGrid = true,
  showDots = true,
  showLegend = true,
  fillOpacity = 0,
  referenceLines = [],
  yAxisFormatter = defaultValueFormatter,
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
  const layout = getChartLayout(width, height)
  const scale = getChartScale({ data, series, domain })
  const xAt = (index: number) =>
    layout.left + (index / (data.length - 1)) * layout.plotWidth
  const yAt = (value: number) =>
    layout.top +
    layout.plotHeight -
    scaleValue(value, scale.min, scale.max, layout.plotHeight)
  const activeDatum = activeIndex == null ? null : data[activeIndex]

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

  function moveActive(direction: -1 | 1) {
    setActiveIndex((current) =>
      Math.max(
        0,
        Math.min(
          data.length - 1,
          (current ?? (direction > 0 ? -1 : data.length)) + direction
        )
      )
    )
  }

  const labelStep = Math.max(1, Math.ceil(data.length / (width < 480 ? 5 : 8)))

  return (
    <div className={cn("w-full", className)} {...props}>
      <ChartHeader
        title={title}
        description={description}
        actions={actions}
        titleId={titleId}
        descriptionId={descriptionId}
      />
      {showLegend ? <ChartLegend series={series} kind="line" /> : null}
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
            if (event.key === "ArrowLeft") {
              event.preventDefault()
              moveActive(-1)
            }
            if (event.key === "ArrowRight") {
              event.preventDefault()
              moveActive(1)
            }
          }}
        >
          {scale.ticks.map((tick) => {
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
                    strokeWidth="1"
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
                  {yAxisFormatter(tick)}
                </text>
              </g>
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

          {series.map((item, seriesIndex) => {
            const segments: Array<Array<{ x: number; y: number }>> = []
            let segment: Array<{ x: number; y: number }> = []
            data.forEach((datum, index) => {
              const value = getChartValue(datum, item.key)
              if (value == null) {
                if (segment.length) segments.push(segment)
                segment = []
                return
              }
              segment.push({ x: xAt(index), y: yAt(value) })
            })
            if (segment.length) segments.push(segment)
            const path = segments
              .map((points) =>
                points
                  .map(
                    (point, index) =>
                      `${index === 0 ? "M" : "L"}${point.x},${point.y}`
                  )
                  .join(" ")
              )
              .join(" ")
            const color =
              item.color ?? chartColors[seriesIndex % chartColors.length]
            const dash =
              item.strokeDasharray ??
              linePatterns[seriesIndex % linePatterns.length]

            return (
              <g key={item.key}>
                {fillOpacity > 0
                  ? segments.map((points, segmentIndex) => {
                      const baseline =
                        scale.min <= 0 && scale.max >= 0
                          ? yAt(0)
                          : yAt(scale.min)
                      const areaPath = `${points
                        .map(
                          (point, index) =>
                            `${index === 0 ? "M" : "L"}${point.x},${point.y}`
                        )
                        .join(
                          " "
                        )} L${points.at(-1)!.x},${baseline} L${points[0].x},${baseline} Z`
                      return (
                        <path
                          key={segmentIndex}
                          d={areaPath}
                          fill={color}
                          fillOpacity={fillOpacity}
                        />
                      )
                    })
                  : null}
                <path
                  d={path}
                  fill="none"
                  stroke={color}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray={dash}
                  vectorEffect="non-scaling-stroke"
                />
                {showDots
                  ? data.map((datum, index) => {
                      const value = getChartValue(datum, item.key)
                      return value == null ? null : (
                        <circle
                          key={index}
                          cx={xAt(index)}
                          cy={yAt(value)}
                          r={activeIndex === index ? 4 : 2.5}
                          fill="var(--background)"
                          stroke={color}
                          strokeWidth="2"
                          vectorEffect="non-scaling-stroke"
                        />
                      )
                    })
                  : null}
              </g>
            )
          })}

          {referenceLines.map((reference, index) => {
            const y = yAt(reference.value)
            return (
              <g key={index}>
                <line
                  x1={layout.left}
                  x2={width - layout.right}
                  y1={y}
                  y2={y}
                  stroke={reference.color ?? "var(--foreground)"}
                  strokeOpacity="0.6"
                  strokeDasharray={reference.strokeDasharray ?? "4 4"}
                  vectorEffect="non-scaling-stroke"
                />
                {reference.label ? (
                  <text
                    x={width - layout.right}
                    y={y - 6}
                    textAnchor="end"
                    fill={reference.color ?? "var(--foreground)"}
                    fontSize="10"
                  >
                    {reference.label}
                  </text>
                ) : null}
              </g>
            )
          })}

          {activeIndex != null ? (
            <line
              x1={xAt(activeIndex)}
              x2={xAt(activeIndex)}
              y1={layout.top}
              y2={layout.top + layout.plotHeight}
              stroke="var(--foreground)"
              strokeOpacity="0.3"
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
      </div>
      <ChartDataTable data={data} xKey={xKey} series={series} />
    </div>
  )
}

export { LineChart }
export type {
  ChartDatum,
  ChartLabelFormatter,
  ChartReferenceLine,
  ChartSeries,
  ChartValueFormatter,
}
