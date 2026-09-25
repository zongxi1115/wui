"use client"

import * as React from "react"
import { CheckIcon, ChevronsUpDownIcon, XIcon } from "lucide-react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import { cva } from "class-variance-authority"

import { cn } from "@/registry/lib/utils"
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/registry/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/registry/ui/popover"

const comboboxVariants = cva(
  "border-input bg-background shadow-xs focus-within:border-ring focus-within:ring-ring/30 has-[button[aria-invalid=true]]:border-destructive has-[button[aria-invalid=true]]:ring-[3px] has-[button[aria-invalid=true]]:ring-destructive/20 flex w-full items-center rounded-md border transition-[border-color,box-shadow,background-color] duration-200 focus-within:ring-[3px] data-[disabled=true]:cursor-not-allowed data-[disabled=true]:opacity-50",
  {
    variants: {
      size: {
        sm: "h-8 min-w-44 text-xs",
        default: "h-10 min-w-56 text-sm",
        lg: "h-12 min-w-64 text-base",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

export interface ComboboxOption {
  /** 表单提交和受控状态中使用的稳定值。 */
  value: string
  /** 展示给用户的文本或自定义内容。 */
  label: React.ReactNode
  /** 选项辅助描述信息。 */
  description?: React.ReactNode
  /** 参与模糊搜索的别名，例如拼音、缩写或关键词。 */
  keywords?: string[]
  /** 禁止选择此项。 */
  disabled?: boolean
}

export interface ComboboxProps
  extends Omit<
    React.ComponentProps<"button">,
    "value" | "defaultValue" | "onChange"
  > {
  /** 可搜索的选项集合。 */
  options: ComboboxOption[]
  /** 受控模式下的选中值。 */
  value?: string
  /** 非受控模式下的初始选中值。 */
  defaultValue?: string
  /** 选中值变化或清空时触发。 */
  onValueChange?: (value: string) => void
  /** 未选中时显示的文本。@default "请选择" */
  placeholder?: string
  /** 搜索框占位文本。@default "搜索选项" */
  searchPlaceholder?: string
  /** 没有匹配项时显示的文本。@default "没有匹配的选项" */
  emptyText?: React.ReactNode
  /** 是否显示清空按钮。@default true */
  clearable?: boolean
  /** 尺寸密度。@default "default" */
  size?: "sm" | "default" | "lg"
  /** 应用于浮层的额外类名。 */
  contentClassName?: string
}

/** 由 Popover 与 Command 组合而成的可搜索单选器。 */
function Combobox({
  className,
  options,
  value,
  defaultValue = "",
  onValueChange,
  placeholder = "请选择",
  searchPlaceholder = "搜索选项",
  emptyText = "没有匹配的选项",
  clearable = true,
  size = "default",
  contentClassName,
  disabled,
  ...props
}: ComboboxProps) {
  const reduceMotion = useReducedMotion()
  const [open, setOpen] = React.useState(false)
  const [internalValue, setInternalValue] = React.useState(defaultValue)
  const selectedValue = value ?? internalValue
  const selectedOption = options.find(
    (option) => option.value === selectedValue
  )

  function changeValue(nextValue: string) {
    if (value === undefined) setInternalValue(nextValue)
    onValueChange?.(nextValue)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <div
        data-slot="combobox"
        data-disabled={disabled || undefined}
        className={cn(comboboxVariants({ size }), className)}
      >
        <PopoverTrigger asChild>
          <button
            type="button"
            data-slot="combobox-trigger"
            role="combobox"
            aria-expanded={open}
            disabled={disabled}
            className="flex h-full min-w-0 flex-1 items-center gap-2 rounded-l-md px-3 text-left outline-none"
            {...props}
          >
            <span className="relative flex min-w-0 flex-1 overflow-hidden">
              <AnimatePresence initial={false} mode="popLayout">
                <motion.span
                  key={selectedOption?.value ?? "__placeholder"}
                  data-placeholder={!selectedOption || undefined}
                  className="data-[placeholder=true]:text-muted-foreground min-w-0 flex-1 truncate"
                  initial={reduceMotion ? false : { opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduceMotion ? undefined : { opacity: 0, y: -6 }}
                  transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                >
                  {selectedOption?.label ?? placeholder}
                </motion.span>
              </AnimatePresence>
            </span>
            <ChevronsUpDownIcon className="text-muted-foreground size-4 shrink-0" />
          </button>
        </PopoverTrigger>

        <AnimatePresence initial={false}>
          {clearable && selectedOption ? (
            <motion.button
              type="button"
              data-slot="combobox-clear"
              aria-label="清空选择"
              disabled={disabled}
              className="text-muted-foreground hover:bg-accent hover:text-foreground focus-visible:ring-ring/40 mr-2 flex size-6 shrink-0 items-center justify-center rounded-sm outline-none transition-colors focus-visible:ring-2"
              initial={reduceMotion ? false : { opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={reduceMotion ? undefined : { opacity: 0, scale: 0.6 }}
              transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => {
                e.stopPropagation()
                changeValue("")
              }}
            >
              <XIcon className="size-3.5" />
            </motion.button>
          ) : null}
        </AnimatePresence>
      </div>

      <PopoverContent
        data-slot="combobox-content"
        align="start"
        className={cn(
          "w-[var(--radix-popover-trigger-width)] origin-(--radix-popover-content-transform-origin) p-0",
          contentClassName
        )}
      >
        <Command defaultActiveValue={selectedValue || undefined}>
          <CommandInput placeholder={searchPlaceholder} autoFocus />
          <CommandList>
            <CommandEmpty>{emptyText}</CommandEmpty>
            {options.map((option) => (
              <CommandItem
                key={option.value}
                value={option.value}
                keywords={[
                  typeof option.label === "string" ? option.label : "",
                  ...(typeof option.description === "string" ? [option.description] : []),
                  ...(option.keywords ?? []),
                ]}
                disabled={option.disabled}
                onSelect={() => {
                  changeValue(option.value)
                  setOpen(false)
                }}
              >
                <span className="flex size-4 shrink-0 items-center justify-center">
                  {selectedValue === option.value ? (
                    <motion.span
                      initial={reduceMotion ? false : { scale: 0.4, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: "spring", stiffness: 560, damping: 28, mass: 0.6 }}
                    >
                      <CheckIcon className="text-primary" />
                    </motion.span>
                  ) : null}
                </span>
                <div className="flex min-w-0 flex-1 flex-col">
                  <span className="truncate font-medium">{option.label}</span>
                  {option.description ? (
                    <span className="text-muted-foreground truncate text-xs">
                      {option.description}
                    </span>
                  ) : null}
                </div>
              </CommandItem>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export { Combobox, comboboxVariants }
