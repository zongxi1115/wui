"use client"

import * as React from "react"
import { CheckIcon, Clock3Icon } from "lucide-react"
import { motion, useReducedMotion } from "motion/react"
import { Popover as PopoverPrimitive } from "radix-ui"

import { cn } from "@/registry/lib/utils"

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

export interface TimePickerProps extends Omit<
  React.ComponentProps<"button">,
  "value" | "defaultValue" | "onChange"
> {
  /** Time in 24-hour HH:mm format. */
  value?: string
  /** Initial time in uncontrolled mode. */
  defaultValue?: string
  /** Called with a 24-hour HH:mm value. */
  onValueChange?: (value: string) => void
  /** Display 12-hour or 24-hour time. @default 24 */
  hourCycle?: 12 | 24
  /** Minute interval. @default 5 */
  minuteStep?: 1 | 5 | 10 | 15 | 30
  /** Placeholder shown without a value. @default "选择时间" */
  placeholder?: string
}

/** A compact time picker with hour, minute, and meridiem columns. */
function TimePicker({
  className,
  value,
  defaultValue,
  onValueChange,
  hourCycle = 24,
  minuteStep = 5,
  placeholder = "选择时间",
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
  const minutes = Array.from(
    { length: Math.ceil(60 / minuteStep) },
    (_, i) => i * minuteStep
  )

  React.useEffect(() => {
    if (open) setDraft(parseTime(current))
  }, [open, current])

  function commit() {
    const next = formatTime(draft.hour, draft.minute)
    if (value === undefined) setInternalValue(next)
    onValueChange?.(next)
    setOpen(false)
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
    <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
      <PopoverPrimitive.Trigger asChild>
        <button
          type="button"
          data-slot="time-picker"
          data-placeholder={!current || undefined}
          className={cn(
            "bg-background shadow-xs hover:border-foreground/25 focus-visible:border-ring focus-visible:ring-ring/30 data-[placeholder=true]:text-muted-foreground flex h-9 min-w-40 items-center gap-2 rounded-md border px-3 text-left text-sm outline-none transition-[border-color,box-shadow] focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50",
            className
          )}
          disabled={disabled}
          {...props}
        >
          <Clock3Icon className="text-muted-foreground size-4" />
          <span className="flex-1 tabular-nums">{display}</span>
        </button>
      </PopoverPrimitive.Trigger>
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          sideOffset={6}
          align="start"
          className="bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0 data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95 z-50 w-64 rounded-lg border p-2 shadow-md outline-none"
        >
          <div className="mb-2 flex items-center justify-between px-1.5 py-1">
            <span className="text-muted-foreground text-xs font-medium">
              设定时间
            </span>
            <span className="text-lg font-semibold tabular-nums tracking-tight">
              {String(shownHour).padStart(2, "0")}:
              {String(draft.minute).padStart(2, "0")}{" "}
              {hourCycle === 12 ? period : ""}
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
                label="制"
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
          <button
            type="button"
            className="bg-primary text-primary-foreground focus-visible:ring-ring/30 mt-2 flex h-8 w-full items-center justify-center gap-1.5 rounded-md text-sm font-medium outline-none transition-opacity hover:opacity-90 focus-visible:ring-[3px]"
            onClick={commit}
          >
            <CheckIcon className="size-3.5" /> 确定
          </button>
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

  return (
    <div>
      <div className="text-muted-foreground pb-1 text-center text-[10px] font-medium uppercase tracking-wider">
        {label}
      </div>
      <div className="h-36 overflow-y-auto overscroll-contain px-1">
        {values.map((item) => (
          <button
            key={item}
            type="button"
            aria-pressed={item === selected}
            className={cn(
              "hover:bg-accent focus-visible:ring-ring/30 relative mb-0.5 flex h-8 w-full items-center justify-center rounded-md text-sm tabular-nums outline-none transition-colors focus-visible:ring-2",
              item === selected &&
                "text-primary-foreground hover:bg-transparent"
            )}
            onClick={() => onSelect(item)}
          >
            {item === selected ? (
              <motion.span
                aria-hidden
                layoutId={`${selectionId}-selection`}
                className="bg-primary absolute inset-0 rounded-md shadow-sm"
                transition={
                  reduceMotion
                    ? { duration: 0 }
                    : {
                        type: "spring",
                        stiffness: 500,
                        damping: 35,
                        mass: 0.65,
                      }
                }
              />
            ) : null}
            <span className="relative z-10">
              {typeof item === "number" ? String(item).padStart(2, "0") : item}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}

export { TimePicker, formatTime, parseTime }
