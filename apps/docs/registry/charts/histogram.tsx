"use client"

import * as React from "react"

import { cn } from "@/registry/lib/utils"

import {
  ChartFrame,
  ChartHeader,
  ChartTooltip,
  defaultValueFormatter,
  useChartSize,
  type ChartDatum,
  type ChartVariant,
} from "./chart-core"

export interface HistogramProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "children" | "title"> {
  /** 图表标题，用于说明正在观察的数值分布。 */
  title: React.ReactNode
  /** 补充单位、样本范围或筛选条件；应明确一梯级对应一条记录。 */
  description?: React.ReactNode
  /** 标题右侧的操作区。 */
  actions?: React.ReactNode
  /** Lieflat 色彩系统；有序分箱适合 porcelain。 @default "mono" */
  variant?: ChartVariant
  /** 模板来源行，例如“RUNG HISTOGRAM · RESPONSE TIME · SUPPORT”。 */
  source?: React.ReactNode
  /** 每行代表一个观测值的数据。 */
  data: ChartDatum[]
  /** 要统计分布的数值字段。 */
  valueKey: string
  /** 等宽分箱数量。 @default 8 */
  bins?: number
  /** 手动指定统计范围。 */
  domain?: [number, number]
  /** 图表绘图区高度，单位为像素。 @default 280 */
  height?: number
  /** 保留以兼容旧调用；F14 用连续箱界而非网格。 */
  showGrid?: boolean
  /** 是否在最高分箱显示频数。 @default false */
  showValues?: boolean
  /** 自定义分箱边界的显示格式。 */
  binFormatter?: (min: number, max: number, index: number) => string
  /** 自定义频数的显示格式。 */
  frequencyFormatter?: (value: number) => React.ReactNode
}

function variation(index: number, seed: number) {
  return Math.abs(((index * 73856093) ^ (seed * 19349663)) % 1000) / 1000
}

/** F14 Rung Histogram：箱界保持连续，频数由一层层横档而不是实心柱编码。 */
function Histogram({
  title,
  description,
  actions,
  variant = "mono",
  source,
  data,
  valueKey,
  bins = 8,
  domain,
  height = 280,
  showGrid: _showGrid,
  showValues = false,
  binFormatter = (min, max) => `${defaultValueFormatter(min)}–${defaultValueFormatter(max)}`,
  frequencyFormatter = (value) => `${value}`,
  className,
  ...props
}: HistogramProps) {
  const id = React.useId()
  const titleId = `${id}-title`
  const descriptionId = `${id}-description`
  const { ref, width } = useChartSize()
  const [activeIndex, setActiveIndex] = React.useState<number | null>(null)
  const values = data.map((datum) => Number(datum[valueKey])).filter(Number.isFinite)
  const lower = domain?.[0] ?? Math.min(...values, 0)
  const upperCandidate = domain?.[1] ?? Math.max(...values, lower + 1)
  const upper = upperCandidate === lower ? lower + 1 : upperCandidate
  const count = Math.max(1, Math.min(24, Math.floor(bins)))
  const binSize = (upper - lower) / count
  const distribution = Array.from({ length: count }, (_, index) => ({ min: lower + index * binSize, max: lower + (index + 1) * binSize, frequency: 0 }))
  values.forEach((value) => { if (value >= lower && value <= upper) distribution[Math.min(count - 1, Math.max(0, Math.floor((value - lower) / binSize)))].frequency += 1 })
  const peak = Math.max(0, ...distribution.map((bin) => bin.frequency))
  const peakIndex = distribution.findIndex((bin) => bin.frequency === peak)
  const baseline = height - 38
  const left = 38
  const right = 24
  const plotWidth = width - left - right
  const binWidth = plotWidth / count
  const rungHeight = Math.min(5.4, Math.max(2.8, (baseline - 25) / Math.max(1, peak)))
  const active = activeIndex === null ? null : distribution[activeIndex]

  return (
    <ChartFrame variant={variant} source={source} className={cn(className)} {...props}>
      <ChartHeader title={title} description={description} actions={actions} titleId={titleId} descriptionId={descriptionId} />
      <div ref={ref} className="relative w-full">
        <svg className="focus-visible:outline-ring block w-full overflow-visible outline-none focus-visible:outline-2 focus-visible:outline-offset-4" width={width} height={height} viewBox={`0 0 ${width} ${height}`} role="img" aria-labelledby={`${titleId}${description ? ` ${descriptionId}` : ""}`} tabIndex={0} onPointerMove={(event) => { const rect = event.currentTarget.getBoundingClientRect(); const x = ((event.clientX - rect.left) / rect.width) * width; setActiveIndex(Math.max(0, Math.min(count - 1, Math.floor((x - left) / binWidth)))) }} onPointerLeave={() => setActiveIndex(null)}>
          {distribution.map((bin, index) => {
            const x = left + index * binWidth + binWidth / 2
            const halfWidth = Math.max(3, binWidth * 0.32)
            return <g key={index} opacity={activeIndex === null || activeIndex === index ? 1 : 0.42}>
              {Array.from({ length: bin.frequency }, (_, rungIndex) => {
                const y = baseline - rungIndex * rungHeight
                const jitter = halfWidth - 1.5 + variation(rungIndex + 1, index + 2) * 2.8
                return <line key={rungIndex} x1={x - jitter} y1={y} x2={x + jitter} y2={y} stroke="var(--chart-ink)" strokeWidth="1" opacity={0.55 + variation(rungIndex + 2, index + 4) * 0.45} vectorEffect="non-scaling-stroke" />
              })}
              {showValues && index === peakIndex ? <text x={x} y={baseline - Math.max(0, bin.frequency - 1) * rungHeight - 10} textAnchor="middle" fill="var(--chart-ink)" fontSize="11" fontWeight="800" style={{ fontVariantNumeric: "tabular-nums" }}>{frequencyFormatter(bin.frequency)}</text> : null}
            </g>
          })}
          <line x1={left - 4} y1={baseline + 4} x2={width - right + 4} y2={baseline + 4} stroke="var(--chart-grid)" strokeWidth="0.8" />
          {Array.from({ length: count + 1 }, (_, index) => { const x = left + index * binWidth; return <g key={index}><line x1={x} y1={baseline + 4} x2={x} y2={baseline + (index % 2 === 0 ? 11 : 8)} stroke="var(--chart-faint)" strokeWidth="0.65" />{index % Math.max(1, Math.ceil(count / 5)) === 0 || index === count ? <text x={x} y={baseline + 21} textAnchor="middle" fill="var(--chart-muted)" fontSize="7" fontWeight="600">{defaultValueFormatter(lower + index * binSize)}</text> : null}</g> })}
          <text x={width / 2} y={height - 4} textAnchor="middle" fill="var(--chart-faint)" fontSize="7" fontWeight="600" letterSpacing="0.12em">ONE RUNG = ONE RECORD · BIN EDGES ARE CONTINUOUS</text>
        </svg>
        <ChartTooltip active={active !== null} x={activeIndex === null ? 0 : left + activeIndex * binWidth + binWidth / 2} y={24} width={width} label={active ? binFormatter(active.min, active.max, activeIndex!) : ""} rows={active ? [{ key: "frequency", label: "频数", value: frequencyFormatter(active.frequency), color: "var(--chart-ink)" }] : []} />
      </div>
      <table className="sr-only"><thead><tr><th>范围</th><th>频数</th></tr></thead><tbody>{distribution.map((bin, index) => <tr key={index}><th>{binFormatter(bin.min, bin.max, index)}</th><td>{bin.frequency}</td></tr>)}</tbody></table>
    </ChartFrame>
  )
}

export { Histogram }
