"use client"

import * as React from "react"

import { Slider } from "@/registry/ui/slider"

import { cn } from "@/registry/lib/utils"

import type { ChartDatum } from "./chart-core"

export interface ChartBrushProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "defaultValue"
> {
  /** 与主图横轴顺序一致的数据。 */
  data: ChartDatum[]
  /** 用于显示选区边界的标签字段。 */
  labelKey: string
  /** 受控的起止索引。 */
  value?: [number, number]
  /** 非受控的初始起止索引。 */
  defaultValue?: [number, number]
  /** 选区索引变化时触发。 */
  onValueChange?: (value: [number, number]) => void
  /** 两个边界之间至少保留的数据点数量。 @default 2 */
  minPoints?: number
  /** 自定义边界标签。 */
  labelFormatter?: (
    value: string | number,
    datum: ChartDatum
  ) => React.ReactNode
}

/** 复用 Slider 提供图表范围选择，可用于缩放或时间窗口过滤。 */
function ChartBrush({
  data,
  labelKey,
  value,
  defaultValue = [0, data.length - 1],
  onValueChange,
  minPoints = 2,
  labelFormatter = (next) => String(next),
  className,
  ...props
}: ChartBrushProps) {
  const [internalValue, setInternalValue] =
    React.useState<[number, number]>(defaultValue)
  const current = value ?? internalValue

  function handleValueChange(next: number[]) {
    const range: [number, number] = [next[0], next[1]]
    if (!value) setInternalValue(range)
    onValueChange?.(range)
  }

  return (
    <div
      data-slot="chart-brush"
      className={cn(
        "mt-4 grid grid-cols-[auto_1fr_auto] items-center gap-3",
        className
      )}
      {...props}
    >
      <span className="text-muted-foreground min-w-10 text-xs">
        {labelFormatter(
          data[current[0]][labelKey] as string | number,
          data[current[0]]
        )}
      </span>
      <Slider
        value={current}
        min={0}
        max={data.length - 1}
        step={1}
        minStepsBetweenThumbs={minPoints - 1}
        showValue="never"
        variant="expand"
        aria-label="图表显示范围"
        onValueChange={handleValueChange}
      />
      <span className="text-muted-foreground min-w-10 text-right text-xs">
        {labelFormatter(
          data[current[1]][labelKey] as string | number,
          data[current[1]]
        )}
      </span>
    </div>
  )
}

export { ChartBrush }
export type { ChartDatum }
