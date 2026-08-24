"use client"

import * as React from "react"

import {
  ChartDataTable,
  ChartFrame,
  ChartHeader,
  ChartTooltip,
  defaultValueFormatter,
  useChartSize,
  type ChartDatum,
  type ChartLabelFormatter,
  type ChartSeries,
  type ChartValueFormatter,
  type ChartVariant,
} from "./chart-core"

export interface HorizontalBarChartProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "children" | "title"
> {
  /** 结论式标题，而不是“横向条形图”等图型名称。 */
  title: React.ReactNode
  /** 单位、刻度含义和时间范围。 */
  description?: React.ReactNode
  /** 标题右侧操作区。 */
  actions?: React.ReactNode
  /** Lieflat 色彩系统。排名和较多类目默认使用 mono。 @default "mono" */
  variant?: ChartVariant
  /** 模板来源行，例如“TICK ROWS · RELEASE LOG · ENGINEERING”。 */
  source?: React.ReactNode
  /** 每行代表一个可比较类别。最多建议八行。 */
  data: ChartDatum[]
  /** 类别标签字段。 */
  categoryKey: string
  /** 单一数值序列；一行只编码一个真实指标。 */
  series: [ChartSeries]
  /** 每一根 tick 所代表的真实单位；未传时按最大值推导可读刻度。 */
  tickStep?: number
  /** 图表绘图区高度，单位为像素。 @default 320 */
  height?: number
  /** 标签列宽度，单位为像素。 @default 120 */
  labelWidth?: number
  /** 是否显示行尾精确值。 @default true */
  showValues?: boolean
  /** 自定义数值显示格式。 */
  valueFormatter?: ChartValueFormatter
  /** 自定义类别标签。 */
  labelFormatter?: ChartLabelFormatter
}

function niceTickStep(maximum: number) {
  const rough = Math.max(1, maximum / 30)
  const power = 10 ** Math.floor(Math.log10(rough))
  const fraction = rough / power
  const factor = fraction <= 1 ? 1 : fraction <= 2 ? 2 : fraction <= 5 ? 5 : 10
  return factor * power
}

function tickJitter(index: number, row: number) {
  return Math.abs(((index * 73856093) ^ (row * 19349663)) % 1000) / 1000
}

/**
 * F5 Tick Rows：一行是一条队列，tick 的数量与真实值成比例；
 * 它不是把柱形图旋转 90°。
 */
