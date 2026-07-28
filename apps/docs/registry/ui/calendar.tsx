"use client"

import * as React from "react"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import { motion, useReducedMotion } from "motion/react"

import { cn } from "@/registry/lib/utils"

const WEEKDAYS = ["日", "一", "二", "三", "四", "五", "六"]

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

function sameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

function monthDays(month: Date) {
  const first = startOfMonth(month)
  const gridStart = new Date(first)
  gridStart.setDate(1 - first.getDay())
  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(gridStart)
    date.setDate(gridStart.getDate() + index)
    return date
  })
}

export interface CalendarProps extends Omit<
  React.ComponentProps<"div">,
  "onChange" | "defaultValue"
> {
  /** Selected date. */
  value?: Date
  /** Initially selected date in uncontrolled mode. */
  defaultValue?: Date
  /** Called when a day is selected. */
  onValueChange?: (date: Date) => void
  /** Visible month. */
  month?: Date
  /** Initial visible month in uncontrolled mode. */
  defaultMonth?: Date
  /** Called when month navigation changes the visible month. */
  onMonthChange?: (month: Date) => void
  /** Earliest selectable day. */
  min?: Date
  /** Latest selectable day. */
  max?: Date
  /** Custom disabled-day matcher. */
  disabled?: (date: Date) => boolean
  /** Show days from adjacent months. @default true */
  showOutsideDays?: boolean
  /** Locale used to format the month heading. @default "zh-CN" */
  locale?: string
}

