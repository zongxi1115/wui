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
  type ChartSeries,
} from "./chart-core"

export interface ComposedSeries extends ChartSeries {
  /** 序列使用柱形或折线。 */
  type: "bar" | "line"
  /** 序列使用左侧或右侧纵轴。 @default "left" */
  axis?: "left" | "right"
}

export interface ComposedChartProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "children" | "title"
> {
  /** 图表标题，用于说明组合比较指标。 */
  title: React.ReactNode
  /** 补充单位、时间范围或口径的副标题。 */
  description?: React.ReactNode
  /** 标题右侧的操作区。 */
  actions?: React.ReactNode
  /** 每行代表一个横轴分类的数据。 */
  data: ChartDatum[]
  /** 横轴标签字段。 */
  xKey: string
  /** 柱形和折线序列配置。 */
  series: ComposedSeries[]
  /** 图表绘图区高度，单位为像素。 @default 300 */
  height?: number
  /** 左侧纵轴范围。 */
  leftDomain?: [number, number]
  /** 右侧纵轴范围。 */
  rightDomain?: [number, number]
  /** 左侧纵轴尺度。 @default "linear" */
  leftScale?: "linear" | "log"
  /** 右侧纵轴尺度。 @default "linear" */
  rightScale?: "linear" | "log"
  /** 左侧纵轴刻度格式。 */
  leftFormatter?: (value: number) => React.ReactNode
  /** 右侧纵轴刻度格式。 */
  rightFormatter?: (value: number) => React.ReactNode
  /** 横轴标签格式。 */
  labelFormatter?: (
    value: string | number,
    datum: ChartDatum
  ) => React.ReactNode
  /** 当前数值的提示格式。 */
  valueFormatter?: (
    value: number,
    series: ComposedSeries,
    datum: ChartDatum
  ) => React.ReactNode
  /** 是否显示水平参考网格。 @default true */
  showGrid?: boolean
  /** 完全替换默认图例内容。 */
  renderLegend?: (series: ComposedSeries[]) => React.ReactNode
  /** 完全替换当前分类的默认提示内容。 */
  renderTooltip?: (datum: ChartDatum, index: number) => React.ReactNode
}

function axisScale(
  data: ChartDatum[],
  series: ComposedSeries[],
  domain: [number, number] | undefined,
  scale: "linear" | "log"
) {
  const base = getChartScale({
    data,
    series,
    domain,
    includeZero: scale === "linear",
  })
  if (scale === "linear") return base
  const values = data.flatMap((datum) =>
    series.flatMap((item) => {
      const value = getChartValue(datum, item.key)
      return value != null && value > 0 ? [value] : []
    })
  )
  const min = domain?.[0] ?? Math.min(...values)
  const max = domain?.[1] ?? Math.max(...values)
  const ticks = Array.from(
    {
      length: Math.floor(Math.log10(max)) - Math.ceil(Math.log10(min)) + 1,
    },
    (_, index) => 10 ** (Math.ceil(Math.log10(min)) + index)
  )
  return { min, max, ticks }
}