function HorizontalBarChart({
  title,
  description,
  actions,
  variant = "mono",
  source,
  data,
  categoryKey,
  series,
  tickStep,
  height = 320,
  labelWidth = 120,
  showValues = true,
  valueFormatter = (value) => defaultValueFormatter(value),
  labelFormatter = (value) => String(value),
  className,
  ...props
}: HorizontalBarChartProps) {
  const id = React.useId()
  const titleId = `${id}-title`
  const descriptionId = `${id}-description`
  const { ref, width } = useChartSize()
  const [activeIndex, setActiveIndex] = React.useState<number | null>(null)
  const seriesItem = series[0]
  const values = data.map((datum) => Number(datum[seriesItem.key]) || 0)
  const maximum = Math.max(...values, 1)
  const resolvedTickStep = tickStep ?? niceTickStep(maximum)
  const rowHeight = Math.min(48, Math.max(36, (height - 36) / data.length))
  const baseline = 14
  const tickWidth = Math.max(5.5, Math.min(9, (width - labelWidth - 100) / 34))
  const maxTicks = Math.ceil(maximum / resolvedTickStep)
  const ticksWidth = maxTicks * tickWidth
  const contentWidth = Math.max(0, width - labelWidth - 62)

  const activeDatum = activeIndex == null ? null : data[activeIndex]

  return (
    <ChartFrame variant={variant} source={source} className={className} {...props}>
      <ChartHeader
        title={title}
        description={description}
        actions={actions}
        titleId={titleId}
        descriptionId={descriptionId}
      />
      <div ref={ref} className="relative w-full">
        <svg
          className="block w-full overflow-visible outline-none"
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          role="img"
          aria-labelledby={`${titleId}${description ? ` ${descriptionId}` : ""}`}
        >
          {data.map((datum, rowIndex) => {
            const value = values[rowIndex]
            const ticks = value / resolvedTickStep
            const wholeTicks = Math.floor(ticks)
            const remainder = ticks - wholeTicks
            const y = baseline + rowIndex * rowHeight
            const rowEnd = labelWidth + Math.min(contentWidth, ticksWidth)
            const color = "var(--chart-1)"

            return (
              <g
                key={rowIndex}
                tabIndex={0}
                className="cursor-pointer outline-none"
                onPointerEnter={() => setActiveIndex(rowIndex)}
                onPointerLeave={() => setActiveIndex(null)}
                onFocus={() => setActiveIndex(rowIndex)}
                onBlur={() => setActiveIndex(null)}
              >
                <text
                  x={labelWidth - 12}
                  y={y + 4}
                  textAnchor="end"
                  fill="var(--chart-muted)"
                  fontSize="9.5"
                  fontWeight="600"
                  letterSpacing="0.04em"
                >
                  {labelFormatter(datum[categoryKey] as string | number, datum)}
                </text>
                <line
                  x1={labelWidth}
                  x2={rowEnd}
                  y1={y + 10}
                  y2={y + 10}
                  stroke="var(--chart-grid)"
                  strokeWidth="0.7"
                  vectorEffect="non-scaling-stroke"
                />
                {Array.from({ length: wholeTicks }, (_, tickIndex) => {
                  const x = labelWidth + tickIndex * tickWidth + tickWidth / 2
                  const tickHeight = 9 + tickJitter(tickIndex + 1, rowIndex + 1) * 6
                  return (
                    <g key={tickIndex}>
                      <line
                        x1={x}
                        x2={x}
                        y1={y + 10}
                        y2={y + 10 - tickHeight}
                        stroke={color}
                        strokeWidth="1"
                        strokeOpacity={activeIndex == null || activeIndex === rowIndex ? 1 : 0.3}
                        vectorEffect="non-scaling-stroke"
                      />
                      {tickIndex % 5 === 4 ? (
                        <circle cx={x} cy={y + 14} r="0.9" fill="var(--chart-faint)" />
                      ) : null}
                    </g>
                  )
                })}
                {remainder > 0 ? (
                  <line
                    x1={labelWidth + wholeTicks * tickWidth + tickWidth / 2}
                    x2={labelWidth + wholeTicks * tickWidth + tickWidth / 2}
                    y1={y + 10}
                    y2={y + 10 - (9 + tickJitter(wholeTicks + 1, rowIndex + 1) * 6)}
                    stroke={color}
                    strokeWidth="1"
                    strokeOpacity={remainder}
                    vectorEffect="non-scaling-stroke"
                  />
                ) : null}
                {showValues ? (
                  <text
                    x={Math.min(labelWidth + ticks * tickWidth + 10, width - 6)}
                    y={y + 4}
                    fill="var(--chart-ink)"
                    fontSize="11"
                    fontWeight="800"
                    style={{ fontVariantNumeric: "tabular-nums" }}
                  >
                    {valueFormatter(value, seriesItem, datum)}
                  </text>
                ) : null}
              </g>
            )
          })}
          <text
            x={width / 2}
            y={height - 8}
            textAnchor="middle"
            fill="var(--chart-faint)"
            fontSize="8"
            fontWeight="600"
            letterSpacing="0.08em"
          >
            {`每一格 = ${defaultValueFormatter(resolvedTickStep)} · 每五格标记`}
          </text>
        </svg>
        <ChartTooltip
          active={activeDatum != null}
          x={labelWidth + Math.min(values[activeIndex ?? 0] / resolvedTickStep, maxTicks) * tickWidth}
          y={baseline + (activeIndex ?? 0) * rowHeight - 12}
          width={width}
          label={
            activeDatum
              ? labelFormatter(
                  activeDatum[categoryKey] as string | number,
                  activeDatum
                )
              : ""
          }
          rows={
            activeDatum
              ? [
                  {
                    key: seriesItem.key,
                    label: seriesItem.label ?? seriesItem.key,
                    value: valueFormatter(values[activeIndex!], seriesItem, activeDatum),
                    color: "var(--chart-1)",
                  },
                ]
              : []
          }
        />
      </div>
      <ChartDataTable data={data} xKey={categoryKey} series={series} />
    </ChartFrame>
  )
}

export { HorizontalBarChart }
export type { ChartDatum, ChartLabelFormatter, ChartSeries, ChartValueFormatter }
