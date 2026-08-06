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

export interface CanvasScatterChartProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "children" | "title"
> {
  /** 图表标题，用于说明正在分析的两个变量。 */
  title: React.ReactNode
  /** 补充样本量、时间范围或数据口径的副标题。 */
  description?: React.ReactNode
  /** 标题右侧的操作区。 */
  actions?: React.ReactNode
  /** 大批量同粒度观测数据。 */
  data: ChartDatum[]
  /** 横轴数值字段。 */
  xKey: string
  /** 纵轴数值字段。 */
  yKey: string
  /** 提示框使用的名称字段。 */
  labelKey: string
  /** 可选的分组字段。 */
  groupKey?: string
  /** 横轴显示名称。 */
  xLabel?: string
  /** 纵轴显示名称。 */
  yLabel?: string
  /** 图表绘图区高度，单位为像素。 @default 340 */
  height?: number
  /** 手动指定横轴范围。 */
  xDomain?: [number, number]
  /** 手动指定纵轴范围。 */
  yDomain?: [number, number]
  /** 数据点半径，单位为像素。 @default 2 */
  pointSize?: number
  /** 自定义横轴数值格式。 */
  xFormatter?: (value: number, datum?: ChartDatum) => React.ReactNode
  /** 自定义纵轴数值格式。 */
  yFormatter?: (value: number, datum?: ChartDatum) => React.ReactNode
  /** 点击最近的数据点时触发。 */
  onPointSelect?: (datum: ChartDatum, index: number) => void
  /** 完全替换当前数据点的默认提示内容。 */
  renderTooltip?: (datum: ChartDatum, index: number) => React.ReactNode
}

/** 使用 Canvas 绘制大批量关系数据，同时保留 DOM 提示和数据表语义。 */
function CanvasScatterChart({
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
  height = 340,
  xDomain,
  yDomain,
  pointSize = 2,
  xFormatter = defaultValueFormatter,
  yFormatter = defaultValueFormatter,
  onPointSelect,
  renderTooltip,
  className,
  ...props
}: CanvasScatterChartProps) {
  const id = React.useId()
  const titleId = `${id}-title`
  const descriptionId = `${id}-description`
  const { ref, width } = useChartSize()
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
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
  const activeDatum = activeIndex == null ? null : data[activeIndex]

  React.useEffect(() => {
    const canvas = canvasRef.current!
    const context = canvas.getContext("2d")!
    const ratio = window.devicePixelRatio || 1
    canvas.width = width * ratio
    canvas.height = height * ratio
    canvas.style.width = `${width}px`
    canvas.style.height = `${height}px`
    context.scale(ratio, ratio)

    const styles = getComputedStyle(ref.current!)
    const border = styles.getPropertyValue("--border").trim()
    const muted = styles.getPropertyValue("--muted-foreground").trim()
    const background = styles.getPropertyValue("--background").trim()
    const colors = chartColors.map((_, index) =>
      styles.getPropertyValue(`--chart-${index + 1}`).trim()
    )
    context.clearRect(0, 0, width, height)
    context.strokeStyle = border
    context.fillStyle = muted
    context.font = '11px "SFMono-Regular", Consolas, monospace'
    context.lineWidth = 1

    yScale.ticks.forEach((tick) => {
      const y = yAt(tick)
      context.beginPath()
      context.moveTo(layout.left, y)
      context.lineTo(width - layout.right, y)
      context.stroke()
      context.textAlign = "right"
      context.textBaseline = "middle"
      context.fillText(String(yFormatter(tick)), layout.left - 9, y)
    })
    xScale.ticks.forEach((tick) => {
      const x = xAt(tick)
      context.beginPath()
      context.moveTo(x, layout.top)
      context.lineTo(x, layout.top + layout.plotHeight)
      context.stroke()
      context.textAlign = "center"
      context.textBaseline = "bottom"
      context.fillText(String(xFormatter(tick)), x, height - 5)
    })

    data.forEach((datum, index) => {
      const x = getChartValue(datum, xKey)!
      const y = getChartValue(datum, yKey)!
      const groupIndex = groupKey ? groups.indexOf(String(datum[groupKey])) : 0
      context.beginPath()
      context.arc(
        xAt(x),
        yAt(y),
        activeIndex === index ? pointSize + 2 : pointSize,
        0,
        Math.PI * 2
      )
      context.fillStyle = colors[groupIndex % colors.length]
      context.globalAlpha =
        activeIndex == null || activeIndex === index ? 0.78 : 0.38
      context.fill()
      if (activeIndex === index) {
        context.strokeStyle = background
        context.lineWidth = 2
        context.stroke()
      }
    })
    context.globalAlpha = 1
  }, [
    activeIndex,
    data,
    groupKey,
    groups,
    height,
    layout,
    pointSize,
    width,
    xFormatter,
    xKey,
    xScale.ticks,
    yFormatter,
    yKey,
    yScale.ticks,
  ])

  function nearestPoint(event: React.PointerEvent<HTMLCanvasElement>) {
    const rect = event.currentTarget.getBoundingClientRect()
    const pointerX = event.clientX - rect.left
    const pointerY = event.clientY - rect.top
    let nearest: number | null = null
    let nearestDistance = 14
    data.forEach((datum, index) => {
      const dx = xAt(getChartValue(datum, xKey)!) - pointerX
      const dy = yAt(getChartValue(datum, yKey)!) - pointerY
      const distance = Math.hypot(dx, dy)
      if (distance < nearestDistance) {
        nearestDistance = distance
        nearest = index
      }
    })
    setActiveIndex(nearest)
  }

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
        <canvas
          ref={canvasRef}
          role="img"
          aria-labelledby={`${titleId}${description ? ` ${descriptionId}` : ""}`}
          className={cn(
            "focus-visible:ring-ring/30 block w-full outline-none focus-visible:ring-[3px]",
            onPointSelect && "cursor-crosshair"
          )}
          onPointerMove={nearestPoint}
          onPointerLeave={() => setActiveIndex(null)}
          onClick={() =>
            activeDatum && onPointSelect?.(activeDatum, activeIndex!)
          }
        />
        {activeDatum && renderTooltip ? (
          <div
            className="absolute z-10"
            style={{
              left: xAt(getChartValue(activeDatum, xKey)!) + 10,
              top: yAt(getChartValue(activeDatum, yKey)!),
            }}
          >
            {renderTooltip(activeDatum, activeIndex!)}
          </div>
        ) : (
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
                      color: chartColors[0],
                    },
                    {
                      key: yKey,
                      label: yLabel,
                      value: yFormatter(
                        getChartValue(activeDatum, yKey)!,
                        activeDatum
                      ),
                      color: chartColors[0],
                    },
                  ]
                : []
            }
          />
        )}
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

export { CanvasScatterChart }
export type { ChartDatum }
