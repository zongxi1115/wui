"use client"

import * as React from "react"
import { CalendarIcon, XIcon } from "lucide-react"
import { Popover as PopoverPrimitive } from "radix-ui"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import { cva } from "class-variance-authority"

import { Calendar } from "@/registry/ui/calendar"
import { cn } from "@/registry/lib/utils"

const datePickerVariants = cva(
  "bg-background shadow-xs hover:border-foreground/25 focus-within:border-ring focus-within:ring-ring/30 data-[placeholder=true]:text-muted-foreground group flex w-full items-center gap-2 rounded-md border text-left outline-none transition-[border-color,box-shadow] focus-within:ring-[3px] has-[button[aria-invalid=true]]:border-destructive has-[button[aria-invalid=true]]:ring-[3px] has-[button[aria-invalid=true]]:ring-destructive/20 data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50",
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

/** 安全解析 Date 对象或 YYYY-MM-DD 格式日期字符串 */
function parseDate(value: unknown): Date | undefined {
  if (!value) return undefined
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? undefined : value
  if (typeof value !== "string") return undefined
  const trimmed = value.trim()
  if (!trimmed) return undefined
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    const [year, month, day] = trimmed.split("-").map(Number)
    return new Date(year, month - 1, day)
  }
  const parsed = new Date(trimmed)
  return Number.isNaN(parsed.getTime()) ? undefined : parsed
}

/** 将 Date 对象格式化为标准 YYYY-MM-DD 字符串 */
function formatDate(date: Date | undefined): string {
  if (!date || Number.isNaN(date.getTime())) return ""
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

export interface DatePickerProps
  extends Omit<
    React.ComponentProps<"button">,
    "value" | "defaultValue" | "onChange"
  > {
  /** 选中的日期对象或 YYYY-MM-DD 字符串；传入后进入受控模式。 */
  value?: Date | string
  /** 非受控模式下的初始选中日期或字符串。 */
  defaultValue?: Date | string
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
  min?: Date | string
  /** 允许选择的最晚截止日期。 */
  max?: Date | string
  /** 自定义特定日期的禁用判定函数。 */
  disabledDate?: (date: Date) => boolean
  /** 尺寸密度。@default "default" */
  size?: "sm" | "default" | "lg"
  /** 显示在日历左侧的快捷日期，例如“今天”“下周一”。 */
  presets?: DatePickerPreset[]
}

export interface DatePickerPreset {
  /** 快捷项文本。 */
  label: string
  /** 点击后选中的日期。 */
  value: Date
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
  presets,
  disabled,
  onKeyDown,
  ...props
}: DatePickerProps) {
  const reduceMotion = useReducedMotion()
  const [open, setOpen] = React.useState(false)
  const [internalValue, setInternalValue] = React.useState<Date | undefined>(() =>
    parseDate(defaultValue)
  )
  const selected = parseDate(value) ?? internalValue

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

  const parsedMin = parseDate(min)
  const parsedMax = parseDate(max)

  return (
    <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
      <div
        data-slot="date-picker"
        data-placeholder={!selected || undefined}
        data-disabled={disabled || undefined}
        className={cn(datePickerVariants({ size }), className)}
      >
        <PopoverPrimitive.Trigger asChild>
          <button
            type="button"
            className="flex min-w-0 flex-1 items-center gap-2 self-stretch rounded-[inherit] text-left outline-none"
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
            <span className="relative flex min-w-0 flex-1 overflow-hidden">
              <AnimatePresence initial={false} mode="popLayout">
                <motion.span
                  key={label}
                  className="min-w-0 flex-1 truncate"
                  initial={reduceMotion ? false : { opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduceMotion ? undefined : { opacity: 0, y: -6 }}
                  transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                >
                  {label}
                </motion.span>
              </AnimatePresence>
            </span>
          </button>
        </PopoverPrimitive.Trigger>
        {selected && clearable && !disabled ? (
          <button
            type="button"
            data-slot="date-picker-clear"
            aria-label="清除已选日期"
            disabled={disabled}
            className="text-muted-foreground hover:bg-accent hover:text-foreground -mr-1 flex size-6 shrink-0 scale-75 items-center justify-center rounded-sm opacity-0 transition-[opacity,scale,color,background-color] duration-150 focus:scale-100 focus:opacity-100 group-hover:scale-100 group-hover:opacity-100"
            onClick={(event) => {
              event.stopPropagation()
              update(undefined)
            }}
          >
            <XIcon className="size-3.5" />
          </button>
        ) : null}
      </div>
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          sideOffset={6}
          align="start"
          data-slot="date-picker-content"
          className="bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0 data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-1 data-[side=top]:slide-in-from-bottom-1 z-50 flex origin-(--radix-popover-content-transform-origin) rounded-lg border shadow-md outline-none motion-reduce:animate-none"
        >
          {presets?.length ? (
            <div
              data-slot="date-picker-presets"
              role="group"
              aria-label="快捷日期"
              className="flex w-28 shrink-0 flex-col gap-0.5 border-r p-2"
            >
              {presets.map((preset) => {
                const active =
                  selected && formatDate(selected) === formatDate(preset.value)
                return (
                  <button
                    key={preset.label}
                    type="button"
                    aria-pressed={Boolean(active)}
                    className={cn(
                      "hover:bg-accent focus-visible:ring-ring/30 flex h-8 items-center rounded-md px-2.5 text-left text-sm outline-none transition-colors focus-visible:ring-[3px]",
                      active && "bg-accent text-accent-foreground font-medium"
                    )}
                    onClick={() => {
                      update(preset.value)
                      setOpen(false)
                    }}
                  >
                    {preset.label}
                  </button>
                )
              })}
            </div>
          ) : null}
          <Calendar
            value={selected}
            defaultMonth={selected}
            min={parsedMin}
            max={parsedMax}
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

export { DatePicker, datePickerVariants, parseDate, formatDate }
