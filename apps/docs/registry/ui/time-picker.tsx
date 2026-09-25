"use client"

import * as React from "react"
import { Clock3Icon } from "lucide-react"
import { motion, useReducedMotion } from "motion/react"
import { Popover as PopoverPrimitive } from "radix-ui"
import { cva } from "class-variance-authority"

import { cn } from "@/registry/lib/utils"
import { Button } from "@/registry/ui/button"
import { SlidingNumber } from "@/registry/ui/sliding-number"

function parseTime(value?: string) {
  const match = value?.match(/^(\d{1,2}):(\d{2})$/)
  if (!match) return { hour: 9, minute: 0 }
  return {
    hour: Math.min(23, Number(match[1])),
    minute: Math.min(59, Number(match[2])),
  }
}

function formatTime(hour: number, minute: number) {
  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`
}

const timePickerVariants = cva(
  "bg-background shadow-xs hover:border-foreground/25 focus-visible:border-ring focus-visible:ring-ring/30 aria-invalid:border-destructive aria-invalid:ring-[3px] aria-invalid:ring-destructive/20 data-[placeholder=true]:text-muted-foreground flex min-w-40 items-center gap-2 rounded-md border text-left outline-none transition-[border-color,box-shadow] duration-200 focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      size: {
        sm: "h-8 px-2.5 text-xs",
        default: "h-10 px-3 text-sm",
        lg: "h-12 px-4 text-base",
      },
    },
    defaultVariants: { size: "default" },
  }
)

const indicatorSpring = {
  type: "spring",
  stiffness: 520,
  damping: 38,
  mass: 0.7,
} as const

export interface TimePickerProps extends Omit<
  React.ComponentProps<"button">,
  "value" | "defaultValue" | "onChange"
> {
  /** 受控模式下的 24 小时制时间，格式为 HH:mm。 */
  value?: string
  /** 非受控模式下的初始时间。 */
  defaultValue?: string
  /** 点击“确定”后触发，返回 24 小时制 HH:mm 字符串。 */
  onValueChange?: (value: string) => void
  /** 展示 12 小时制或 24 小时制。@default 24 */
  hourCycle?: 12 | 24
  /** 分钟列的步进间隔。@default 5 */
  minuteStep?: 1 | 5 | 10 | 15 | 30
  /** 未选择时间时显示的占位文本。@default "选择时间" */
  placeholder?: string
  /** 尺寸密度。@default "default" */
  size?: "sm" | "default" | "lg"
  /** 是否在面板底部显示“此刻”快捷按钮。@default true */
  showNow?: boolean
}

/** 由时、分（及上下午）滚动列组成的紧凑时间选择器。 */
function TimePicker({
  className,
  value,
  defaultValue,
  onValueChange,
  hourCycle = 24,
  minuteStep = 5,
  placeholder = "选择时间",
  size = "default",
  showNow = true,
  disabled,
  ...props
}: TimePickerProps) {
  const [open, setOpen] = React.useState(false)
  const [internalValue, setInternalValue] = React.useState(defaultValue)
  const current = value ?? internalValue
  const parsed = parseTime(current)
  const [draft, setDraft] = React.useState(parsed)
  const period = draft.hour >= 12 ? "PM" : "AM"
  const shownHour = hourCycle === 12 ? draft.hour % 12 || 12 : draft.hour
  const hours =
    hourCycle === 12
      ? Array.from({ length: 12 }, (_, i) => i + 1)
      : Array.from({ length: 24 }, (_, i) => i)
  const minutes = React.useMemo(() => {
    const steps = Array.from(
      { length: Math.ceil(60 / minuteStep) },
      (_, i) => i * minuteStep
    )
    // 保留不在步进上的已有分钟值，避免已选时间在面板中“消失”。
    return steps.includes(draft.minute)
      ? steps
      : [...steps, draft.minute].sort((a, b) => a - b)
  }, [draft.minute, minuteStep])

  function changeOpen(nextOpen: boolean) {
    if (nextOpen) setDraft(parseTime(current))
    setOpen(nextOpen)
  }

  function commit(next = draft) {
    const formatted = formatTime(next.hour, next.minute)
    if (value === undefined) setInternalValue(formatted)
    onValueChange?.(formatted)
    setOpen(false)
  }

  function pickNow() {
    const now = new Date()
    const minute = Math.floor(now.getMinutes() / minuteStep) * minuteStep
    commit({ hour: now.getHours(), minute })
  }

  function chooseHour(next: number) {
    if (hourCycle === 24) setDraft((state) => ({ ...state, hour: next }))
    else
      setDraft((state) => ({
        ...state,
        hour: (next % 12) + (state.hour >= 12 ? 12 : 0),
      }))
  }

  const display = current
    ? new Intl.DateTimeFormat("zh-CN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: hourCycle === 12,
      }).format(new Date(2000, 0, 1, parsed.hour, parsed.minute))
    : placeholder

  return (
    <PopoverPrimitive.Root open={open} onOpenChange={changeOpen}>
      <PopoverPrimitive.Trigger asChild>
        <button
          type="button"
          data-slot="time-picker"
          data-size={size}
          data-placeholder={!current || undefined}
          className={cn(timePickerVariants({ size }), className)}
          disabled={disabled}
          {...props}
        >
          <Clock3Icon className="text-muted-foreground size-4 shrink-0" />
          <span className="flex-1 truncate tabular-nums">{display}</span>
        </button>
      </PopoverPrimitive.Trigger>
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          data-slot="time-picker-content"
          sideOffset={6}
          align="start"
          className="bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0 data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-1 data-[side=top]:slide-in-from-bottom-1 z-50 w-64 origin-(--radix-popover-content-transform-origin) rounded-lg border p-2 shadow-md outline-none motion-reduce:animate-none"
        >
          <div className="mb-2 flex items-center justify-between px-1.5 py-1">
            <span className="text-muted-foreground text-xs font-medium">
              设定时间
            </span>
            <span
              aria-live="polite"
              className="flex items-baseline gap-1 text-lg font-semibold tracking-tight"
            >
              <span className="inline-flex items-baseline tabular-nums">
                <SlidingNumber value={shownHour} padStart />
                <span className="text-muted-foreground mx-px">:</span>
                <SlidingNumber value={draft.minute} padStart />
              </span>
              {hourCycle === 12 ? (
                <span className="text-muted-foreground text-xs font-medium">
                  {period}
                </span>
              ) : null}
            </span>
          </div>
          <div
            className={cn(
              "grid gap-1 border-y py-2",
              hourCycle === 12 ? "grid-cols-3" : "grid-cols-2"
            )}
          >
            <TimeColumn
              label="时"
              values={hours}
              selected={shownHour}
              onSelect={chooseHour}
            />
            <TimeColumn
              label="分"
              values={minutes}
              selected={draft.minute}
              onSelect={(minute) => setDraft((state) => ({ ...state, minute }))}
            />
            {hourCycle === 12 ? (
              <TimeColumn
                label="上/下午"
                values={["AM", "PM"]}
                selected={period}
                  onSelect={(next) =>
                  setDraft((state) => ({
                    ...state,
                    hour:
                      next === "PM" ? (state.hour % 12) + 12 : state.hour % 12,
                  }))
                }
              />
            ) : null}
          </div>
          <div className="mt-2 flex items-center justify-between gap-2">
            {showNow ? (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-muted-foreground px-2"
                onClick={pickNow}
              >
                此刻
              </Button>
            ) : (
              <span />
            )}
            <Button
              type="button"
              size="sm"
              className="min-w-16"
              onClick={() => commit()}
            >
              确定
            </Button>
          </div>
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  )
}

function TimeColumn<T extends string | number>({
  label,
  values,
  selected,
  onSelect,
}: {
  label: string
  values: T[]
  selected: T
  onSelect: (value: T) => void
}) {
  const reduceMotion = useReducedMotion()
  const selectionId = React.useId()
  const listRef = React.useRef<HTMLDivElement>(null)
  const mounted = React.useRef(false)

  // 打开时把选中项瞬间定位到列中部，之后的切换平滑滚动。
  React.useEffect(() => {
    const list = listRef.current
    const target = list?.querySelector<HTMLElement>('[aria-selected="true"]')
    if (!list || !target) return
    const top = target.offsetTop - list.clientHeight / 2 + target.offsetHeight / 2
    list.scrollTo({
      top,
      behavior: mounted.current && !reduceMotion ? "smooth" : "auto",
    })
    mounted.current = true
  }, [reduceMotion, selected])

  function handleKeyDown(event: React.KeyboardEvent<HTMLButtonElement>, index: number) {
    const nextIndex =
      event.key === "ArrowDown"
        ? Math.min(index + 1, values.length - 1)
        : event.key === "ArrowUp"
          ? Math.max(index - 1, 0)
          : event.key === "Home"
            ? 0
            : event.key === "End"
              ? values.length - 1
              : -1
    if (nextIndex < 0) return
    event.preventDefault()
    onSelect(values[nextIndex])
    requestAnimationFrame(() =>
      listRef.current
        ?.querySelector<HTMLElement>('[aria-selected="true"]')
        ?.focus()
    )
  }

  return (
    <div>
      <div className="text-muted-foreground pb-1 text-center text-[10px] font-medium tracking-wider">
        {label}
      </div>
      <motion.div
        ref={listRef}
        role="listbox"
        aria-label={label}
        layoutScroll
        className="relative h-36 overflow-y-auto overscroll-contain px-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {values.map((item, index) => {
          const active = item === selected
          return (
            <button
              key={item}
              type="button"
              role="option"
              aria-selected={active}
              tabIndex={active ? 0 : -1}
              className={cn(
                "hover:bg-accent focus-visible:ring-ring/30 relative isolate mb-0.5 flex h-8 w-full items-center justify-center rounded-md text-sm tabular-nums outline-none transition-colors duration-150 focus-visible:ring-2",
                active && "text-primary-foreground hover:bg-transparent font-medium"
              )}
              onClick={() => onSelect(item)}
              onKeyDown={(event) => handleKeyDown(event, index)}
            >
              {active ? (
                <motion.span
                  aria-hidden
                  layoutId={`${selectionId}-selection`}
                  className="bg-primary absolute inset-0 z-[-1] rounded-md"
                  transition={reduceMotion ? { duration: 0 } : indicatorSpring}
                />
              ) : null}
              {typeof item === "number" ? String(item).padStart(2, "0") : item}
            </button>
          )
        })}
      </motion.div>
    </div>
  )
}

export { TimePicker, formatTime, parseTime, timePickerVariants }
