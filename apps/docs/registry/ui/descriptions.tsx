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

function groupItems(children: React.ReactNode, columns: number) {
  const items = React.Children.toArray(children).filter(
    React.isValidElement
  ) as DescriptionItemElement[]
  const rows: DescriptionItemElement[][] = []
  let row: DescriptionItemElement[] = []
  let occupied = 0

  items.forEach((item) => {
    const span = Math.min(item.props.span ?? 1, columns)
    if (occupied > 0 && occupied + span > columns) {
      rows.push(row)
      row = []
      occupied = 0
    }
    row.push(item)
    occupied += span
    if (occupied === columns) {
      rows.push(row)
      row = []
      occupied = 0
    }
  })

  if (row.length) rows.push(row)
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
                    {row.map((item, itemIndex) => {
                      const {
                        label,
                        span = 1,
                        labelClassName,
                        contentClassName,
                        className: itemClassName,
                        children: value,
                        ...itemProps
                      } = item.props
                      const safeSpan = Math.min(span, columns)
                      return (
                        <React.Fragment key={item.key ?? itemIndex}>
                          <th
                            scope="row"
                            data-slot="descriptions-label"
                            className={cn(
                              "text-muted-foreground align-top font-medium",
                              cellPadding,
                              bordered && "bg-muted/45 border",
                              labelClassName
                            )}
                          >
                            {label}
                          </th>
                          <td
                            data-slot="descriptions-value"
                            colSpan={safeSpan * 2 - 1}
                            className={cn(
                              "text-foreground min-w-0 break-words align-top",
                              cellPadding,
                              bordered && "border",
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
                  {row.map((item, itemIndex) => {
                    const safeSpan = Math.min(item.props.span ?? 1, columns)
                    return (
                      <th
                        key={item.key ?? itemIndex}
                        scope="col"
                        colSpan={safeSpan}
                        data-slot="descriptions-label"
                        className={cn(
                          "text-muted-foreground pb-1 align-top font-medium",
                          bordered && cn(cellPadding, "bg-muted/45 border"),
                          item.props.labelClassName
                        )}
                      >
                        {item.props.label}
                      </th>
                    )
                  })}
                </tr>,
                <tr key={`${rowIndex}-values`}>
                  {row.map((item, itemIndex) => {
                    const {
                      span = 1,
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
                        colSpan={Math.min(span, columns)}
                        data-slot="descriptions-value"
                        className={cn(
                          "text-foreground min-w-0 break-words align-top",
                          !bordered && "pb-4",
                          bordered && cn(cellPadding, "border"),
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
