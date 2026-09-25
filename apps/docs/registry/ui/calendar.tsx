"use client"

import * as React from "react"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Variants,
} from "motion/react"

import { cn } from "@/registry/lib/utils"

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

function chunk<T>(items: T[], size: number) {
  return Array.from({ length: Math.ceil(items.length / size) }, (_, index) =>
    items.slice(index * size, index * size + size)
  )
}

function dateAttr(date: Date) {
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`
}

type CalendarView = "day" | "month" | "year"
type ViewTransition = { kind: "slide" | "zoom"; direction: 1 | -1 }

const EASE = [0.22, 1, 0.36, 1] as const

const viewVariants: Variants = {
  enter: ({ kind, direction }: ViewTransition) =>
    kind === "slide"
      ? { opacity: 0, x: direction * 28 }
      : { opacity: 0, scale: direction > 0 ? 1.08 : 0.92 },
  center: { opacity: 1, x: 0, scale: 1 },
  exit: ({ kind, direction }: ViewTransition) =>
    kind === "slide"
      ? { opacity: 0, x: direction * -28 }
      : { opacity: 0, scale: direction > 0 ? 0.92 : 1.08 },
}

const cellSpring = {
  type: "spring",
  stiffness: 520,
  damping: 38,
  mass: 0.7,
} as const

export interface CalendarProps extends Omit<
  React.ComponentProps<"div">,
  "onChange" | "defaultValue"
> {
  /** 受控模式下的选中日期。 */
  value?: Date
  /** 非受控模式下的初始选中日期。 */
  defaultValue?: Date
  /** 选中日期时触发。 */
  onValueChange?: (date: Date) => void
  /** 受控模式下的可见月份。 */
  month?: Date
  /** 非受控模式下的初始可见月份。 */
  defaultMonth?: Date
  /** 切换可见月份（含切换年份）时触发。 */
  onMonthChange?: (month: Date) => void
  /** 可选择的最早日期。 */
  min?: Date
  /** 可选择的最晚日期。 */
  max?: Date
  /** 自定义禁用日期判断。 */
  disabled?: (date: Date) => boolean
  /** 是否显示相邻月份的补齐日期。@default true */
  showOutsideDays?: boolean
  /** 标题、星期与月份名称使用的语言。@default "zh-CN" */
  locale?: string
  /** 是否允许点击标题切换到月份 / 年份视图。@default true */
  enableViewSwitch?: boolean
}

/** 支持方向感知切换、月份 / 年份视图与完整键盘操作的单月日历。 */
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
  enableViewSwitch = true,
  ...props
}: CalendarProps) {
  const reduceMotion = useReducedMotion()
  const selectionId = React.useId()
  const hoverRef = React.useRef<HTMLDivElement>(null)
  const [hover, setHover] = React.useState<{
    x: number
    y: number
    width: number
    height: number
    jump: boolean
  } | null>(null)
  const today = React.useMemo(() => new Date(), [])
  const [internalValue, setInternalValue] = React.useState(defaultValue)
  const selected = value ?? internalValue
  const [internalMonth, setInternalMonth] = React.useState(() =>
    startOfMonth(defaultMonth ?? value ?? defaultValue ?? today)
  )
  const [view, setView] = React.useState<CalendarView>("day")
  const [transition, setTransition] = React.useState<ViewTransition>({
    kind: "slide",
    direction: 1,
  })
  const visibleMonth = startOfMonth(month ?? internalMonth)
  const visibleYear = visibleMonth.getFullYear()
  const monthKey = `${visibleYear}-${visibleMonth.getMonth()}`
  const decadeStart = visibleYear - (visibleYear % 12)
  const days = React.useMemo(
    () => monthDays(visibleMonth),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [monthKey]
  )
  const weekdays = React.useMemo(() => {
    const sunday = new Date(2026, 7, 2)
    return Array.from({ length: 7 }, (_, index) => {
      const day = new Date(sunday)
      day.setDate(sunday.getDate() + index)
      return {
        short: new Intl.DateTimeFormat(locale, { weekday: "narrow" }).format(day),
        long: new Intl.DateTimeFormat(locale, { weekday: "long" }).format(day),
      }
    })
  }, [locale])
  const dayLabel = React.useMemo(
    () => new Intl.DateTimeFormat(locale, { dateStyle: "full" }),
    [locale]
  )

  const minDay = min
    ? new Date(min.getFullYear(), min.getMonth(), min.getDate())
    : undefined
  const maxDay = max
    ? new Date(max.getFullYear(), max.getMonth(), max.getDate(), 23, 59, 59)
    : undefined
  const transitionConfig = reduceMotion
    ? { duration: 0 }
    : { duration: 0.28, ease: EASE }

  function setMonth(next: Date, kind: ViewTransition["kind"] = "slide") {
    const start = startOfMonth(next)
    if (start.getTime() === visibleMonth.getTime()) return
    setHover(null)
    setTransition({ kind, direction: start > visibleMonth ? 1 : -1 })
    if (month === undefined) setInternalMonth(start)
    onMonthChange?.(start)
  }

  function switchView(next: CalendarView, direction: 1 | -1) {
    setHover(null)
    setTransition({ kind: "zoom", direction })
    setView(next)
  }

  function isDisabled(date: Date) {
    return (
      (minDay ? date < minDay : false) ||
      (maxDay ? date > maxDay : false) ||
      disabled?.(date) === true
    )
  }

  function isMonthDisabled(year: number, monthIndex: number) {
    const first = new Date(year, monthIndex, 1)
    const last = new Date(year, monthIndex + 1, 0, 23, 59, 59)
    return (maxDay ? first > maxDay : false) || (minDay ? last < minDay : false)
  }

  function isYearDisabled(year: number) {
    return (
      (maxDay ? year > maxDay.getFullYear() : false) ||
      (minDay ? year < minDay.getFullYear() : false)
    )
  }

  function select(date: Date) {
    if (isDisabled(date)) return
    if (value === undefined) setInternalValue(date)
    onValueChange?.(date)
    if (date.getMonth() !== visibleMonth.getMonth()) setMonth(date)
  }

  function step(direction: 1 | -1) {
    const offset = view === "day" ? 1 : view === "month" ? 12 : 144
    setMonth(
      new Date(visibleYear, visibleMonth.getMonth() + direction * offset, 1)
    )
  }

  function focusDate(root: Element | null, target: Date, gridKey: string) {
    const selector = `[data-calendar-grid="${gridKey}"] button[data-date="${dateAttr(target)}"]`
    requestAnimationFrame(() =>
      root?.querySelector<HTMLButtonElement>(selector)?.focus()
    )
  }

  function moveFocus(event: React.KeyboardEvent<HTMLButtonElement>, date: Date) {
    const next = new Date(date)
    switch (event.key) {
      case "ArrowLeft":
        next.setDate(date.getDate() - 1)
        break
      case "ArrowRight":
        next.setDate(date.getDate() + 1)
        break
      case "ArrowUp":
        next.setDate(date.getDate() - 7)
        break
      case "ArrowDown":
        next.setDate(date.getDate() + 7)
        break
      case "Home":
        next.setDate(date.getDate() - date.getDay())
        break
      case "End":
        next.setDate(date.getDate() + (6 - date.getDay()))
        break
      case "PageUp":
      case "PageDown": {
        const delta = (event.key === "PageUp" ? -1 : 1) * (event.shiftKey ? 12 : 1)
        const target = new Date(date.getFullYear(), date.getMonth() + delta, 1)
        const lastDay = new Date(
          target.getFullYear(),
          target.getMonth() + 1,
          0
        ).getDate()
        next.setTime(
          new Date(
            target.getFullYear(),
            target.getMonth(),
            Math.min(date.getDate(), lastDay)
          ).getTime()
        )
        break
      }
      default:
        return
    }
    event.preventDefault()
    const nextKey = `${next.getFullYear()}-${next.getMonth()}`
    if (nextKey !== monthKey) setMonth(next)
    focusDate(
      event.currentTarget.closest('[data-slot="calendar"]'),
      next,
      nextKey
    )
  }

  // 选中日期在当前月时聚焦选中日，否则依次回退到今天、本月第一天。
  const focusableDate =
    (selected && dateAttr(selected).startsWith(`${monthKey}-`)
      ? selected
      : undefined) ??
    (today.getFullYear() === visibleYear &&
    today.getMonth() === visibleMonth.getMonth()
      ? today
      : visibleMonth)

  const heading =
    view === "day"
      ? new Intl.DateTimeFormat(locale, { year: "numeric", month: "long" }).format(
          visibleMonth
        )
      : view === "month"
        ? new Intl.DateTimeFormat(locale, { year: "numeric" }).format(
            visibleMonth
          )
        : `${decadeStart} – ${decadeStart + 11}`

  const navLabel =
    view === "day" ? "月" : view === "month" ? "年" : "个 12 年"
  const panelKey =
    view === "day"
      ? `day-${monthKey}`
      : view === "month"
        ? `month-${visibleYear}`
        : `year-${decadeStart}`

  return (
    <div
      data-slot="calendar"
      data-view={view}
      className={cn("w-[19rem] select-none overflow-hidden p-3", className)}
      {...props}
    >
      <div className="mb-3 flex items-center justify-between gap-1">
        <button
          type="button"
          aria-label={`上一${navLabel}`}
          className="text-muted-foreground hover:bg-accent hover:text-foreground focus-visible:ring-ring/30 flex size-8 items-center justify-center rounded-md outline-none transition-colors focus-visible:ring-[3px]"
          onClick={() => step(-1)}
        >
          <ChevronLeftIcon className="size-4" />
        </button>
        <span className="sr-only" aria-live="polite">
          {heading}
        </span>
        <button
          type="button"
          disabled={!enableViewSwitch || view === "year"}
          aria-label={
            enableViewSwitch && view !== "year"
              ? `${heading}，切换到${view === "day" ? "月份" : "年份"}视图`
              : undefined
          }
          className="hover:bg-accent focus-visible:ring-ring/30 relative flex h-8 min-w-0 items-center justify-center overflow-hidden rounded-md px-2.5 text-sm font-semibold tracking-tight outline-none transition-colors focus-visible:ring-[3px] disabled:hover:bg-transparent"
          onClick={() => switchView(view === "day" ? "month" : "year", 1)}
        >
          <AnimatePresence initial={false} mode="popLayout">
            <motion.span
              key={heading}
              className="tabular-nums whitespace-nowrap"
              initial={
                reduceMotion
                  ? false
                  : transition.kind === "slide"
                    ? { opacity: 0, y: transition.direction * 8 }
                    : { opacity: 0, scale: 0.94 }
              }
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={
                reduceMotion
                  ? undefined
                  : transition.kind === "slide"
                    ? { opacity: 0, y: transition.direction * -8 }
                    : { opacity: 0, scale: 1.06 }
              }
              transition={transitionConfig}
            >
              {heading}
            </motion.span>
          </AnimatePresence>
        </button>
        <button
          type="button"
          aria-label={`下一${navLabel}`}
          className="text-muted-foreground hover:bg-accent hover:text-foreground focus-visible:ring-ring/30 flex size-8 items-center justify-center rounded-md outline-none transition-colors focus-visible:ring-[3px]"
          onClick={() => step(1)}
        >
          <ChevronRightIcon className="size-4" />
        </button>
      </div>

      {view === "day" ? (
        <div role="presentation" className="mb-1 grid grid-cols-7">
          {weekdays.map((day) => (
            <abbr
              key={day.long}
              title={day.long}
              className="text-muted-foreground flex h-8 items-center justify-center text-[11px] font-medium no-underline"
            >
              {day.short}
            </abbr>
          ))}
        </div>
      ) : null}

      <div
        ref={hoverRef}
        className="relative"
        onPointerLeave={() => setHover(null)}
      >
        <motion.div
          aria-hidden
          className="bg-accent pointer-events-none absolute left-0 top-0 z-0 rounded-md"
          initial={false}
          animate={
            hover
              ? {
                  x: hover.x,
                  y: hover.y,
                  width: hover.width,
                  height: hover.height,
                  opacity: 1,
                }
              : { opacity: 0 }
          }
          transition={
            reduceMotion || hover?.jump
              ? { duration: 0, opacity: { duration: 0.12 } }
              : { ...cellSpring, opacity: { duration: 0.12 } }
          }
        />
        <AnimatePresence
          initial={false}
          mode="popLayout"
          custom={transition}
        >
          <motion.div
            key={panelKey}
            custom={transition}
            variants={viewVariants}
            initial={reduceMotion ? false : "enter"}
            animate="center"
            exit={reduceMotion ? undefined : "exit"}
            transition={transitionConfig}
            className="relative z-10"
          >
            {view === "day" ? (
              <div
                role="grid"
                aria-label={heading}
                data-calendar-grid={monthKey}
                className="grid gap-y-1"
              >
                {chunk(days, 7).map((week) => (
                  <div
                    key={dateAttr(week[0])}
                    role="row"
                    className="grid grid-cols-7"
                  >
                    {week.map((date) => {
                      const outside =
                        date.getMonth() !== visibleMonth.getMonth()
                      const active = selected ? sameDay(date, selected) : false
                      const current = sameDay(date, today)
                      const unavailable = isDisabled(date)
                      const hidden = outside && !showOutsideDays
                      return (
                        <div
                          key={dateAttr(date)}
                          role="gridcell"
                          aria-selected={active || undefined}
                          className="flex items-center justify-center"
                          onPointerEnter={(event) => {
                            if (
                              event.pointerType === "touch" ||
                              unavailable ||
                              active ||
                              hidden
                            ) {
                              setHover(null)
                              return
                            }
                            const box = hoverRef.current?.getBoundingClientRect()
                            const cell = event.currentTarget.firstElementChild?.getBoundingClientRect()
                            if (!box || !cell) return
                            setHover((previous) => ({
                              x: cell.left - box.left,
                              y: cell.top - box.top,
                              width: cell.width,
                              height: cell.height,
                              jump: previous === null,
                            }))
                          }}
                        >
                          <button
                            type="button"
                            data-date={dateAttr(date)}
                            data-outside={outside || undefined}
                            aria-label={dayLabel.format(date)}
                            aria-current={current ? "date" : undefined}
                            disabled={unavailable}
                            tabIndex={
                              sameDay(date, focusableDate) && !outside ? 0 : -1
                            }
                            className={cn(
                              "focus-visible:ring-ring/30 relative isolate flex size-9 items-center justify-center rounded-md text-sm tabular-nums outline-none transition-colors duration-150 focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-30",
                              outside && "text-muted-foreground/55",
                              hidden && "invisible",
                              current && !active && "text-primary font-semibold",
                              active && "text-primary-foreground font-medium"
                            )}
                            onClick={() => select(date)}
                            onKeyDown={(event) => moveFocus(event, date)}
                          >
                            {active ? (
                              <motion.span
                                aria-hidden
                                layoutId={`${selectionId}-${monthKey}`}
                                className="bg-primary absolute inset-0 z-[-1] rounded-md"
                                initial={
                                  reduceMotion ? false : { scale: 0.8, opacity: 0 }
                                }
                                animate={{ scale: 1, opacity: 1 }}
                                transition={
                                  reduceMotion ? { duration: 0 } : cellSpring
                                }
                              />
                            ) : null}
                            {date.getDate()}
                            {current ? (
                              <span
                                aria-hidden
                                className={cn(
                                  "absolute bottom-1 left-1/2 size-1 -translate-x-1/2 rounded-full transition-colors",
                                  active ? "bg-primary-foreground" : "bg-primary"
                                )}
                              />
                            ) : null}
                          </button>
                        </div>
                      )
                    })}
                  </div>
                ))}
              </div>
            ) : (
              <div
                role="group"
                aria-label={heading}
                className="grid h-[17rem] grid-cols-3 grid-rows-4 gap-2"
              >
                {(view === "month"
                  ? Array.from({ length: 12 }, (_, index) => index)
                  : Array.from({ length: 12 }, (_, index) => decadeStart + index)
                ).map((item) => {
                  const isMonth = view === "month"
                  const label = isMonth
                    ? new Intl.DateTimeFormat(locale, { month: "short" }).format(
                        new Date(visibleYear, item, 1)
                      )
                    : String(item)
                  const active = isMonth
                    ? item === visibleMonth.getMonth()
                    : item === visibleYear
                  const current = isMonth
                    ? item === today.getMonth() &&
                      visibleYear === today.getFullYear()
                    : item === today.getFullYear()
                  const unavailable = isMonth
                    ? isMonthDisabled(visibleYear, item)
                    : isYearDisabled(item)
                  return (
                    <button
                      key={item}
                      type="button"
                      aria-pressed={active}
                      aria-current={current ? "date" : undefined}
                      disabled={unavailable}
                      className={cn(
                        "hover:bg-accent focus-visible:ring-ring/30 relative isolate flex items-center justify-center rounded-md text-sm tabular-nums outline-none transition-colors duration-150 focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-30",
                        current && !active && "text-primary font-semibold",
                        active &&
                          "text-primary-foreground font-medium hover:bg-transparent"
                      )}
                      onClick={() => {
                        if (isMonth) {
                          setMonth(new Date(visibleYear, item, 1), "zoom")
                          switchView("day", -1)
                        } else {
                          setMonth(
                            new Date(item, visibleMonth.getMonth(), 1),
                            "zoom"
                          )
                          switchView("month", -1)
                        }
                      }}
                    >
                      {active ? (
                        <motion.span
                          aria-hidden
                          layoutId={`${selectionId}-${panelKey}`}
                          className="bg-primary absolute inset-0 z-[-1] rounded-md"
                          transition={
                            reduceMotion ? { duration: 0 } : cellSpring
                          }
                        />
                      ) : null}
                      {label}
                    </button>
                  )
                })}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

export type CalendarEventTone =
  "primary" | "info" | "success" | "warning" | "neutral"

export interface CalendarEvent {
  /** Stable event identifier. */
  id: string
  /** Date on which the event is displayed. */
  date: Date
  /** Short event label. */
  title: string
  /** Optional time or supporting metadata. */
  meta?: string
  /** Semantic event color. @default "primary" */
  tone?: CalendarEventTone
}

export interface CalendarPanelProps extends Omit<
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
  /** Events rendered inside the month grid. */
  events?: CalendarEvent[]
  /** Maximum visible events in each day cell. @default 3 */
  maxVisibleEvents?: number
  /** Called when an event is activated. */
  onEventClick?: (event: CalendarEvent) => void
  /** Locale used for headings and weekday labels. @default "zh-CN" */
  locale?: string
}

const EVENT_TONES: Record<CalendarEventTone, string> = {
  primary: "bg-primary/9 text-primary hover:bg-primary/14",
  info: "bg-info/10 text-info hover:bg-info/15",
  success: "bg-success/10 text-success hover:bg-success/15",
  warning: "bg-warning/12 text-warning hover:bg-warning/17",
  neutral:
    "bg-muted text-muted-foreground hover:bg-accent hover:text-foreground",
}

function dateKey(date: Date) {
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`
}

