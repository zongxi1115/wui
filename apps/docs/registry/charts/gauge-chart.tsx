"use client"

import * as React from "react"
import { cn } from "@/registry/lib/utils"
import {
  ChartHeader,
  useChartSize,
} from "./chart-core"

export interface GaugeZone {
  /** 区间起始数值。 */
  from: number
  /** 区间终止数值。 */
  to: number
  /** 该区间对应的色彩（可传 CSS 变量或颜色名）。 */
  color: string
  /** 可选的区间名称。 */
  label?: string
}

export interface GaugeChartProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children" | "title"> {
  /** 图表标题。 */
  title: React.ReactNode
  /** 补充说明或副标题。 */
  description?: React.ReactNode
  /** 标题右侧操作区。 */
  actions?: React.ReactNode
  /** 当前读数数值。 */
  value: number
  /** 仪表盘最小值。 @default 0 */
  min?: number
  /** 仪表盘最大值。 @default 100 */
  max?: number
  /** 环形圆弧厚度（像素）。 @default 16 */
  thickness?: number
  /** 绘图区高度（像素）。 @default 240 */
  height?: number
  /** 仪表盘分段目标区间配置。 */
  zones?: GaugeZone[]
  /** 是否展示刻度标签。 @default true */
  showTicks?: boolean
  /** 单位文本（如 "%", "ms", "GB"）。 */
  unit?: string
  /** 自定义当前数值的格式化函数。 */
  valueFormatter?: (value: number) => React.ReactNode
}

function polarToCoord(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180.0
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad),
  }
}

function createArcPath(
  cx: number,
  cy: number,
  r: number,
  startAngle: number,
  endAngle: number
) {
  const start = polarToCoord(cx, cy, r, endAngle)
  const end = polarToCoord(cx, cy, r, startAngle)
  const largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1

  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`
}

/** 仪表盘图表，展示核心度量指标的当前水平与阈值区间。 */
function GaugeChart({
  title,
  description,
  actions,
  value,
  min = 0,
  max = 100,
  thickness = 16,
  height = 240,
  zones,
  showTicks = true,
  unit = "",
  valueFormatter = (val) => val.toString(),
  className,
  ...props
}: GaugeChartProps) {
  const { ref, width } = useChartSize()

  const startAngle = -120
  const endAngle = 120
  const totalAngleSpan = endAngle - startAngle

  const clampedValue = Math.max(min, Math.min(max, value))
  const progressRatio = max > min ? (clampedValue - min) / (max - min) : 0
  const currentAngle = startAngle + progressRatio * totalAngleSpan

  const cx = width / 2
  const cy = height * 0.65
  const radius = Math.max(40, Math.min(cx - 32, cy - 20))

  const activeColor = React.useMemo(() => {
    if (zones && zones.length > 0) {
      for (const z of zones) {
        if (clampedValue >= z.from && clampedValue <= z.to) {
          return z.color
        }
      }
    }
    return "var(--primary)"
  }, [clampedValue, zones])

  const id = React.useId()
  const titleId = `${id}-title`
  const descriptionId = `${id}-description`

  return (
    <div
      ref={ref}
      data-slot="gauge-chart"
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

      <div className="relative flex items-center justify-center select-none" style={{ height }}>
        <svg width={width} height={height} className="overflow-visible">
          {/* Background Track */}
          <path
            d={createArcPath(cx, cy, radius, startAngle, endAngle)}
            fill="none"
            stroke="var(--muted)"
            strokeWidth={thickness}
            strokeLinecap="round"
          />

          {/* Zones Track */}
          {zones &&
            zones.map((zone, idx) => {
              const zStartRatio = Math.max(0, (zone.from - min) / (max - min))
              const zEndRatio = Math.min(1, (zone.to - min) / (max - min))
              const zStartAngle = startAngle + zStartRatio * totalAngleSpan
              const zEndAngle = startAngle + zEndRatio * totalAngleSpan

              if (zEndAngle <= zStartAngle) return null

              return (
                <path
                  key={idx}
                  d={createArcPath(cx, cy, radius, zStartAngle, zEndAngle)}
                  fill="none"
                  stroke={zone.color}
                  strokeWidth={thickness}
                  strokeOpacity="0.4"
                />
              )
            })}

          {/* Active Value Progress Arc */}
          {progressRatio > 0 && (
            <path
              d={createArcPath(cx, cy, radius, startAngle, currentAngle)}
              fill="none"
              stroke={activeColor}
              strokeWidth={thickness}
              strokeLinecap="round"
              className="transition-all duration-500 ease-out"
            />
          )}

          {/* Center Value Text */}
          <text
            x={cx}
            y={cy - 12}
            textAnchor="middle"
            className="fill-foreground font-mono text-3xl font-bold tracking-tight"
          >
            {valueFormatter(clampedValue)}
            {unit && <tspan className="text-base font-medium text-muted-foreground ml-1"> {unit}</tspan>}
          </text>

          {/* Min & Max Labels */}
          {showTicks && (
            <>
              {(() => {
                const minPt = polarToCoord(cx, cy, radius + thickness + 12, startAngle)
                const maxPt = polarToCoord(cx, cy, radius + thickness + 12, endAngle)
                return (
                  <>
                    <text
                      x={minPt.x}
                      y={minPt.y}
                      textAnchor="middle"
                      className="fill-muted-foreground text-xs font-mono"
                    >
                      {min}
                    </text>
                    <text
                      x={maxPt.x}
                      y={maxPt.y}
                      textAnchor="middle"
                      className="fill-muted-foreground text-xs font-mono"
                    >
                      {max}
                    </text>
                  </>
                )
              })()}
            </>
          )}
        </svg>
      </div>

      {zones && zones.length > 0 && (
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground border-t border-border/50 pt-2.5">
          {zones.map((z, idx) => (
            <div key={idx} className="flex items-center gap-1.5">
              <span className="size-2 rounded-full" style={{ backgroundColor: z.color }} />
              <span>
                {z.label ?? `${z.from} - ${z.to}`}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export { GaugeChart }
