"use client"

import * as React from "react"

import { cn } from "@/registry/lib/utils"

import {
  ChartHeader,
  ChartTooltip,
  chartColors,
  defaultValueFormatter,
  useChartSize,
  type ChartDatum,
} from "./chart-core"

export interface PieChartProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "children" | "title"
> {
  /** 图表标题，用于说明正在展示的构成指标。 */
  title: React.ReactNode
  /** 补充总体、时间范围或数据口径的副标题。 */
  description?: React.ReactNode
  /** 标题右侧的操作区，适合组合 Button、Select 或业务工具栏。 */
  actions?: React.ReactNode
  /** 每行代表一个构成类别的数据。 */
  data: ChartDatum[]
  /** 类别名称字段。 */
  nameKey: string
  /** 类别数值字段。 */
  valueKey: string
  /** 可选的类别颜色字段。 */
  colorKey?: string
  /** 图表绘图区高度，单位为像素。 @default 320 */
  height?: number
  /** 内圈相对外圈的比例；大于零时显示为环图。 @default 0 */
  innerRadius?: number
  /** 扇区之间的角度间隔。 @default 1 */
  padAngle?: number
  /** 是否显示类别和占比标签。 @default true */
  showLabels?: boolean
  /** 是否显示类别图例。 @default true */
  showLegend?: boolean
  /** 环图中心显示的内容。 */
  centerContent?: React.ReactNode
  /** 自定义数值的显示格式。 */
  valueFormatter?: (value: number, datum: ChartDatum) => React.ReactNode
  /** 自定义类别标签。 */
  labelFormatter?: (
    name: string,
    value: number,
    percentage: number,
    datum: ChartDatum
  ) => React.ReactNode
}

function polarPoint(cx: number, cy: number, radius: number, angle: number) {
  return {
    x: cx + Math.cos(angle) * radius,
    y: cy + Math.sin(angle) * radius,
  }
}

function arcPath({
  cx,
  cy,
  outerRadius,
  innerRadius,
  startAngle,
  endAngle,
}: {
  cx: number
  cy: number
  outerRadius: number
  innerRadius: number
  startAngle: number
  endAngle: number
}) {
  const outerStart = polarPoint(cx, cy, outerRadius, startAngle)
  const outerEnd = polarPoint(cx, cy, outerRadius, endAngle)
  const largeArc = endAngle - startAngle > Math.PI ? 1 : 0

  if (innerRadius <= 0) {
    return `M${cx},${cy} L${outerStart.x},${outerStart.y} A${outerRadius},${outerRadius} 0 ${largeArc} 1 ${outerEnd.x},${outerEnd.y} Z`
  }

  const innerEnd = polarPoint(cx, cy, innerRadius, endAngle)
  const innerStart = polarPoint(cx, cy, innerRadius, startAngle)
  return `M${outerStart.x},${outerStart.y} A${outerRadius},${outerRadius} 0 ${largeArc} 1 ${outerEnd.x},${outerEnd.y} L${innerEnd.x},${innerEnd.y} A${innerRadius},${innerRadius} 0 ${largeArc} 0 ${innerStart.x},${innerStart.y} Z`
}

