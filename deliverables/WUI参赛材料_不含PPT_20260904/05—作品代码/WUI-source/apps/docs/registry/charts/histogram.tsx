"use client"

import * as React from "react"

import { BarChart } from "./bar-chart"
import { defaultValueFormatter, type ChartDatum } from "./chart-core"

export interface HistogramProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "children" | "title"
> {
  /** 图表标题，用于说明正在观察的数值分布。 */
  title: React.ReactNode
  /** 补充单位、样本范围或筛选条件的副标题。 */
  description?: React.ReactNode
  /** 标题右侧的操作区，适合组合 Button、Select 或业务工具栏。 */
  actions?: React.ReactNode
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
  /** 是否显示水平参考网格。 @default true */
  showGrid?: boolean
  /** 是否在柱形末端显示频数。 @default false */
  showValues?: boolean
  /** 自定义分箱边界的显示格式。 */
  binFormatter?: (min: number, max: number, index: number) => string
  /** 自定义频数的显示格式。 */
  frequencyFormatter?: (value: number) => React.ReactNode
}

/** 将连续数值自动分箱，并复用 BarChart 展示频数分布。 */
function Histogram({
  title,
  description,
  actions,
  data,
  valueKey,
  bins = 8,
  domain,
  height = 280,
  showGrid = true,
  showValues = false,
  binFormatter = (min, max) =>
    `${defaultValueFormatter(min)}–${defaultValueFormatter(max)}`,
  frequencyFormatter = (value) => `${value}`,
  ...props
}: HistogramProps) {
  const values = data.map((datum) => datum[valueKey] as number)
  const min = domain?.[0] ?? Math.min(...values)
  const max = domain?.[1] ?? Math.max(...values)
  const step = (max - min) / bins
  const distribution = Array.from({ length: bins }, (_, index) => ({
    range: binFormatter(min + index * step, min + (index + 1) * step, index),
    frequency: 0,
  }))

  values.forEach((value) => {
    const index = Math.min(bins - 1, Math.floor((value - min) / step))
    distribution[index].frequency += 1
  })

  return (
    <BarChart
      title={title}
      description={description}
      actions={actions}
      data={distribution}
      xKey="range"
      series={[{ key: "frequency", label: "频数" }]}
      height={height}
      showGrid={showGrid}
      showValues={showValues}
      showLegend={false}
      gap={0}
      radius={0}
      valueFormatter={(value) => frequencyFormatter(value)}
      yAxisFormatter={frequencyFormatter}
      {...props}
    />
  )
}

export { Histogram }
