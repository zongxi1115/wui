"use client"

import * as React from "react"

import { cn } from "@/registry/lib/utils"

import {
  ChartFrame,
  ChartHeader,
  useChartSize,
  type ChartVariant,
} from "./chart-core"

export interface GaugeZone {
  /** 区间起始数值。 */
  from: number
  /** 区间终止数值。 */
  to: number
  /** 该区间对应的色彩（仅用于下方说明）。 */
  color: string
  /** 可选的区间名称。 */
  label?: string
}

export interface GaugeChartProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children" | "title"> {
  /** 图表标题。 */
  title: React.ReactNode
  /** 补充说明或副标题；应明确目标口径。 */
  description?: React.ReactNode
  /** 标题右侧操作区。 */
  actions?: React.ReactNode
  /** Lieflat 色彩系统；单指标进度适合 porcelain。 @default "mono" */
  variant?: ChartVariant
  /** 模板来源行，例如“TICK GAUGE · QUARTERLY TARGET · OPS”。 */
  source?: React.ReactNode
  /** 当前读数数值。 */
  value: number
  /** 仪表盘最小值。 @default 0 */
  min?: number
  /** 仪表盘最大值。 @default 100 */
  max?: number
  /** 保留以兼容旧调用；Tick Gauge 以细刻度而非粗圆弧呈现。 */
  thickness?: number
  /** 绘图区高度（像素）。 @default 240 */
  height?: number
  /** 可选的业务阈值说明。 */
  zones?: GaugeZone[]
  /** 是否展示 25%、50%、75%、100% 里程碑。 @default true */
  showTicks?: boolean
  /** 单位文本（如 "%", "ms", "GB"）。 */
  unit?: string
  /** 自定义当前数值的格式化函数。 */
  valueFormatter?: (value: number) => React.ReactNode
}

function polar(cx: number, cy: number, radius: number, degrees: number) {
  const radians = (degrees * Math.PI) / 180
  return {
    x: cx + radius * Math.cos(radians),
    y: cy + radius * Math.sin(radians),
  }
}

function tickVariation(index: number, seed: number) {
  return Math.abs(((index * 73856093) ^ (seed * 19349663)) % 1000) / 1000
}

/** F11 Tick Gauge：一根细刻度代表目标的一个百分比。 */
function GaugeChart({
  title,
  description,
  actions,
  variant = "mono",
  source,
  value,
  min = 0,
  max = 100,
  thickness: _thickness,
  height = 240,
  zones,
  showTicks = true,
  unit = "",
  valueFormatter = (current) => current.toString(),
  className,
  ...props
}: GaugeChartProps) {
  const { ref, width } = useChartSize()
  const id = React.useId()
  const titleId = `${id}-title`
  const descriptionId = `${id}-description`
  const ratio = max > min ? Math.max(0, Math.min(1, (value - min) / (max - min))) : 0
  const progress = Math.round(ratio * 100)
  const cx = width / 2
  const cy = height * 0.72
  const radius = Math.max(48, Math.min(width * 0.28, height * 0.46))
  const startAngle = -195
  const sweep = 210
  const remaining = Math.max(0, 100 - progress)

  return (
    <ChartFrame
      ref={ref}
      variant={variant}
      source={source}
      data-slot="gauge-chart"
      className={cn(className)}
      {...props}
    >
      <ChartHeader
        title={title}
        description={description}
        actions={actions}
        titleId={titleId}
        descriptionId={descriptionId}
      />

      <svg
        className="block w-full overflow-visible"
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-labelledby={`${titleId}${description ? ` ${descriptionId}` : ""}`}
      >
        {Array.from({ length: 100 }, (_, index) => {
          const angle = startAngle + (index / 100) * sweep
          const complete = index < progress
          const length = complete ? 13 + tickVariation(index + 1, 3) * 6 : 5 + tickVariation(index + 1, 7) * 2.5
          const from = polar(cx, cy, radius, angle)
          const to = polar(cx, cy, radius + length, angle)
          return (
            <line
              key={index}
              x1={from.x}
              y1={from.y}
              x2={to.x}
              y2={to.y}
              stroke={complete ? "var(--chart-ink)" : "var(--chart-grid)"}
              strokeWidth={complete ? 1 : 0.65}
              vectorEffect="non-scaling-stroke"
            />
          )
        })}

        {showTicks
          ? [25, 50, 75, 100].map((milestone) => {
              const angle = startAngle + (milestone / 100) * sweep
              const dot = polar(cx, cy, radius - 7, angle)
              const label = polar(cx, cy, radius - 20, angle)
              return (
                <g key={milestone}>
                  <circle cx={dot.x} cy={dot.y} r="1" fill="var(--chart-faint)" />
                  <text
                    x={label.x}
                    y={label.y + 3}
                    textAnchor="middle"
                    fill="var(--chart-faint)"
                    fontSize="7"
                    fontWeight="600"
                    style={{ fontVariantNumeric: "tabular-nums" }}
                  >
                    {milestone}
                  </text>
                </g>
              )
            })
          : null}

        {progress > 0 ? (() => {
          const tip = polar(cx, cy, radius + 20, startAngle + (progress / 100) * sweep)
          return <circle cx={tip.x} cy={tip.y} r="2.4" fill="var(--chart-ink)" />
        })() : null}

        <text
          x={cx}
          y={cy - 4}
          textAnchor="middle"
          fill="var(--chart-ink)"
          fontSize="34"
          fontWeight="800"
          letterSpacing="-0.04em"
          style={{ fontVariantNumeric: "tabular-nums" }}
        >
          {valueFormatter(Math.max(min, Math.min(max, value)))}
          {unit ? <tspan fontSize="14" fontWeight="600"> {unit}</tspan> : null}
        </text>
        <text
          x={cx}
          y={cy + 17}
          textAnchor="middle"
          fill="var(--chart-muted)"
          fontSize="8"
          fontWeight="600"
          letterSpacing="0.1em"
          style={{ fontVariantNumeric: "tabular-nums" }}
        >
          {remaining} TICKS TO GO
        </text>
        <text
          x={cx}
          y={height - 8}
          textAnchor="middle"
          fill="var(--chart-faint)"
          fontSize="7"
          fontWeight="600"
          letterSpacing="0.12em"
        >
          ONE TICK = 1% OF TARGET · INKED = EARNED
        </text>
      </svg>

      {zones?.length ? (
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[11px] text-[var(--chart-muted)]">
          {zones.map((zone) => (
            <span key={`${zone.from}-${zone.to}`} className="inline-flex items-center gap-1.5">
              <span className="size-1.5 rounded-none" style={{ backgroundColor: zone.color }} />
              {zone.label ?? `${zone.from}–${zone.to}`}
            </span>
          ))}
        </div>
      ) : null}
    </ChartFrame>
  )
}

export { GaugeChart }
