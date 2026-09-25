import * as React from "react"

import { cn } from "@/registry/lib/utils"

export interface DescriptionsItemProps extends Omit<
  React.ComponentProps<"td">,
  "colSpan"
> {
  /** Term associated with the item value. */
  label: React.ReactNode
  /** Number of description columns occupied by this item. @default 1 */
  span?: 1 | 2 | 3 | 4
  /** Classes applied to the label cell. */
  labelClassName?: string
  /** Classes applied to the value cell. */
  contentClassName?: string
}

/** Declares one label-value pair inside Descriptions. */
function DescriptionsItem(_props: DescriptionsItemProps) {
  return null
}

DescriptionsItem.displayName = "DescriptionsItem"

export interface DescriptionsProps extends Omit<
  React.ComponentProps<"div">,
  "title"
> {
  /** Heading rendered above the description list. */
  title?: React.ReactNode
  /** Action rendered opposite the heading. */
  extra?: React.ReactNode
  /** Number of item groups per row. @default 3 */
  columns?: 1 | 2 | 3 | 4
  /** Draw a structured border around labels and values. @default false */
  bordered?: boolean
  /** Place labels beside or above their values. @default "horizontal" */
  layout?: "horizontal" | "vertical"
  /** Vertical density. @default "default" */
  size?: "sm" | "default"
  /** Fixed width of every horizontal label cell. @default "7rem" */
  labelWidth?: React.CSSProperties["width"]
}

type DescriptionItemElement = React.ReactElement<DescriptionsItemProps>

type DescriptionCell = { item: DescriptionItemElement; span: number }

/** Packs items into rows; the last item of an incomplete row stretches to fill it. */
function groupItems(children: React.ReactNode, columns: number) {
  const items = React.Children.toArray(children).filter(
    React.isValidElement
  ) as DescriptionItemElement[]
  const rows: DescriptionCell[][] = []
  let row: DescriptionCell[] = []
  let occupied = 0

  const flush = () => {
    const last = row.at(-1)
    if (last) last.span += columns - occupied
    rows.push(row)
    row = []
    occupied = 0
  }

  items.forEach((item) => {
    const span = Math.min(item.props.span ?? 1, columns)
    if (occupied > 0 && occupied + span > columns) flush()
    row.push({ item, span })
    occupied += span
    if (occupied === columns) flush()
  })

  if (row.length) flush()
  return rows
}

/** A table-aligned semantic key-value list for records, profiles, and object summaries. */
function Descriptions({
  className,
  children,
  title,
  extra,
  columns = 3,
  bordered = false,
  layout = "horizontal",
  size = "default",
  labelWidth = "7rem",
  ...props
}: DescriptionsProps) {
  const rows = groupItems(children, columns)
  const horizontal = layout === "horizontal"
  const cellPadding = size === "sm" ? "px-3 py-2" : "px-4 py-3"
  const compactPadding = size === "sm" ? "py-1" : "py-2"
  const normalizedLabelWidth =
    typeof labelWidth === "number" ? `${labelWidth}px` : labelWidth

  return (
    <div
      data-slot="descriptions"
      data-bordered={bordered || undefined}
      data-layout={layout}
      data-size={size}
      className={cn("min-w-0", className)}
      {...props}
    >
      {title || extra ? (
        <div className="mb-3 flex min-h-8 items-center justify-between gap-4">
          {title ? (
            <div
              data-slot="descriptions-title"
              className="font-semibold tracking-tight"
            >
              {title}
            </div>
          ) : (
            <span />
          )}
          {extra ? (
            <div data-slot="descriptions-extra" className="shrink-0">
              {extra}
            </div>
          ) : null}
        </div>
      ) : null}

      <div data-slot="descriptions-table-wrap" className="overflow-x-auto">
        <table
          data-slot="descriptions-table"
          className={cn(
            "w-full table-fixed border-collapse text-left text-sm",
            bordered && "border"
          )}
          style={{ minWidth: columns > 1 ? `${columns * 13}rem` : undefined }}
        >
          <colgroup>
            {Array.from({ length: columns }, (_, index) => (
              <React.Fragment key={index}>
                <col
                  style={
                    horizontal ? { width: normalizedLabelWidth } : undefined
                  }
                />
                {horizontal ? <col /> : null}
              </React.Fragment>
            ))}
          </colgroup>
          <tbody>
            {rows.flatMap((row, rowIndex) => {
              if (horizontal) {
                return (
                  <tr key={rowIndex}>
                    {row.map(({ item, span }, itemIndex) => {
                      const {
                        label,
                        span: _span,
                        labelClassName,
                        contentClassName,
                        className: itemClassName,
                        children: value,
                        ...itemProps
                      } = item.props
                      return (
                        <React.Fragment key={item.key ?? itemIndex}>
                          <th
                            scope="row"
                            data-slot="descriptions-label"
                            className={cn(
                              "text-muted-foreground align-top font-medium",
                              bordered
                                ? cn(cellPadding, "bg-muted/45 border")
                                : cn(compactPadding, "pr-4"),
                              labelClassName
                            )}
                          >
                            {label}
                          </th>
                          <td
                            data-slot="descriptions-value"
                            colSpan={span * 2 - 1}
                            className={cn(
                              "text-foreground min-w-0 break-words align-top",
                              bordered
                                ? cn(cellPadding, "border")
                                : cn(compactPadding, "pr-6"),
                              itemClassName,
                              contentClassName
                            )}
                            {...itemProps}
                          >
                            {value}
                          </td>
                        </React.Fragment>
                      )
                    })}
                  </tr>
                )
              }

              return [
                <tr key={`${rowIndex}-labels`}>
                  {row.map(({ item, span }, itemIndex) => {
                    return (
                      <th
                        key={item.key ?? itemIndex}
                        scope="col"
                        colSpan={span}
                        data-slot="descriptions-label"
                        className={cn(
                          "text-muted-foreground align-top font-medium",
                          bordered
                            ? cn(cellPadding, "bg-muted/45 border")
                            : "pr-6 pb-1",
                          item.props.labelClassName
                        )}
                      >
                        {item.props.label}
                      </th>
                    )
                  })}
                </tr>,
                <tr key={`${rowIndex}-values`}>
                  {row.map(({ item, span }, itemIndex) => {
                    const {
                      span: _span,
                      label: _label,
                      labelClassName: _labelClassName,
                      contentClassName,
                      className: itemClassName,
                      children: value,
                      ...itemProps
                    } = item.props
                    return (
                      <td
                        key={item.key ?? itemIndex}
                        colSpan={span}
                        data-slot="descriptions-value"
                        className={cn(
                          "text-foreground min-w-0 break-words align-top",
                          bordered
                            ? cn(cellPadding, "border")
                            : cn("pr-6", size === "sm" ? "pb-3" : "pb-4"),
                          itemClassName,
                          contentClassName
                        )}
                        {...itemProps}
                      >
                        {value}
                      </td>
                    )
                  })}
                </tr>,
              ]
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export { Descriptions, DescriptionsItem }
