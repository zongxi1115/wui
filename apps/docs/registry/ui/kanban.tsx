"use client"

import * as React from "react"
import {
  AnimatePresence,
  LayoutGroup,
  motion,
  useReducedMotion,
  type Transition,
} from "motion/react"
import { GripVerticalIcon } from "lucide-react"

import { cn } from "@/registry/lib/utils"

type KanbanMove = {
  itemId: string
  from: string
  to: string
  /** Final position of the card inside `to`, counted after it left `from`. */
  index: number
}

type DragSource = { itemId: string; from: string; index: number }
type DropTarget = { column: string; index: number; offset: number }

type KanbanContextValue = {
  rootRef: React.RefObject<HTMLDivElement | null>
  drag: React.RefObject<DragSource | null>
  draggingId: string | null
  setDraggingId: (id: string | null) => void
  target: DropTarget | null
  setTarget: React.Dispatch<React.SetStateAction<DropTarget | null>>
  grabbed: DragSource | null
  setGrabbed: (source: DragSource | null) => void
  pendingFocus: React.RefObject<string | null>
  ready: React.RefObject<boolean>
  known: React.RefObject<Set<string>>
  instructionsId: string
  move: (move: KanbanMove) => void
  announce: (message: string) => void
  endDrag: () => void
}
type KanbanColumnContextValue = { value: string }

const KanbanContext = React.createContext<KanbanContextValue | null>(null)
const KanbanColumnContext =
  React.createContext<KanbanColumnContextValue | null>(null)

const spring: Transition = {
  type: "spring",
  stiffness: 520,
  damping: 38,
  mass: 0.7,
}
const ease = [0.22, 1, 0.36, 1] as const

function useKanban() {
  return React.useContext(KanbanContext)!
}

function getColumns(root: HTMLElement) {
  return Array.from(
    root.querySelectorAll<HTMLElement>('[data-slot="kanban-column"]')
  )
}

function getItems(column: HTMLElement) {
  return Array.from(
    column.querySelectorAll<HTMLElement>('[data-slot="kanban-item"]')
  )
}

function getColumnTitle(column: HTMLElement) {
  return (
    column.querySelector('[data-slot="kanban-column-title"]')?.textContent ??
    column.dataset.value
  )
}

/**
 * Applies a KanbanMove to column-keyed state. Works for both cross-column
 * moves and reordering inside one column.
 */
function moveKanbanItem<T>(
  columns: Record<string, T[]>,
  move: KanbanMove,
  getId: (item: T) => string
): Record<string, T[]> {
  const item = columns[move.from].find((entry) => getId(entry) === move.itemId)
  if (!item) return columns
  const source = columns[move.from].filter(
    (entry) => getId(entry) !== move.itemId
  )
  const target = move.from === move.to ? [...source] : [...columns[move.to]]
  target.splice(move.index, 0, item)
  return { ...columns, [move.from]: source, [move.to]: target }
}

export interface KanbanProps extends React.ComponentProps<"div"> {
  /**
   * Called when a card is dropped into a new position, by pointer or keyboard.
   * `from === to` means the card was reordered inside its column.
   */
  onMove?: (move: KanbanMove) => void
}

