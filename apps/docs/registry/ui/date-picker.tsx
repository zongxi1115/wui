"use client"

import * as React from "react"
import { CalendarIcon, XIcon } from "lucide-react"
import { Popover as PopoverPrimitive } from "radix-ui"

import { Calendar } from "@/registry/ui/calendar"
import { cn } from "@/registry/lib/utils"

export interface DatePickerProps extends Omit<
  React.ComponentProps<"button">,
  "value" | "defaultValue" | "onChange"
> {
  /** Selected date. */
  value?: Date
  /** Initially selected date in uncontrolled mode. */
  defaultValue?: Date
  /** Called after a date is selected or cleared. */
  onValueChange?: (date: Date | undefined) => void
  /** Placeholder shown without a value. @default "选择日期" */
  placeholder?: string
  /** Date formatting locale. @default "zh-CN" */
  locale?: string
  /** Intl date formatting options. */
  formatOptions?: Intl.DateTimeFormatOptions
  /** Allow clearing the current selection. @default true */
  clearable?: boolean
  /** Earliest selectable day. */
  min?: Date
  /** Latest selectable day. */
  max?: Date
  /** Custom disabled-day matcher. */
  disabledDate?: (date: Date) => boolean
}

/** A popover date picker composed from the WUI Calendar. */
function DatePicker({
  className,
  value,
  defaultValue,
  onValueChange,
  placeholder = "选择日期",
  locale = "zh-CN",
  formatOptions,
  clearable = true,
  min,
  max,
  disabledDate,
  disabled,
  onKeyDown,
  ...props
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false)
  const [internalValue, setInternalValue] = React.useState(defaultValue)
  const selected = value ?? internalValue

  function update(next: Date | undefined) {
    if (value === undefined) setInternalValue(next)
    onValueChange?.(next)
  }

  const label = selected
    ? new Intl.DateTimeFormat(
        locale,
        formatOptions ?? { year: "numeric", month: "long", day: "numeric" }
      ).format(selected)
    : placeholder

  return (
    <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
      <PopoverPrimitive.Trigger asChild>
        <button
          type="button"
          data-slot="date-picker"
          data-placeholder={!selected || undefined}
          className={cn(
            "bg-background shadow-xs hover:border-foreground/25 focus-visible:border-ring focus-visible:ring-ring/30 data-[placeholder=true]:text-muted-foreground group flex h-9 min-w-56 items-center gap-2 rounded-md border px-3 text-left text-sm outline-none transition-[border-color,box-shadow] focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50",
            className
          )}
          disabled={disabled}
          onKeyDown={(event) => {
            onKeyDown?.(event)
            if (
              !event.defaultPrevented &&
              selected &&
              clearable &&
              (event.key === "Delete" || event.key === "Backspace")
            ) {
              event.preventDefault()
              update(undefined)
            }
          }}
          {...props}
        >
          <CalendarIcon className="text-muted-foreground size-4 shrink-0" />
          <span className="min-w-0 flex-1 truncate">{label}</span>
          {selected && clearable ? (
            <span
              aria-hidden
              className="text-muted-foreground hover:bg-accent hover:text-foreground -mr-1 flex size-6 items-center justify-center rounded-sm opacity-0 transition-opacity focus:opacity-100 group-hover:opacity-100"
              onClick={(event) => {
                event.stopPropagation()
                update(undefined)
              }}
            >
              <XIcon className="size-3.5" />
            </span>
          ) : null}
        </button>
      </PopoverPrimitive.Trigger>
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          sideOffset={6}
          align="start"
          className="bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0 data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95 z-50 rounded-lg border shadow-md outline-none"
        >
          <Calendar
            value={selected}
            defaultMonth={selected}
            min={min}
            max={max}
            disabled={disabledDate}
            locale={locale}
            onValueChange={(date) => {
              update(date)
              setOpen(false)
            }}
          />
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  )
}

export { DatePicker }
