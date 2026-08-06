"use client"

import * as React from "react"

import { LineChart, type LineChartProps } from "./line-chart"

export interface AreaChartProps extends Omit<
  LineChartProps,
  "fillOpacity" | "showDots"
> {
  /** 面积填充的不透明度。 @default 0.14 */
  fillOpacity?: number
  /** 是否显示数据节点。 @default false */
  showDots?: boolean
}

/** 在折线趋势下方增加克制填充，用于强调连续数值的规模。 */
function AreaChart({
  fillOpacity = 0.14,
  showDots = false,
  ...props
}: AreaChartProps) {
  return <LineChart fillOpacity={fillOpacity} showDots={showDots} {...props} />
}

export { AreaChart }
