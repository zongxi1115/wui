"use client"

import * as React from "react"
import { CalendarIcon, XIcon } from "lucide-react"
import { Popover as PopoverPrimitive } from "radix-ui"
import { cva } from "class-variance-authority"

import { Calendar } from "@/registry/ui/calendar"
import { cn } from "@/registry/lib/utils"

const datePickerVariants = cva(
  "bg-background shadow-xs hover:border-foreground/25 focus-visible:border-ring focus-visible:ring-ring/30 data-[placeholder=true]:text-muted-foreground group flex w-full items-center gap-2 rounded-md border text-left outline-none transition-[border-color,box-shadow] focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      size: {
        sm: "h-8 min-w-44 px-2.5 text-xs",
        default: "h-10 min-w-56 px-3 text-sm",
        lg: "h-12 min-w-64 px-4 text-base",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

export interface DatePickerProps
  extends Omit<
    React.ComponentProps<"button">,
    "value" | "defaultValue" | "onChange"
  > {
  /** 选中的日期对象；传入后进入受控模式。 */
  value?: Date
  /** 非受控模式下的初始选中日期。 */
  defaultValue?: Date
  /** 选中日期或清空后触发的回调函数。 */
  onValueChange?: (date: Date | undefined) => void
  /** 未选择日期时的提示文案。@default "选择日期" */
  placeholder?: string
  /** 格式化日期语言环境代码。@default "zh-CN" */
  locale?: string
  /** Intl.DateTimeFormat 本地化格式化配置项。 */
  formatOptions?: Intl.DateTimeFormatOptions
  /** 是否允许一键清空选中日期。@default true */
  clearable?: boolean
  /** 允许选择的最早起始日期。 */
  min?: Date
  /** 允许选择的最晚截止日期。 */
  max?: Date
  /** 自定义特定日期的禁用判定函数。 */
  disabledDate?: (date: Date) => boolean
  /** 尺寸密度。@default "default" */
  size?: "sm" | "default" | "lg"
}

/** 基于日历浮层的现代化单日期选择控件。 */
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
  size = "default",
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
          className={cn(datePickerVariants({ size }), className)}
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
            <button
              type="button"
              data-slot="date-picker-clear"
              aria-label="清除已选日期"
              disabled={disabled}
              className="text-muted-foreground hover:bg-accent hover:text-foreground -mr-1 flex size-6 shrink-0 items-center justify-center rounded-sm opacity-0 transition-opacity focus:opacity-100 group-hover:opacity-100"
              onClick={(event) => {
                event.stopPropagation()
                update(undefined)
              }}
            >
              <XIcon className="size-3.5" />
            </button>
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

export { DatePicker, datePickerVariants }
