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
  type ChartSeries,
} from "./chart-core"

export interface RadarChartProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children" | "title"> {
  /** 图表标题。 */
  title: React.ReactNode
  /** 补充说明或副标题。 */
  description?: React.ReactNode
  /** 标题右侧操作区。 */
  actions?: React.ReactNode
  /** 图表数据列表，每项代表一个雷达维度。 */
  data: ChartDatum[]
  /** 维度名称字段。 */
  nameKey: string
  /** 需要绘制的数据系列列表。 */
  series: ChartSeries[]
  /** 雷达轴的最大刻度值；未传时根据数据自动推导。 */
  maxValue?: number
  /** 雷达网格形状（多边形或同心圆）。 @default "polygon" */
  gridShape?: "polygon" | "circle"
  /** 同心网格层数。 @default 4 */
  gridLevels?: number
  /** 绘图区高度（像素）。 @default 340 */
  height?: number
  /** 是否展示图例。 @default true */
  showLegend?: boolean
  /** 是否展示各维度标签。 @default true */
  showLabels?: boolean
  /** 数值格式化函数。 */
  valueFormatter?: (value: number, series: ChartSeries, datum: ChartDatum) => React.ReactNode
}

function polarToCartesian(cx: number, cy: number, radius: number, angle: number) {
  return {
    x: cx + radius * Math.cos(angle - Math.PI / 2),
    y: cy + radius * Math.sin(angle - Math.PI / 2),
  }
}

/** 多维能力与指标对比雷达图。 */
function RadarChart({
  title,
  description,
  actions,
  data,
  nameKey,
  series,
  maxValue: controlledMax,
  gridShape = "polygon",
  gridLevels = 4,
  height = 340,
  showLegend = true,
  showLabels = true,
  valueFormatter = defaultValueFormatter,
  className,
  ...props
}: RadarChartProps) {
  const { ref, width } = useChartSize()
  const [activeDatum, setActiveDatum] = React.useState<{
    index: number
    datum: ChartDatum
    x: number
    y: number
  } | null>(null)

  const dimensionsCount = data.length
  const angleStep = dimensionsCount > 0 ? (2 * Math.PI) / dimensionsCount : 0

  const resolvedMax = React.useMemo(() => {
    if (controlledMax !== undefined) return controlledMax
    let max = 0
    for (const item of data) {
      for (const s of series) {
        const val = Number(item[s.key]) || 0
        if (val > max) max = val
      }
    }
    return max > 0 ? Math.ceil(max * 1.1) : 100
  }, [controlledMax, data, series])

  const margin = 40
  const cx = width / 2
  const cy = height / 2
  const maxRadius = Math.max(20, Math.min(cx - margin, cy - margin))

  const seriesWithColors = React.useMemo(() => {
    return series.map((s, idx) => ({
      ...s,
      color: s.color ?? chartColors[idx % chartColors.length],
    }))
  }, [series])

  const id = React.useId()
  const titleId = `${id}-title`
  const descriptionId = `${id}-description`

  return (
    <div
      ref={ref}
      data-slot="radar-chart"
      className={cn("flex flex-col gap-3 rounded-xl border border-border bg-card p-4", className)}
      {...props}
    >
      <ChartHeader
        title={title}
        description={description}
        actions={actions}
        titleId={titleId}
        descriptionId={descriptionId}
      />

      <div className="relative flex justify-center" style={{ height }}>
        <svg width={width} height={height} className="overflow-visible select-none">
          {/* Grid Rings */}
          {Array.from({ length: gridLevels }).map((_, levelIdx) => {
            const levelRadius = (maxRadius / gridLevels) * (levelIdx + 1)
            if (gridShape === "circle") {
              return (
                <circle
                  key={levelIdx}
                  cx={cx}
                  cy={cy}
                  r={levelRadius}
                  fill="none"
                  stroke="var(--border)"
                  strokeDasharray="3 3"
                  strokeOpacity="0.7"
                />
              )
            }

            const points = Array.from({ length: dimensionsCount }).map((_, dIdx) => {
              const pt = polarToCartesian(cx, cy, levelRadius, dIdx * angleStep)
              return `${pt.x},${pt.y}`
            })

            return (
              <polygon
                key={levelIdx}
                points={points.join(" ")}
                fill="none"
                stroke="var(--border)"
                strokeOpacity="0.7"
              />
            )
          })}

          {/* Axes */}
          {Array.from({ length: dimensionsCount }).map((_, dIdx) => {
            const pt = polarToCartesian(cx, cy, maxRadius, dIdx * angleStep)
            const labelPt = polarToCartesian(cx, cy, maxRadius + 18, dIdx * angleStep)
            const datum = data[dIdx]

            return (
              <g key={dIdx}>
                <line
                  x1={cx}
                  y1={cy}
                  x2={pt.x}
                  y2={pt.y}
                  stroke="var(--border)"
                  strokeOpacity="0.6"
                />
                {showLabels && datum && (
                  <text
                    x={labelPt.x}
                    y={labelPt.y}
                    textAnchor="middle"
                    dominantBaseline="central"
                    className="fill-muted-foreground text-[11px] font-medium"
                  >
                    {String(datum[nameKey])}
                  </text>
                )}
              </g>
            )
          })}

          {/* Series Polygons */}
          {seriesWithColors.map((s) => {
            const polygonPoints = data.map((datum, dIdx) => {
              const val = Math.max(0, Number(datum[s.key]) || 0)
              const r = (val / resolvedMax) * maxRadius
              const pt = polarToCartesian(cx, cy, r, dIdx * angleStep)
              return `${pt.x},${pt.y}`
            })

            return (
              <g key={s.key} className="transition-opacity">
                <polygon
                  points={polygonPoints.join(" ")}
                  fill={s.color}
                  fillOpacity="0.25"
                  stroke={s.color}
                  strokeWidth="2"
                  className="transition-all duration-300"
                />
                {data.map((datum, dIdx) => {
                  const val = Math.max(0, Number(datum[s.key]) || 0)
                  const r = (val / resolvedMax) * maxRadius
                  const pt = polarToCartesian(cx, cy, r, dIdx * angleStep)
                  return (
                    <circle
                      key={dIdx}
                      cx={pt.x}
                      cy={pt.y}
                      r="4"
                      fill={s.color}
                      className="cursor-pointer transition-transform hover:scale-125"
                      onMouseEnter={() =>
                        setActiveDatum({
                          index: dIdx,
                          datum,
                          x: pt.x,
                          y: pt.y,
                        })
                      }
                      onMouseLeave={() => setActiveDatum(null)}
                    />
                  )
                })}
              </g>
            )
          })}
        </svg>

        <ChartTooltip
          active={activeDatum !== null}
          x={activeDatum?.x ?? 0}
          y={activeDatum?.y ?? 0}
          width={width}
          label={activeDatum ? String(activeDatum.datum[nameKey]) : ""}
          rows={
            activeDatum
              ? seriesWithColors.map((s) => ({
                  key: s.key,
                  label: s.label ?? s.key,
                  value: valueFormatter(
                    Number(activeDatum.datum[s.key]) || 0,
                    s,
                    activeDatum.datum
                  ),
                  color: s.color,
                }))
              : []
          }
        />
      </div>

      {showLegend && (
        <div className="flex flex-wrap items-center justify-center gap-4 pt-1">
          {seriesWithColors.map((s) => (
            <div key={s.key} className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span
                className="size-2.5 rounded-full"
                style={{ backgroundColor: s.color }}
              />
              <span>{s.label ?? s.key}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export { RadarChart }
export type { ChartDatum, ChartSeries }
