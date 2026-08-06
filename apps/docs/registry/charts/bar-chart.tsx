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
  scaleValue,
  useChartSize,
  type ChartDatum,
  type ChartLabelFormatter,
  type ChartReferenceLine,
  type ChartSeries,
  type ChartValueFormatter,
} from "./chart-core"

export interface BarChartProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "children" | "title"
> {
  /** 图表标题，用于说明正在比较的指标。 */
  title: React.ReactNode
  /** 补充单位、时间范围或筛选条件的副标题。 */
  description?: React.ReactNode
  /** 标题右侧的操作区，适合组合 Button、Select 或业务工具栏。 */
  actions?: React.ReactNode
  /** 每行代表一个横轴分类的数据。 */
  data: ChartDatum[]
  /** 用作横轴分类标签的数据字段。 */
  xKey: string
  /** 要比较的数值序列。 */
  series: ChartSeries[]
  /** 图表绘图区高度，单位为像素。 @default 280 */
  height?: number
  /** 手动指定纵轴最小值和最大值，范围应包含零。 */
  domain?: [number, number]
  /** 是否显示水平参考网格。 @default true */
  showGrid?: boolean
  /** 是否在柱形末端显示精确数值。 @default false */
  showValues?: boolean
  /** 是否在多序列时显示图例。 @default true */
  showLegend?: boolean
  /** 柱形之间的间距比例。 @default 0.2 */
  gap?: number
  /** 柱形圆角，单位为像素。 @default 1.5 */
  radius?: number
  /** 目标值、均值或阈值等纵轴参考线。 */
  referenceLines?: ChartReferenceLine[]
  /** 自定义纵轴刻度的显示格式。 */
  yAxisFormatter?: (value: number) => React.ReactNode
  /** 自定义数值的显示格式。 */
  valueFormatter?: ChartValueFormatter
  /** 自定义横轴标签和提示框标题的显示格式。 */
  labelFormatter?: ChartLabelFormatter
}

/** 从零基线开始比较分类数值并支持分组序列的条形图。 */
function BarChart({
  title,
  description,
  actions,
  data,
  xKey,
  series,
  height = 280,
  domain,
  showGrid = true,
  showValues = false,
  showLegend = true,
  gap = 0.2,
  radius = 1.5,
  referenceLines = [],
  yAxisFormatter = defaultValueFormatter,
  valueFormatter = (value) => defaultValueFormatter(value),
  labelFormatter = (value) => String(value),
  className,
  ...props
}: BarChartProps) {
  const id = React.useId()
  const titleId = `${id}-title`
  const descriptionId = `${id}-description`
  const { ref, width } = useChartSize()
  const [activeIndex, setActiveIndex] = React.useState<number | null>(null)
  const layout = getChartLayout(width, height)
  const scale = getChartScale({ data, series, domain, includeZero: true })
  const groupWidth = layout.plotWidth / data.length
  const innerWidth = groupWidth * (1 - Math.min(0.7, Math.max(0, gap)))
  const barWidth = innerWidth / series.length
  const zeroY =
    layout.top +
    layout.plotHeight -
    scaleValue(0, scale.min, scale.max, layout.plotHeight)
  const yAt = (value: number) =>
    layout.top +
    layout.plotHeight -
    scaleValue(value, scale.min, scale.max, layout.plotHeight)
  const groupX = (index: number) => layout.left + index * groupWidth
  const activeDatum = activeIndex == null ? null : data[activeIndex]

  function selectFromPointer(event: React.PointerEvent<SVGSVGElement>) {
    const rect = event.currentTarget.getBoundingClientRect()
    const pointerX = ((event.clientX - rect.left) / rect.width) * width
    setActiveIndex(
      Math.max(
        0,
        Math.min(
          data.length - 1,
          Math.floor((pointerX - layout.left) / groupWidth)
        )
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
                    stroke={tick === 0 ? "var(--foreground)" : "var(--border)"}
                    strokeOpacity={tick === 0 ? 0.45 : 1}
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

          {activeIndex != null ? (
            <rect
              x={groupX(activeIndex)}
              y={layout.top}
              width={groupWidth}
              height={layout.plotHeight}
              fill="var(--muted)"
              opacity="0.45"
            />
          ) : null}

          {data.map((datum, dataIndex) => {
            const startX = groupX(dataIndex) + (groupWidth - innerWidth) / 2
            return (
              <g key={dataIndex}>
                {series.map((item, seriesIndex) => {
                  const value = getChartValue(datum, item.key)
                  if (value == null) return null
                  const valueY = yAt(value)
                  const y = Math.min(valueY, zeroY)
                  const barHeight = Math.abs(zeroY - valueY)
                  const color =
                    item.color ?? chartColors[seriesIndex % chartColors.length]
                  return (
                    <g key={item.key}>
                      <rect
                        x={startX + seriesIndex * barWidth}
                        y={y}
                        width={Math.max(1, barWidth - 1)}
                        height={barHeight}
                        fill={color}
                        rx={radius}
                      />
                      {showValues ? (
                        <text
                          x={startX + seriesIndex * barWidth + barWidth / 2}
                          y={value >= 0 ? y - 6 : y + barHeight + 13}
                          textAnchor="middle"
                          fill="var(--foreground)"
                          fontSize="10"
                          className="font-mono tabular-nums"
                        >
                          {valueFormatter(value, item, datum)}
                        </text>
                      ) : null}
                    </g>
                  )
                })}
                {dataIndex % labelStep === 0 ||
                dataIndex === data.length - 1 ? (
                  <text
                    x={groupX(dataIndex) + groupWidth / 2}
                    y={height - 9}
                    textAnchor="middle"
                    fill="var(--muted-foreground)"
                    fontSize="11"
                  >
                    {labelFormatter(datum[xKey] as string | number, datum)}
                  </text>
                ) : null}
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
        </svg>

        <ChartTooltip
          active={activeDatum != null}
          x={activeIndex == null ? 0 : groupX(activeIndex) + groupWidth / 2}
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

export { BarChart }
export type {
  ChartDatum,
  ChartLabelFormatter,
  ChartReferenceLine,
  ChartSeries,
  ChartValueFormatter,
}