/** A full-width month planner with event density, selection, and animated navigation. */
function CalendarPanel({
  className,
  value,
  defaultValue,
  onValueChange,
  month,
  defaultMonth,
  onMonthChange,
  events = [],
  maxVisibleEvents = 3,
  onEventClick,
  locale = "zh-CN",
  ...props
}: CalendarPanelProps) {
  const reduceMotion = useReducedMotion()
  const selectionId = React.useId()
  const today = React.useMemo(() => new Date(), [])
  const [internalValue, setInternalValue] = React.useState(defaultValue)
  const selected = value ?? internalValue
  const [internalMonth, setInternalMonth] = React.useState(() =>
    startOfMonth(defaultMonth ?? value ?? defaultValue ?? today)
  )
  const [direction, setDirection] = React.useState(0)
  const visibleMonth = startOfMonth(month ?? internalMonth)
  const days = React.useMemo(
    () => monthDays(visibleMonth),
    [visibleMonth.getFullYear(), visibleMonth.getMonth()]
  )
  const weekdays = React.useMemo(() => {
    const sunday = new Date(2026, 7, 2)
    return Array.from({ length: 7 }, (_, index) => {
      const day = new Date(sunday)
      day.setDate(sunday.getDate() + index)
      return new Intl.DateTimeFormat(locale, { weekday: "short" }).format(day)
    })
  }, [locale])
  const eventsByDate = React.useMemo(() => {
    const grouped = new Map<string, CalendarEvent[]>()
    events.forEach((event) => {
      const key = dateKey(event.date)
      grouped.set(key, [...(grouped.get(key) ?? []), event])
    })
    return grouped
  }, [events])

  function changeMonth(next: Date, nextDirection: number) {
    const start = startOfMonth(next)
    setDirection(nextDirection)
    if (month === undefined) setInternalMonth(start)
    onMonthChange?.(start)
  }

  function select(date: Date) {
    if (value === undefined) setInternalValue(date)
    onValueChange?.(date)
    if (startOfMonth(date).getTime() !== visibleMonth.getTime()) {
      changeMonth(date, date < visibleMonth ? -1 : 1)
    }
  }

  const monthLabel = new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "long",
  }).format(visibleMonth)

  return (
    <div
      data-slot="calendar-panel"
      className={cn("bg-background min-w-0 border", className)}
      {...props}
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b px-4 py-3">
        <div>
          <p className="text-muted-foreground text-xs font-medium">月视图</p>
          <h2
            aria-live="polite"
            className="relative mt-0.5 overflow-hidden text-lg font-semibold tracking-tight"
          >
            <AnimatePresence initial={false} mode="popLayout">
              <motion.span
                key={monthLabel}
                className="block whitespace-nowrap"
                initial={reduceMotion ? false : { opacity: 0, y: direction >= 0 ? 10 : -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduceMotion ? undefined : { opacity: 0, y: direction >= 0 ? -10 : 10 }}
                transition={reduceMotion ? { duration: 0 } : { duration: 0.26, ease: EASE }}
              >
                {monthLabel}
              </motion.span>
            </AnimatePresence>
          </h2>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            className="hover:bg-accent focus-visible:ring-ring/30 mr-2 h-8 rounded-md border px-3 text-sm font-medium outline-none transition-colors focus-visible:ring-[3px]"
            onClick={() => select(today)}
          >
            今天
          </button>
          <button
            type="button"
            aria-label="上个月"
            className="text-muted-foreground hover:bg-accent hover:text-foreground focus-visible:ring-ring/30 flex size-8 items-center justify-center rounded-md outline-none transition-colors focus-visible:ring-[3px]"
            onClick={() =>
              changeMonth(
                new Date(
                  visibleMonth.getFullYear(),
                  visibleMonth.getMonth() - 1,
                  1
                ),
                -1
              )
            }
          >
            <ChevronLeftIcon className="size-4" />
          </button>
          <button
            type="button"
            aria-label="下个月"
            className="text-muted-foreground hover:bg-accent hover:text-foreground focus-visible:ring-ring/30 flex size-8 items-center justify-center rounded-md outline-none transition-colors focus-visible:ring-[3px]"
            onClick={() =>
              changeMonth(
                new Date(
                  visibleMonth.getFullYear(),
                  visibleMonth.getMonth() + 1,
                  1
                ),
                1
              )
            }
          >
            <ChevronRightIcon className="size-4" />
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="relative min-w-[48rem]">
          <div className="bg-muted/25 grid grid-cols-7 border-b">
            {weekdays.map((weekday, index) => (
              <div
                key={`${weekday}-${index}`}
                role="columnheader"
                className="text-muted-foreground px-3 py-2 text-xs font-medium"
              >
                {weekday}
              </div>
            ))}
          </div>
          <AnimatePresence
            initial={false}
            mode="popLayout"
            custom={{ kind: "slide", direction: direction >= 0 ? 1 : -1 }}
          >
            <motion.div
              key={`${visibleMonth.getFullYear()}-${visibleMonth.getMonth()}`}
              role="grid"
              aria-label={monthLabel}
              className="grid grid-cols-7"
              custom={{ kind: "slide", direction: direction >= 0 ? 1 : -1 }}
              variants={viewVariants}
              initial={reduceMotion ? false : "enter"}
              animate="center"
              exit={reduceMotion ? undefined : "exit"}
              transition={
                reduceMotion ? { duration: 0 } : { duration: 0.26, ease: EASE }
              }
            >
              {chunk(days, 7).map((week) => (
                <div key={dateKey(week[0])} role="row" className="contents">
              {week.map((date) => {
                const outside = date.getMonth() !== visibleMonth.getMonth()
                const active = selected ? sameDay(date, selected) : false
                const current = sameDay(date, today)
                const dayEvents = eventsByDate.get(dateKey(date)) ?? []
                const visibleEvents = dayEvents.slice(0, maxVisibleEvents)
                const remaining = dayEvents.length - visibleEvents.length

                return (
                  <div
                    key={date.toISOString()}
                    role="gridcell"
                    aria-selected={active}
                    className={cn(
                      "hover:bg-accent/25 relative isolate min-h-28 border-b border-r p-2 transition-colors",
                      outside && "bg-muted/15 text-muted-foreground"
                    )}
                  >
                    {active ? (
                      <motion.div
                        aria-hidden
                        layoutId={`${selectionId}-panel-selection`}
                        className="border-primary pointer-events-none absolute inset-0 z-0 border-2"
                        transition={
                          reduceMotion
                            ? { duration: 0 }
                            : {
                                type: "spring",
                                stiffness: 360,
                                damping: 35,
                                mass: 0.75,
                              }
                        }
                      />
                    ) : null}
                    <div className="relative z-10 flex items-start justify-between">
                      <button
                        type="button"
                        aria-label={new Intl.DateTimeFormat(locale, {
                          month: "long",
                          day: "numeric",
                        }).format(date)}
                        aria-current={current ? "date" : undefined}
                        className={cn(
                          "focus-visible:ring-ring/40 flex size-7 items-center justify-center rounded-full text-xs font-medium tabular-nums outline-none transition-colors focus-visible:ring-2",
                          current && "bg-primary text-primary-foreground",
                          !current && "hover:bg-accent"
                        )}
                        onClick={() => select(date)}
                      >
                        {date.getDate()}
                      </button>
                      {dayEvents.length ? (
                        <span className="text-muted-foreground text-[10px] tabular-nums">
                          {dayEvents.length}
                        </span>
                      ) : null}
                    </div>
                    <div className="relative z-10 mt-1 grid gap-1">
                      {visibleEvents.map((event) => {
                        const eventClassName = cn(
                          "min-w-0 px-1.5 py-1 text-left text-[11px] leading-4 transition-colors",
                          EVENT_TONES[event.tone ?? "primary"]
                        )
                        const content = (
                          <>
                            {event.meta ? (
                              <span className="mr-1 opacity-70">
                                {event.meta}
                              </span>
                            ) : null}
                            <span className="font-medium">{event.title}</span>
                          </>
                        )

                        return onEventClick ? (
                          <button
                            type="button"
                            key={event.id}
                            className={eventClassName}
                            onClick={() => onEventClick(event)}
                          >
                            {content}
                          </button>
                        ) : (
                          <div key={event.id} className={eventClassName}>
                            {content}
                          </div>
                        )
                      })}
                      {remaining > 0 ? (
                        <span className="text-muted-foreground px-1.5 text-[11px] font-medium">
                          还有 {remaining} 项
                        </span>
                      ) : null}
                    </div>
                  </div>
                )
              })}
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

export { Calendar, CalendarPanel, sameDay, startOfMonth }