/** An accessible single-month date grid with controlled and uncontrolled selection. */
function Calendar({
  className,
  value,
  defaultValue,
  onValueChange,
  month,
  defaultMonth,
  onMonthChange,
  min,
  max,
  disabled,
  showOutsideDays = true,
  locale = "zh-CN",
  ...props
}: CalendarProps) {
  const reduceMotion = useReducedMotion()
  const selectionId = React.useId()
  const gridRef = React.useRef<HTMLDivElement>(null)
  const [hover, setHover] = React.useState<{
    x: number
    y: number
    width: number
    height: number
  } | null>(null)
  const today = React.useMemo(() => new Date(), [])
  const [internalValue, setInternalValue] = React.useState(defaultValue)
  const selected = value ?? internalValue
  const [internalMonth, setInternalMonth] = React.useState(() =>
    startOfMonth(defaultMonth ?? value ?? defaultValue ?? today)
  )
  const visibleMonth = startOfMonth(month ?? internalMonth)
  const days = React.useMemo(
    () => monthDays(visibleMonth),
    [visibleMonth.getFullYear(), visibleMonth.getMonth()]
  )

  function setMonth(next: Date) {
    setHover(null)
    if (month === undefined) setInternalMonth(startOfMonth(next))
    onMonthChange?.(startOfMonth(next))
  }

  function isDisabled(date: Date) {
    const beforeMin = min
      ? date < new Date(min.getFullYear(), min.getMonth(), min.getDate())
      : false
    const afterMax = max
      ? date >
        new Date(max.getFullYear(), max.getMonth(), max.getDate(), 23, 59, 59)
      : false
    return beforeMin || afterMax || disabled?.(date) === true
  }

  function select(date: Date) {
    if (isDisabled(date)) return
    if (value === undefined) setInternalValue(date)
    onValueChange?.(date)
    if (date.getMonth() !== visibleMonth.getMonth()) setMonth(date)
  }

  function moveFocus(
    event: React.KeyboardEvent<HTMLButtonElement>,
    date: Date
  ) {
    const offsets: Record<string, number> = {
      ArrowLeft: -1,
      ArrowRight: 1,
      ArrowUp: -7,
      ArrowDown: 7,
    }
    const offset = offsets[event.key]
    if (!offset) return
    event.preventDefault()
    const next = new Date(date)
    next.setDate(date.getDate() + offset)
    const selector = `button[data-date="${next.getFullYear()}-${next.getMonth()}-${next.getDate()}"]`
    const root = event.currentTarget.closest('[data-slot="calendar"]')
    const button = root?.querySelector<HTMLButtonElement>(selector)
    if (button) button.focus()
    else {
      setMonth(next)
      requestAnimationFrame(() =>
        root?.querySelector<HTMLButtonElement>(selector)?.focus()
      )
    }
  }

  return (
    <div
      data-slot="calendar"
      className={cn("w-[19rem] select-none p-3", className)}
      {...props}
    >
      <div className="mb-3 flex items-center justify-between">
        <button
          type="button"
          aria-label="上个月"
          className="text-muted-foreground hover:bg-accent hover:text-foreground focus-visible:ring-ring/30 flex size-8 items-center justify-center rounded-md outline-none transition-colors focus-visible:ring-[3px]"
          onClick={() =>
            setMonth(
              new Date(
                visibleMonth.getFullYear(),
                visibleMonth.getMonth() - 1,
                1
              )
            )
          }
        >
          <ChevronLeftIcon className="size-4" />
        </button>
        <div
          aria-live="polite"
          className="text-sm font-semibold tracking-tight"
        >
          {new Intl.DateTimeFormat(locale, {
            year: "numeric",
            month: "long",
          }).format(visibleMonth)}
        </div>
        <button
          type="button"
          aria-label="下个月"
          className="text-muted-foreground hover:bg-accent hover:text-foreground focus-visible:ring-ring/30 flex size-8 items-center justify-center rounded-md outline-none transition-colors focus-visible:ring-[3px]"
          onClick={() =>
            setMonth(
              new Date(
                visibleMonth.getFullYear(),
                visibleMonth.getMonth() + 1,
                1
              )
            )
          }
        >
          <ChevronRightIcon className="size-4" />
        </button>
      </div>
      <div
        ref={gridRef}
        role="grid"
        aria-label="日期选择"
        className="relative grid grid-cols-7 gap-y-1"
        onPointerLeave={() => setHover(null)}
      >
        <motion.div
          aria-hidden
          className="bg-accent/70 pointer-events-none absolute z-0 rounded-md shadow-md"
          initial={false}
          animate={
            hover
              ? { ...hover, opacity: 1 }
              : { opacity: 0, width: 36, height: 36 }
          }
          transition={
            reduceMotion
              ? { duration: 0 }
              : { type: "spring", stiffness: 420, damping: 34, mass: 0.7 }
          }
        />
        {WEEKDAYS.map((day) => (
          <div
            key={day}
            role="columnheader"
            className="text-muted-foreground relative z-10 flex h-8 items-center justify-center text-[11px] font-medium"
            onPointerEnter={() => setHover(null)}
          >
            {day}
          </div>
        ))}
        {days.map((date) => {
          const outside = date.getMonth() !== visibleMonth.getMonth()
          const active = selected ? sameDay(date, selected) : false
          const current = sameDay(date, today)
          const unavailable = isDisabled(date)
          return (
            <div
              key={date.toISOString()}
              role="gridcell"
              className="relative z-10 flex items-center justify-center"
              onPointerEnter={(event) => {
                if (event.pointerType === "touch" || unavailable) {
                  setHover(null)
                  return
                }
                const grid = gridRef.current?.getBoundingClientRect()
                const cell = event.currentTarget.getBoundingClientRect()
                if (!grid) return
                setHover({
                  x: cell.left - grid.left,
                  y: cell.top - grid.top,
                  width: cell.width,
                  height: cell.height,
                })
              }}
            >
              <button
                type="button"
                data-date={`${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`}
                aria-selected={active}
                aria-current={current ? "date" : undefined}
                disabled={unavailable}
                tabIndex={active || (!selected && current) ? 0 : -1}
                className={cn(
                  "focus-visible:ring-ring/30 relative flex size-9 items-center justify-center rounded-md text-sm tabular-nums outline-none transition-colors focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-30",
                  outside && "text-muted-foreground/55",
                  outside && !showOutsideDays && "invisible",
                  current && !active && "font-semibold",
                  active && "text-primary-foreground font-medium"
                )}
                onClick={() => select(date)}
                onKeyDown={(event) => moveFocus(event, date)}
              >
                {current ? (
                  <motion.span
                    aria-hidden
                    className="bg-primary absolute left-1/2 z-0"
                    initial={false}
                    animate={
                      active
                        ? {
                            top: 0,
                            width: 36,
                            height: 36,
                            x: "-50%",
                            borderRadius: 6,
                            boxShadow: "0 8px 22px -10px var(--primary)",
                          }
                        : {
                            top: 31,
                            width: 4,
                            height: 4,
                            x: "-50%",
                            borderRadius: 999,
                            boxShadow: "0 0 0 0 var(--primary)",
                          }
                    }
                    transition={
                      reduceMotion
                        ? { duration: 0 }
                        : {
                            type: "spring",
                            stiffness: 520,
                            damping: 32,
                            mass: 0.65,
                          }
                    }
                  />
                ) : active ? (
                  <motion.span
                    aria-hidden
                    layoutId={`${selectionId}-selection`}
                    className="bg-primary absolute inset-0 z-0 rounded-md shadow-md"
                    transition={
                      reduceMotion
                        ? { duration: 0 }
                        : {
                            type: "spring",
                            stiffness: 460,
                            damping: 34,
                            mass: 0.7,
                          }
                    }
                  />
                ) : null}
                <span className="relative z-10">{date.getDate()}</span>
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export { Calendar, sameDay, startOfMonth }