/** A horizontally scrollable, composable board with pointer and keyboard card moves. */
function Kanban({ className, onMove, children, ...props }: KanbanProps) {
  const layoutId = React.useId()
  const instructionsId = React.useId()
  const rootRef = React.useRef<HTMLDivElement>(null)
  const drag = React.useRef<DragSource | null>(null)
  const pendingFocus = React.useRef<string | null>(null)
  const ready = React.useRef(false)
  const known = React.useRef(new Set<string>())
  const onMoveRef = React.useRef(onMove)
  const [draggingId, setDraggingId] = React.useState<string | null>(null)
  const [target, setTarget] = React.useState<DropTarget | null>(null)
  const [grabbed, setGrabbed] = React.useState<DragSource | null>(null)
  const [announcement, setAnnouncement] = React.useState("")

  React.useEffect(() => {
    onMoveRef.current = onMove
  })

  React.useEffect(() => {
    ready.current = true
  }, [])

  const context = React.useMemo<KanbanContextValue>(
    () => ({
      rootRef,
      drag,
      draggingId,
      setDraggingId,
      target,
      setTarget,
      grabbed,
      setGrabbed,
      pendingFocus,
      ready,
      known,
      instructionsId,
      move: (move) => onMoveRef.current?.(move),
      announce: setAnnouncement,
      endDrag: () => {
        drag.current = null
        setDraggingId(null)
        setTarget(null)
      },
    }),
    [draggingId, target, grabbed, instructionsId]
  )

  return (
    <KanbanContext.Provider value={context}>
      <div
        ref={rootRef}
        data-slot="kanban"
        className={cn(
          "grid auto-cols-[minmax(17rem,1fr)] grid-flow-col gap-3 overflow-x-auto pb-2",
          className
        )}
        {...props}
      >
        <LayoutGroup id={layoutId}>{children}</LayoutGroup>
        <p id={instructionsId} className="sr-only">
          按空格键拿起卡片，使用方向键移动，再次按空格键放下，按 Esc 取消。
        </p>
        <p aria-live="assertive" className="sr-only">
          {announcement}
        </p>
      </div>
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
  onDragLeave,
  onDrop,
  ...props
}: KanbanColumnProps) {
  const board = useKanban()
  const over = board.target?.column === value

  return (
    <KanbanColumnContext.Provider value={{ value }}>
      <section
        data-slot="kanban-column"
        data-value={value}
        data-over={over || undefined}
        className={cn(
          "bg-muted/25 data-[over=true]:border-primary/35 data-[over=true]:bg-primary/[0.035] flex min-h-72 flex-col rounded-lg border transition-colors duration-200",
          className
        )}
        onDragOver={(event) => {
          const source = board.drag.current
          if (source) {
            event.preventDefault()
            event.dataTransfer.dropEffect = "move"
            const column = event.currentTarget
            const body = column.querySelector<HTMLElement>(
              '[data-slot="kanban-column-body"]'
            )!
            const items = getItems(column).filter(
              (item) => item.dataset.value !== source.itemId
            )
            const rects = items.map((item) => item.getBoundingClientRect())
            const bodyTop = body.getBoundingClientRect().top
            let index = rects.findIndex(
              (rect) => event.clientY < rect.top + rect.height / 2
            )
            if (index === -1) index = rects.length
            const offset =
              rects.length === 0
                ? 6
                : index === 0
                  ? rects[0].top - bodyTop - 4
                  : index === rects.length
                    ? rects[index - 1].bottom - bodyTop + 4
                    : (rects[index - 1].bottom + rects[index].top) / 2 - bodyTop
            board.setTarget((current) =>
              current?.column === value &&
              current.index === index &&
              current.offset === offset
                ? current
                : { column: value, index, offset }
            )
          }
          onDragOver?.(event)
        }}
        onDragLeave={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node))
            board.setTarget((current) =>
              current?.column === value ? null : current
            )
          onDragLeave?.(event)
        }}
        onDrop={(event) => {
          event.preventDefault()
          const source = board.drag.current
          const target = board.target
          if (
            source &&
            target?.column === value &&
            !(source.from === value && source.index === target.index)
          ) {
            board.move({
              itemId: source.itemId,
              from: source.from,
              to: value,
              index: target.index,
            })
          }
          board.endDrag()
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

/** Column count that rolls up or down when the number changes. */
function KanbanColumnCount({
  className,
  children,
  ...props
}: React.ComponentProps<"span">) {
  const reduceMotion = useReducedMotion()
  const numeric = Number(children)
  const previous = React.useRef(numeric)
  const direction = numeric < previous.current ? -1 : 1

  React.useEffect(() => {
    previous.current = numeric
  }, [numeric])

  return (
    <span
      data-slot="kanban-column-count"
      className={cn(
        "bg-muted text-muted-foreground relative flex h-5 min-w-5 items-center justify-center overflow-hidden rounded-full px-1.5 text-[11px] font-medium tabular-nums",
        className
      )}
      {...props}
    >
      <AnimatePresence initial={false} mode="popLayout" custom={direction}>
        <motion.span
          key={String(children)}
          custom={direction}
          variants={{
            enter: (dir: number) => ({ y: dir * 10, opacity: 0 }),
            center: { y: 0, opacity: 1 },
            exit: (dir: number) => ({ y: dir * -10, opacity: 0 }),
          }}
          initial={reduceMotion ? false : "enter"}
          animate="center"
          exit={reduceMotion ? undefined : "exit"}
          transition={{ duration: 0.22, ease }}
        >
          {children}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}

function KanbanColumnBody({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  const board = useKanban()
  const column = React.useContext(KanbanColumnContext)!
  const reduceMotion = useReducedMotion()
  const target = board.target?.column === column.value ? board.target : null
  const source = board.drag.current
  const visible =
    target !== null &&
    !(source?.from === column.value && source.index === target.index)

  return (
    <div
      data-slot="kanban-column-body"
      className={cn("relative flex flex-1 flex-col gap-2 p-2", className)}
      {...props}
    >
      {children}
      <AnimatePresence>
        {visible ? (
          <motion.span
            aria-hidden
            data-slot="kanban-drop-indicator"
            className="bg-primary pointer-events-none absolute inset-x-2 top-0 h-0.5 rounded-full"
            initial={{ opacity: 0, y: target.offset - 1, scaleX: 0.6 }}
            animate={{ opacity: 1, y: target.offset - 1, scaleX: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.12 } }}
            transition={reduceMotion ? { duration: 0 } : spring}
          />
        ) : null}
      </AnimatePresence>
    </div>
  )
}

export interface KanbanCardProps extends React.ComponentProps<"article"> {
  /** Stable card identifier supplied to onMove. */
  value: string
  /** Enable pointer drag-and-drop and keyboard moves. @default true */
  draggable?: boolean
}

function KanbanCard({
  className,
  value,
  draggable = true,
  ref,
  onDragStart,
  onDragEnd,
  onKeyDown,
  onBlur,
  children,
  ...props
}: KanbanCardProps) {
  const board = useKanban()
  const column = React.useContext(KanbanColumnContext)!
  const reduceMotion = useReducedMotion()
  const cardRef = React.useRef<HTMLElement | null>(null)
  const [initial] = React.useState(() =>
    board.ready.current && !board.known.current.has(value) && !reduceMotion
      ? { opacity: 0, y: -6, scale: 0.98 }
      : false
  )
  const dragging = board.draggingId === value
  const grabbed = board.grabbed?.itemId === value

  React.useEffect(() => {
    board.known.current.add(value)
  }, [board.known, value])

  React.useEffect(() => {
    if (board.pendingFocus.current !== value) return
    board.pendingFocus.current = null
    cardRef.current?.focus()
  })

  function locate(element: HTMLElement) {
    const columnElement = element.closest<HTMLElement>(
      '[data-slot="kanban-column"]'
    )!
    const items = getItems(columnElement)
    return {
      columnElement,
      index: items.findIndex((item) => item.dataset.value === value),
      count: items.length,
    }
  }

  function moveByKeyboard(element: HTMLElement, key: string) {
    const { columnElement, index, count } = locate(element)
    const columns = getColumns(board.rootRef.current!)
    const columnIndex = columns.indexOf(columnElement)
    let destination = columnElement
    let nextIndex = index

    if (key === "ArrowUp") nextIndex = index - 1
    if (key === "ArrowDown") nextIndex = index + 1
    if (key === "ArrowLeft" || key === "ArrowRight") {
      const next = columns[columnIndex + (key === "ArrowLeft" ? -1 : 1)]
      if (!next) return
      destination = next
      nextIndex = Math.min(index, getItems(next).length)
    }
    if (destination === columnElement && (nextIndex < 0 || nextIndex >= count))
      return

    board.pendingFocus.current = value
    board.move({
      itemId: value,
      from: column.value,
      to: destination.dataset.value!,
      index: nextIndex,
    })
    board.announce(
      `已移动到「${getColumnTitle(destination)}」第 ${nextIndex + 1} 位`
    )
  }

  return (
    <motion.div
      data-slot="kanban-item"
      data-value={value}
      layout="position"
      layoutId={value}
      initial={initial}
      animate={{ opacity: 1, y: 0, scale: grabbed ? 1.02 : 1 }}
      transition={reduceMotion ? { duration: 0 } : spring}
      className={cn("relative", grabbed && "z-10")}
    >
      <article
        ref={(node) => {
          cardRef.current = node
          if (typeof ref === "function") ref(node)
          else if (ref) ref.current = node
        }}
        data-slot="kanban-card"
        data-dragging={dragging || undefined}
        data-grabbed={grabbed || undefined}
        draggable={draggable}
        tabIndex={0}
        aria-roledescription={draggable ? "可拖拽卡片" : undefined}
        aria-describedby={draggable ? board.instructionsId : undefined}
        className={cn(
          "bg-background shadow-xs hover:border-foreground/20 focus-visible:ring-ring/30 group/kanban-card relative cursor-default rounded-md border p-3 text-sm outline-none transition-[border-color,box-shadow,opacity] duration-200 hover:shadow-sm focus-visible:ring-[3px]",
          "data-[dragging=true]:border-dashed data-[dragging=true]:opacity-40 data-[dragging=true]:shadow-none",
          "data-[grabbed=true]:border-primary/40 data-[grabbed=true]:shadow-md",
          draggable && "cursor-grab active:cursor-grabbing",
          className
        )}
        onDragStart={(event) => {
          const { index } = locate(event.currentTarget)
          board.drag.current = { itemId: value, from: column.value, index }
          board.setGrabbed(null)
          event.dataTransfer.effectAllowed = "move"
          event.dataTransfer.setData("text/plain", value)
          // Defer the placeholder style so the browser's drag image keeps full opacity.
          requestAnimationFrame(() => {
            if (board.drag.current?.itemId === value) board.setDraggingId(value)
          })
          onDragStart?.(event)
        }}
        onDragEnd={(event) => {
          board.endDrag()
          onDragEnd?.(event)
        }}
        onKeyDown={(event) => {
          onKeyDown?.(event)
          if (
            event.defaultPrevented ||
            !draggable ||
            event.target !== event.currentTarget
          )
            return

          if (event.key === " " || event.key === "Enter") {
            event.preventDefault()
            if (grabbed) {
              board.setGrabbed(null)
              board.announce("已放下卡片")
            } else {
              const { index } = locate(event.currentTarget)
              board.setGrabbed({ itemId: value, from: column.value, index })
              board.announce("已拿起卡片，使用方向键移动")
            }
            return
          }
          if (!grabbed) return

          if (event.key === "Escape") {
            event.preventDefault()
            const origin = board.grabbed!
            const { index } = locate(event.currentTarget)
            if (origin.from !== column.value || origin.index !== index) {
              board.pendingFocus.current = value
              board.move({
                itemId: value,
                from: column.value,
                to: origin.from,
                index: origin.index,
              })
            }
            board.setGrabbed(null)
            board.announce("已取消移动")
            return
          }
          if (event.key.startsWith("Arrow")) {
            event.preventDefault()
            moveByKeyboard(event.currentTarget, event.key)
          }
        }}
        onBlur={(event) => {
          if (grabbed && board.pendingFocus.current !== value)
            board.setGrabbed(null)
          onBlur?.(event)
        }}
        {...props}
      >
        {draggable ? (
          <GripVerticalIcon
            aria-hidden
            className="text-muted-foreground absolute right-2 top-3 size-4 opacity-0 transition-opacity duration-200 group-hover/kanban-card:opacity-100 group-focus-visible/kanban-card:opacity-100"
          />
        ) : null}
        {children}
      </article>
    </motion.div>
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
  moveKanbanItem,
}
