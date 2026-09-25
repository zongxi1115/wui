"use client"

import * as React from "react"
import { cva } from "class-variance-authority"

import { cn } from "@/registry/lib/utils"

const tableVariants = cva("w-full caption-bottom text-sm", {
  variants: {
    density: {
      default: "",
      compact:
        "[&_[data-slot=table-cell]]:px-3 [&_[data-slot=table-cell]]:py-2 [&_[data-slot=table-head]]:h-9 [&_[data-slot=table-head]]:px-3",
    },
    striped: {
      true: "[&_[data-slot=table-body]_[data-slot=table-row]:nth-child(even)]:bg-muted/35",
      false: "",
    },
  },
  defaultVariants: {
    density: "default",
    striped: false,
  },
})

export interface TableProps extends React.ComponentProps<"table"> {
  /** Extra classes applied to the horizontal overflow container. */
  containerClassName?: string
  /** Controls cell padding and row height. @default "default" */
  density?: "default" | "compact"
  /** Adds a subtle background to alternating body rows. @default false */
  striped?: boolean
  /** Keeps the header visible while the table container scrolls. @default false */
  stickyHeader?: boolean
}

/** A responsive native table with composable semantic sections. */
function Table({
  className,
  containerClassName,
  density = "default",
  striped = false,
  stickyHeader = false,
  ...props
}: TableProps) {
  return (
    <div
      data-slot="table-container"
      className={cn(
        "relative isolate w-full overflow-auto overscroll-x-contain",
        containerClassName
      )}
    >
      <table
        data-slot="table"
        data-density={density}
        className={cn(
          tableVariants({ density, striped }),
          stickyHeader &&
            "[&_[data-slot=table-header]]:bg-background [&_[data-slot=table-header]]:sticky [&_[data-slot=table-header]]:top-0 [&_[data-slot=table-header]]:z-20",
          className
        )}
        {...props}
      />
    </div>
  )
}

function TableHeader({ className, ...props }: React.ComponentProps<"thead">) {
  return (
    <thead
      data-slot="table-header"
      className={cn("[&_tr]:border-b", className)}
      {...props}
    />
  )
}

function TableBody({ className, ...props }: React.ComponentProps<"tbody">) {
  return (
    <tbody
      data-slot="table-body"
      className={cn("[&_tr:last-child]:border-0", className)}
      {...props}
    />
  )
}

function TableFooter({ className, ...props }: React.ComponentProps<"tfoot">) {
  return (
    <tfoot
      data-slot="table-footer"
      className={cn(
        "bg-muted/50 border-t font-medium [&>tr]:last:border-b-0",
        className
      )}
      {...props}
    />
  )
}

function TableRow({ className, ...props }: React.ComponentProps<"tr">) {
  return (
    <tr
      data-slot="table-row"
      className={cn(
        "group/row hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-[background-color,opacity] duration-200 ease-out data-[dragging=true]:opacity-45",
        className
      )}
      {...props}
    />
  )
}

export interface TableHeadProps extends React.ComponentProps<"th"> {
  /** Pins the column to an edge of the horizontal scroll container. */
  pinned?: "left" | "right"
  /** Distance from the pinned edge, useful when pinning multiple columns. @default 0 */
  pinOffset?: number | string
  /** Current column width in pixels when resizing is enabled. */
  resizeWidth?: number
  /** Called while the resize handle is dragged or adjusted with arrow keys. */
  onResize?: (width: number) => void
  /** Accessible name for the resize handle. */
  resizeLabel?: string
  /** Smallest allowed width in pixels. @default 80 */
  minResizeWidth?: number
  /** Largest allowed width in pixels. @default 800 */
  maxResizeWidth?: number
}