/** 展示少量类别的部分与整体关系，并支持饼图和环图形态。 */
function PieChart({
  title,
  description,
  actions,
  data,
  nameKey,
  valueKey,
  colorKey,
  height = 320,
  innerRadius = 0,
  padAngle = 1,
  showLabels = true,
  showLegend = true,
  centerContent,
  valueFormatter = (value) => defaultValueFormatter(value),
  labelFormatter = (name, _value, percentage) =>
    `${name} ${Math.round(percentage * 100)}%`,
  className,
  ...props
}: PieChartProps) {
  const id = React.useId()
  const titleId = `${id}-title`
  const descriptionId = `${id}-description`
  const { ref, width } = useChartSize()
  const [activeIndex, setActiveIndex] = React.useState<number | null>(null)
  const total = data.reduce(
    (sum, datum) => sum + (datum[valueKey] as number),
    0
  )
  const cx = width / 2
  const cy = height / 2
  const outerRadius = Math.min(width, height) * (showLabels ? 0.29 : 0.36)
  const holeRadius = outerRadius * Math.min(0.8, Math.max(0, innerRadius))
  const pad = (padAngle * Math.PI) / 180
  let cursor = -Math.PI / 2
  const sectors = data.map((datum, index) => {
    const value = datum[valueKey] as number
    const angle = (value / total) * Math.PI * 2
    const startAngle = cursor + pad / 2
    const endAngle = cursor + angle - pad / 2
    const middleAngle = cursor + angle / 2
    cursor += angle
    return {
      datum,
      value,
      startAngle,
      endAngle,
      middleAngle,
      color:
        (colorKey ? (datum[colorKey] as string | undefined) : undefined) ??
        chartColors[index % chartColors.length],
    }
  })
  const activeSector = activeIndex == null ? null : sectors[activeIndex]
  const tooltipPoint = activeSector
    ? polarPoint(cx, cy, outerRadius * 0.72, activeSector.middleAngle)
    : { x: 0, y: 0 }

  return (
    <div className={cn("w-full", className)} {...props}>
      <ChartHeader
        title={title}
        description={description}
        actions={actions}
        titleId={titleId}
        descriptionId={descriptionId}
      />
      <div ref={ref} className="relative w-full">
        <svg
          className="block w-full overflow-visible"
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          role="img"
          aria-labelledby={`${titleId}${description ? ` ${descriptionId}` : ""}`}
        >
          {sectors.map((sector, index) => {
            const labelPoint = polarPoint(
              cx,
              cy,
              outerRadius + 18,
              sector.middleAngle
            )
            return (
              <g key={index}>
                <path
                  d={arcPath({
                    cx,
                    cy,
                    outerRadius:
                      activeIndex === index ? outerRadius + 3 : outerRadius,
                    innerRadius: holeRadius,
                    startAngle: sector.startAngle,
                    endAngle: sector.endAngle,
                  })}
                  fill={sector.color}
                  stroke="var(--background)"
                  strokeWidth="1.5"
                  tabIndex={0}
                  className="focus-visible:stroke-foreground outline-none"
                  onPointerEnter={() => setActiveIndex(index)}
                  onPointerLeave={() => setActiveIndex(null)}
                  onFocus={() => setActiveIndex(index)}
                  onBlur={() => setActiveIndex(null)}
                />
                {showLabels && sector.value / total >= 0.06 ? (
                  <text
                    x={labelPoint.x}
                    y={labelPoint.y}
                    dy="0.32em"
                    textAnchor={labelPoint.x < cx ? "end" : "start"}
                    fill="var(--foreground)"
                    fontSize="10"
                  >
                    {labelFormatter(
                      String(sector.datum[nameKey]),
                      sector.value,
                      sector.value / total,
                      sector.datum
                    )}
                  </text>
                ) : null}
              </g>
            )
          })}
          {holeRadius > 0 && centerContent ? (
            <foreignObject
              x={cx - holeRadius}
              y={cy - holeRadius / 2}
              width={holeRadius * 2}
              height={holeRadius}
            >
              <div className="flex size-full items-center justify-center text-center text-sm font-semibold">
                {centerContent}
              </div>
            </foreignObject>
          ) : null}
        </svg>
        <ChartTooltip
          active={activeSector != null}
          x={tooltipPoint.x}
          y={tooltipPoint.y}
          width={width}
          label={activeSector ? String(activeSector.datum[nameKey]) : ""}
          rows={
            activeSector
              ? [
                  {
                    key: valueKey,
                    label: `${Math.round((activeSector.value / total) * 100)}%`,
                    value: valueFormatter(
                      activeSector.value,
                      activeSector.datum
                    ),
                    color: activeSector.color,
                  },
                ]
              : []
          }
        />
      </div>
      {showLegend ? (
        <div
          className="flex flex-wrap justify-center gap-x-5 gap-y-2"
          aria-hidden="true"
        >
          {sectors.map((sector, index) => (
            <span
              key={index}
              className="text-muted-foreground inline-flex items-center gap-2 text-xs"
            >
              <span
                className="size-2.5"
                style={{ backgroundColor: sector.color }}
              />
              {String(sector.datum[nameKey])}
            </span>
          ))}
        </div>
      ) : null}
      <table className="sr-only">
        <thead>
          <tr>
            <th>{nameKey}</th>
            <th>{valueKey}</th>
          </tr>
        </thead>
        <tbody>
          {data.map((datum, index) => (
            <tr key={index}>
              <th>{String(datum[nameKey])}</th>
              <td>{String(datum[valueKey])}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export { PieChart }
export type { ChartDatum }
