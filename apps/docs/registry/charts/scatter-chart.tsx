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
} from "./chart-core"

export interface ScatterChartProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "children" | "title"
> {
  /** 图表标题，用于说明正在分析的两个变量。 */
  title: React.ReactNode
  /** 补充样本量、时间范围或数据口径的副标题。 */
  description?: React.ReactNode
  /** 标题右侧的操作区，适合组合 Button、Select 或业务工具栏。 */
  actions?: React.ReactNode
  /** 每行代表一个同粒度观测对象的数据。 */
  data: ChartDatum[]
  /** 横轴数值字段。 */
  xKey: string
  /** 纵轴数值字段。 */
  yKey: string
  /** 提示框和直接标签使用的名称字段。 */
  labelKey: string
  /** 可选的分组字段，用颜色和图例区分。 */
  groupKey?: string
  /** 横轴显示名称。 */
  xLabel?: string
  /** 纵轴显示名称。 */
  yLabel?: string
  /** 图表绘图区高度，单位为像素。 @default 300 */
  height?: number
  /** 手动指定横轴范围。 */
  xDomain?: [number, number]
  /** 手动指定纵轴范围。 */
  yDomain?: [number, number]
  /** 是否显示参考网格。 @default true */
  showGrid?: boolean
  /** 是否在点旁显示名称。 @default false */
  showLabels?: boolean
  /** 数据点半径，单位为像素。 @default 4 */
  pointSize?: number
  /** 自定义横轴数值的显示格式。 */
  xFormatter?: (value: number, datum?: ChartDatum) => React.ReactNode
  /** 自定义纵轴数值的显示格式。 */
  yFormatter?: (value: number, datum?: ChartDatum) => React.ReactNode
}

/** 展示两个数值变量之间的关系、聚类和离群点。 */
function ScatterChart({
  title,
  description,
  actions,
  data,
  xKey,
  yKey,
  labelKey,
  groupKey,
  xLabel = xKey,
  yLabel = yKey,
  height = 300,
  xDomain,
  yDomain,
  showGrid = true,
  showLabels = false,
  pointSize = 4,
  xFormatter = defaultValueFormatter,
  yFormatter = defaultValueFormatter,
  className,
  ...props
}: ScatterChartProps) {
  const id = React.useId()
  const titleId = `${id}-title`
  const descriptionId = `${id}-description`
  const { ref, width } = useChartSize()
  const [activeIndex, setActiveIndex] = React.useState<number | null>(null)
  const layout = getChartLayout(width, height)
  const xScale = getChartScale({
    data,
    series: [{ key: xKey }],
    domain: xDomain,
  })
  const yScale = getChartScale({
    data,
    series: [{ key: yKey }],
    domain: yDomain,
  })
  const groups = groupKey
    ? [...new Set(data.map((datum) => String(datum[groupKey])))]
    : []
  const xAt = (value: number) =>
    layout.left + scaleValue(value, xScale.min, xScale.max, layout.plotWidth)
  const yAt = (value: number) =>
    layout.top +
    layout.plotHeight -
    scaleValue(value, yScale.min, yScale.max, layout.plotHeight)
  const colorAt = (datum: ChartDatum) =>
    groupKey
      ? chartColors[
          groups.indexOf(String(datum[groupKey])) % chartColors.length
        ]
      : chartColors[0]
  const activeDatum = activeIndex == null ? null : data[activeIndex]

  return (
    <div className={cn("w-full", className)} {...props}>
      <ChartHeader
        title={title}
        description={description}
        actions={actions}
        titleId={titleId}
        descriptionId={descriptionId}
      />
      {groupKey ? (
        <ChartLegend
          kind="bar"
          series={groups.map((group, index) => ({
            key: group,
            label: group,
            color: chartColors[index % chartColors.length],
          }))}
        />
      ) : null}
      <div ref={ref} className="relative w-full">
        <svg
          className="block w-full overflow-visible outline-none"
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          role="img"
          aria-labelledby={`${titleId}${description ? ` ${descriptionId}` : ""}`}
        >
          {yScale.ticks.map((tick) => {
            const y = yAt(tick)
            return (
              <g key={`y-${tick}`}>
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
                  {yFormatter(tick)}
                </text>
              </g>
            )
          })}
          {xScale.ticks.map((tick) => {
            const x = xAt(tick)
            return (
              <g key={`x-${tick}`}>
                {showGrid ? (
                  <line
                    x1={x}
                    x2={x}
                    y1={layout.top}
                    y2={layout.top + layout.plotHeight}
                    stroke="var(--border)"
                    vectorEffect="non-scaling-stroke"
                  />
                ) : null}
                <text
                  x={x}
                  y={height - 9}
                  textAnchor="middle"
                  fill="var(--muted-foreground)"
                  fontSize="11"
                  className="font-mono tabular-nums"
                >
                  {xFormatter(tick)}
                </text>
              </g>
            )
          })}
          {data.map((datum, index) => {
            const x = getChartValue(datum, xKey)!
            const y = getChartValue(datum, yKey)!
            const color = colorAt(datum)
            return (
              <g key={index}>
                <circle
                  cx={xAt(x)}
                  cy={yAt(y)}
                  r={activeIndex === index ? pointSize + 2 : pointSize}
                  fill={color}
                  fillOpacity="0.78"
                  stroke="var(--background)"
                  strokeWidth="1.5"
                  tabIndex={0}
                  className="focus-visible:stroke-foreground outline-none"
                  onPointerEnter={() => setActiveIndex(index)}
                  onPointerLeave={() => setActiveIndex(null)}
                  onFocus={() => setActiveIndex(index)}
                  onBlur={() => setActiveIndex(null)}
                />
                {showLabels ? (
                  <text
                    x={xAt(x) + pointSize + 4}
                    y={yAt(y) - pointSize - 2}
                    fill="var(--foreground)"
                    fontSize="10"
                  >
                    {String(datum[labelKey])}
                  </text>
                ) : null}
              </g>
            )
          })}
          <text
            x={width - layout.right}
            y={height - 9}
            textAnchor="end"
            fill="var(--muted-foreground)"
            fontSize="10"
          >
            {xLabel}
          </text>
          <text
            x={layout.left}
            y={layout.top - 3}
            fill="var(--muted-foreground)"
            fontSize="10"
          >
            {yLabel}
          </text>
        </svg>
        <ChartTooltip
          active={activeDatum != null}
          x={activeDatum ? xAt(getChartValue(activeDatum, xKey)!) : 0}
          y={activeDatum ? yAt(getChartValue(activeDatum, yKey)!) : 0}
          width={width}
          label={activeDatum ? String(activeDatum[labelKey]) : ""}
          rows={
            activeDatum
              ? [
                  {
                    key: xKey,
                    label: xLabel,
                    value: xFormatter(
                      getChartValue(activeDatum, xKey)!,
                      activeDatum
                    ),
                    color: colorAt(activeDatum),
                  },
                  {
                    key: yKey,
                    label: yLabel,
                    value: yFormatter(
                      getChartValue(activeDatum, yKey)!,
                      activeDatum
                    ),
                    color: colorAt(activeDatum),
                  },
                ]
              : []
          }
        />
      </div>
      <ChartDataTable
        data={data}
        xKey={labelKey}
        series={[
          { key: xKey, label: xLabel },
          { key: yKey, label: yLabel },
        ]}
      />
    </div>
  )
}

export { ScatterChart }
export type { ChartDatum }