function TableHead({
  className,
  pinned,
  pinOffset = 0,
  resizeWidth,
  onResize,
  resizeLabel = "调整列宽",
  minResizeWidth = 80,
  maxResizeWidth = 800,
  style,
  children,
  ...props
}: TableHeadProps) {
  const drag = React.useRef<{ pointerId: number; x: number; width: number } | null>(null)
  const clampWidth = (width: number) =>
    Math.round(Math.min(maxResizeWidth, Math.max(minResizeWidth, width)))

  return (
    <th
      data-slot="table-head"
      data-pinned={pinned}
      className={cn(
        "text-muted-foreground h-10 whitespace-nowrap px-4 text-left align-middle font-medium [&:has([role=checkbox])]:pr-0",
        pinned &&
          "bg-background group-hover/row:bg-muted/50 group-data-[state=selected]/row:bg-muted z-30",
        pinned === "left" && "border-r",
        pinned === "right" && "border-l",
        onResize && "relative pr-5",
        className
      )}
      style={{
        ...style,
        ...(pinned ? { position: "sticky" } : {}),
        ...(pinned === "left"
          ? { left: pinOffset, insetInlineStart: pinOffset }
          : {}),
        ...(pinned === "right"
          ? { right: pinOffset, insetInlineEnd: pinOffset }
          : {}),
      }}
      {...props}
    >
      {children}
      {onResize && (
        <span
          role="separator"
          tabIndex={0}
          aria-orientation="vertical"
          aria-label={resizeLabel}
          aria-valuemin={minResizeWidth}
          aria-valuemax={maxResizeWidth}
          aria-valuenow={resizeWidth}
          className="group/resize absolute inset-y-0 right-0 z-10 flex w-3 cursor-col-resize touch-none items-center justify-center outline-none before:h-4 before:w-px before:bg-border hover:before:bg-primary focus-visible:before:bg-primary active:before:bg-primary"
          onClick={(event) => event.stopPropagation()}
          onPointerDown={(event) => {
            if (event.pointerType === "mouse" && event.button !== 0) return
            event.preventDefault()
            event.stopPropagation()
            drag.current = {
              pointerId: event.pointerId,
              x: event.clientX,
              width: resizeWidth ?? event.currentTarget.parentElement?.getBoundingClientRect().width ?? minResizeWidth,
            }
            event.currentTarget.setPointerCapture(event.pointerId)
          }}
          onPointerMove={(event) => {
            if (!drag.current || drag.current.pointerId !== event.pointerId) return
            onResize(clampWidth(drag.current.width + event.clientX - drag.current.x))
          }}
          onPointerUp={(event) => {
            if (drag.current?.pointerId !== event.pointerId) return
            drag.current = null
            event.currentTarget.releasePointerCapture(event.pointerId)
          }}
          onPointerCancel={() => { drag.current = null }}
          onLostPointerCapture={() => { drag.current = null }}
          onKeyDown={(event) => {
            if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return
            event.preventDefault()
            event.stopPropagation()
            const currentWidth = resizeWidth ?? event.currentTarget.parentElement?.getBoundingClientRect().width ?? minResizeWidth
            onResize(clampWidth(currentWidth + (event.key === "ArrowRight" ? 1 : -1) * (event.shiftKey ? 10 : 1)))
          }}
        />
      )}
    </th>
  )
}

export interface TableCellProps extends React.ComponentProps<"td"> {
  /** Pins the column to an edge of the horizontal scroll container. */
  pinned?: "left" | "right"
  /** Distance from the pinned edge, useful when pinning multiple columns. @default 0 */
  pinOffset?: number | string
}

function TableCell({
  className,
  pinned,
  pinOffset = 0,
  style,
  ...props
}: TableCellProps) {
  return (
    <td
      data-slot="table-cell"
      data-pinned={pinned}
      className={cn(
        "whitespace-nowrap p-4 align-middle [&:has([role=checkbox])]:pr-0",
        pinned &&
          "bg-background group-hover/row:bg-muted/50 group-data-[state=selected]/row:bg-muted z-10",
        pinned === "left" && "border-r",
        pinned === "right" && "border-l",
        className
      )}
      style={{
        ...style,
        ...(pinned ? { position: "sticky" } : {}),
        ...(pinned === "left"
          ? { left: pinOffset, insetInlineStart: pinOffset }
          : {}),
        ...(pinned === "right"
          ? { right: pinOffset, insetInlineEnd: pinOffset }
          : {}),
      }}
      {...props}
    />
  )
}

export interface TableSortButtonProps extends React.ComponentProps<"button"> {
  /** Current sort direction for the column; `false` renders the idle state. @default false */
  direction?: "asc" | "desc" | false
}

/** Header button whose arrow fades in when active and rotates between ascending and descending. */
function TableSortButton({
  className,
  direction = false,
  children,
  ...props
}: TableSortButtonProps) {
  return (
    <button
      type="button"
      data-slot="table-sort-button"
      data-direction={direction || undefined}
      className={cn(
        "group/sort hover:text-foreground focus-visible:ring-ring/40 -mx-1.5 inline-flex h-7 items-center gap-1 rounded-sm px-1.5 font-medium outline-none transition-colors duration-150 focus-visible:ring-2 data-[direction]:text-foreground",
        className
      )}
      {...props}
    >
      {children}
      <svg
        aria-hidden
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={cn(
          "size-3.5 shrink-0 transition-[rotate,opacity] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
          direction === false && "opacity-35 group-hover/sort:opacity-70",
          direction === "desc" && "rotate-180"
        )}
      >
        <path d="M8 13V3M4 7l4-4 4 4" />
      </svg>
    </button>
  )
}

function TableCaption({
  className,
  ...props
}: React.ComponentProps<"caption">) {
  return (
    <caption
      data-slot="table-caption"
      className={cn("text-muted-foreground mt-4 text-sm", className)}
      {...props}
    />
  )
}

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
  TableSortButton,
  tableVariants,
}