/** 在共享横轴上组合柱形与折线，并支持双纵轴和对数尺度。 */
function ComposedChart({
  title,
  description,
  actions,
  data,
  xKey,
  series,
  height = 300,
  leftDomain,
  rightDomain,
  leftScale = "linear",
  rightScale = "linear",
  leftFormatter = defaultValueFormatter,
  rightFormatter = defaultValueFormatter,
  labelFormatter = (value) => String(value),
  valueFormatter = (value) => defaultValueFormatter(value),
  showGrid = true,
  renderLegend,
  renderTooltip,
  className,
  ...props
}: ComposedChartProps) {
  const id = React.useId()
  const titleId = `${id}-title`
  const descriptionId = `${id}-description`
  const { ref, width } = useChartSize()
  const [activeIndex, setActiveIndex] = React.useState<number | null>(null)
  const baseLayout = getChartLayout(width, height)
  const layout = {
    ...baseLayout,
    right: 52,
    plotWidth: width - baseLayout.left - 52,
  }
  const leftSeries = series.filter((item) => (item.axis ?? "left") === "left")
  const rightSeries = series.filter((item) => item.axis === "right")
  const left = axisScale(data, leftSeries, leftDomain, leftScale)
  const right = axisScale(data, rightSeries, rightDomain, rightScale)
  const barSeries = series.filter((item) => item.type === "bar")
  const band = layout.plotWidth / data.length
  const barWidth = (band * 0.56) / Math.max(1, barSeries.length)
  const xAt = (index: number) => layout.left + band * index + band / 2
  const yAt = (value: number, axis: "left" | "right") => {
    const config = axis === "left" ? left : right
    const scaleType = axis === "left" ? leftScale : rightScale
    const ratio =
      scaleType === "log"
        ? (Math.log10(value) - Math.log10(config.min)) /
          (Math.log10(config.max) - Math.log10(config.min))
        : scaleValue(value, config.min, config.max, 1)
    return layout.top + layout.plotHeight - ratio * layout.plotHeight
  }
  const zeroAt = (axis: "left" | "right") => {
    const config = axis === "left" ? left : right
    const scaleType = axis === "left" ? leftScale : rightScale
    return scaleType === "log"
      ? layout.top + layout.plotHeight
      : yAt(Math.max(0, config.min), axis)
  }
  const activeDatum = activeIndex == null ? null : data[activeIndex]
  const labelStep = Math.max(1, Math.ceil(data.length / (width < 480 ? 5 : 8)))

  function selectFromPointer(event: React.PointerEvent<SVGSVGElement>) {
    const rect = event.currentTarget.getBoundingClientRect()
    const pointerX = ((event.clientX - rect.left) / rect.width) * width
    setActiveIndex(
      Math.max(
        0,
        Math.min(data.length - 1, Math.floor((pointerX - layout.left) / band))
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
      {renderLegend?.(series) ?? <ChartLegend series={series} kind="bar" />}
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
          onFocus={() => setActiveIndex((value) => value ?? 0)}
          onBlur={() => setActiveIndex(null)}
        >
          {left.ticks.map((tick) => {
            const y = yAt(tick, "left")
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
                  {leftFormatter(tick)}
                </text>
              </g>
            )
          })}
          {rightSeries.length
            ? right.ticks.map((tick) => (
                <text
                  key={tick}
                  x={width - layout.right + 9}
                  y={yAt(tick, "right")}
                  dy="0.32em"
                  textAnchor="start"
                  fill="var(--muted-foreground)"
                  fontSize="11"
                  className="font-mono tabular-nums"
                >
                  {rightFormatter(tick)}
                </text>
              ))
            : null}
          {series.map((item, seriesIndex) => {
            const axis = item.axis ?? "left"
            const color =
              item.color ?? chartColors[seriesIndex % chartColors.length]
            if (item.type === "bar") {
              const barIndex = barSeries.indexOf(item)
              return data.map((datum, dataIndex) => {
                const value = getChartValue(datum, item.key)
                if (value == null) return null
                const y = yAt(value, axis)
                const baseline = zeroAt(axis)
                return (
                  <rect
                    key={dataIndex}
                    x={
                      xAt(dataIndex) -
                      (barSeries.length * barWidth) / 2 +
                      barIndex * barWidth
                    }
                    y={Math.min(y, baseline)}
                    width={Math.max(1, barWidth - 1)}
                    height={Math.abs(baseline - y)}
                    fill={color}
                    rx="1.5"
                  />
                )
              })
            }
            const path = data
              .flatMap((datum, dataIndex) => {
                const value = getChartValue(datum, item.key)
                return value == null
                  ? []
                  : [{ x: xAt(dataIndex), y: yAt(value, axis) }]
              })
              .map(
                (point, index) =>
                  `${index === 0 ? "M" : "L"}${point.x},${point.y}`
              )
              .join(" ")
            return (
              <path
                key={item.key}
                d={path}
                fill="none"
                stroke={color}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray={item.strokeDasharray}
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
                textAnchor="middle"
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
              strokeOpacity="0.3"
              strokeDasharray="3 3"
            />
          ) : null}
        </svg>
        {activeDatum && renderTooltip ? (
          <div
            className="absolute z-10"
            style={{ left: xAt(activeIndex!) + 10, top: layout.top }}
          >
            {renderTooltip(activeDatum, activeIndex!)}
          </div>
        ) : (
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
        )}
      </div>
      <ChartDataTable data={data} xKey={xKey} series={series} />
    </div>
  )
}

export { ComposedChart }
export type { ChartDatum, ChartSeries }
