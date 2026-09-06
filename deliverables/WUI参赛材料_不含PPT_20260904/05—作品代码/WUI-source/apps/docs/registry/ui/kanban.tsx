"use client"

import * as React from "react"
import { GripVerticalIcon } from "lucide-react"

import { cn } from "@/registry/lib/utils"

type KanbanMove = { itemId: string; from: string; to: string }
type KanbanContextValue = {
  drag: React.MutableRefObject<{ itemId: string; from: string } | null>
  onMove?: (move: KanbanMove) => void
}
type KanbanColumnContextValue = { value: string }

const KanbanContext = React.createContext<KanbanContextValue | null>(null)
const KanbanColumnContext =
  React.createContext<KanbanColumnContextValue | null>(null)

export interface KanbanProps extends React.ComponentProps<"div"> {
  /** Called when a card is dropped into another column. */
  onMove?: (move: KanbanMove) => void
}

/** A horizontally scrollable, composable board with native card dragging. */
function Kanban({ className, onMove, ...props }: KanbanProps) {
  const drag = React.useRef<{ itemId: string; from: string } | null>(null)
  return (
    <KanbanContext.Provider value={{ drag, onMove }}>
      <div
        data-slot="kanban"
        className={cn(
          "grid auto-cols-[minmax(17rem,1fr)] grid-flow-col gap-3 overflow-x-auto pb-2",
          className
        )}
        {...props}
      />
    </KanbanContext.Provider>
  )
}

export interface KanbanColumnProps extends React.ComponentProps<"section"> {
  /** Stable column identifier used by drag-and-drop. */
  value: string
}

function KanbanColumn({
  className,
  value,
  onDragOver,
  onDrop,
  ...props
}: KanbanColumnProps) {
  const context = React.useContext(KanbanContext)
  const [over, setOver] = React.useState(false)
  return (
    <KanbanColumnContext.Provider value={{ value }}>
      <section
        data-slot="kanban-column"
        data-over={over || undefined}
        className={cn(
          "bg-muted/25 data-[over=true]:border-ring data-[over=true]:bg-accent/50 flex min-h-72 flex-col rounded-lg border transition-colors",
          className
        )}
        onDragEnter={() => setOver(true)}
        onDragLeave={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node))
            setOver(false)
        }}
        onDragOver={(event) => {
          event.preventDefault()
          event.dataTransfer.dropEffect = "move"
          onDragOver?.(event)
        }}
        onDrop={(event) => {
          setOver(false)
          const current = context?.drag.current
          if (current && current.from !== value)
            context?.onMove?.({ ...current, to: value })
          if (context) context.drag.current = null
          onDrop?.(event)
        }}
        {...props}
      />
    </KanbanColumnContext.Provider>
  )
}

function KanbanColumnHeader({
  className,
  ...props
}: React.ComponentProps<"header">) {
  return (
    <header
      data-slot="kanban-column-header"
      className={cn(
        "flex min-h-12 items-center justify-between gap-3 border-b px-3.5",
        className
      )}
      {...props}
    />
  )
}

function KanbanColumnTitle({
  className,
  ...props
}: React.ComponentProps<"h3">) {
  return (
    <h3
      data-slot="kanban-column-title"
      className={cn("text-sm font-semibold tracking-tight", className)}
      {...props}
    />
  )
}

function KanbanColumnCount({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="kanban-column-count"
      className={cn(
        "bg-muted text-muted-foreground flex min-w-5 items-center justify-center rounded-full px-1.5 text-[11px] font-medium tabular-nums",
        className
      )}
      {...props}
    />
  )
}

function KanbanColumnBody({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="kanban-column-body"
      className={cn("flex flex-1 flex-col gap-2 p-2", className)}
      {...props}
    />
  )
}

export interface KanbanCardProps extends React.ComponentProps<"article"> {
  /** Stable card identifier supplied to onMove. */
  value: string
  /** Enable native drag-and-drop. @default true */
  draggable?: boolean
}

function KanbanCard({
  className,
  value,
  draggable = true,
  onDragStart,
  onDragEnd,
  children,
  ...props
}: KanbanCardProps) {
  const board = React.useContext(KanbanContext)
  const column = React.useContext(KanbanColumnContext)
  return (
    <article
      data-slot="kanban-card"
      draggable={draggable}
      className={cn(
        "bg-background shadow-xs hover:border-foreground/20 focus-visible:ring-ring/30 group relative cursor-default rounded-md border p-3 text-sm outline-none transition-[border-color,box-shadow,opacity] hover:shadow-sm focus-visible:ring-[3px] data-[dragging=true]:opacity-45",
        draggable && "cursor-grab active:cursor-grabbing",
        className
      )}
      onDragStart={(event) => {
        if (board && column)
          board.drag.current = { itemId: value, from: column.value }
        event.currentTarget.dataset.dragging = "true"
        event.dataTransfer.effectAllowed = "move"
        event.dataTransfer.setData("text/plain", value)
        onDragStart?.(event)
      }}
      onDragEnd={(event) => {
        delete event.currentTarget.dataset.dragging
        if (board) board.drag.current = null
        onDragEnd?.(event)
      }}
      tabIndex={0}
      {...props}
    >
      {draggable ? (
        <GripVerticalIcon
          aria-hidden
          className="text-muted-foreground/0 group-hover:text-muted-foreground absolute right-2 top-3 size-4 transition-colors"
        />
      ) : null}
      {children}
    </article>
  )
}

export type { KanbanMove }
export {
  Kanban,
  KanbanCard,
  KanbanColumn,
  KanbanColumnBody,
  KanbanColumnCount,
  KanbanColumnHeader,
  KanbanColumnTitle,
}
