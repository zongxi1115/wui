"use client"

import * as React from "react"

import { StackedBarChart, type StackedBarChartProps } from "./stacked-bar-chart"

export interface HorizontalBarChartProps extends Omit<
  StackedBarChartProps,
  "layout" | "normalize"
> {}

/** 使用横向空间容纳长分类标签，适合排名与分类比较。 */
function HorizontalBarChart(props: HorizontalBarChartProps) {
  return <StackedBarChart layout="horizontal" normalize={false} {...props} />
}

export { HorizontalBarChart }
