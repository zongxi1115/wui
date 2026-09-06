"use client"

import * as React from "react"
import { ChevronDownIcon, XIcon } from "lucide-react"
import { cva } from "class-variance-authority"

import { cn } from "@/registry/lib/utils"
import { Checkbox } from "@/registry/ui/checkbox"
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/registry/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/registry/ui/popover"

const multiSelectVariants = cva(
  "border-input bg-background shadow-xs focus-within:border-ring focus-within:ring-ring/30 has-[button[aria-invalid=true]]:border-destructive has-[button[aria-invalid=true]]:ring-[3px] has-[button[aria-invalid=true]]:ring-destructive/20 flex w-full items-center rounded-md border transition-[border-color,box-shadow,background-color] duration-200 focus-within:ring-[3px] data-[disabled=true]:cursor-not-allowed data-[disabled=true]:opacity-50",
  {
    variants: {
      size: {
        sm: "min-h-8 min-w-44 text-xs",
        default: "min-h-10 min-w-56 text-sm",
        lg: "min-h-12 min-w-64 text-base",
      },
    },
    defaultVariants: { size: "default" },
  }
)

export interface MultiSelectOption {
  /** 表单状态中使用的稳定值。 */
  value: string
  /** 展示给用户的选项名称。 */
  label: React.ReactNode
  /** 参与本地搜索的别名，例如拼音或缩写。 */
  keywords?: string[]
  /** 禁止选择此项。 */
  disabled?: boolean
}

export interface MultiSelectProps extends Omit<
  React.ComponentProps<"button">,
  "value" | "defaultValue" | "onChange" | "size"
> {
  /** 可供选择的选项集合。 */
  options: MultiSelectOption[]
  /** 受控模式下的选中值。 */
  value?: string[]
  /** 非受控模式下的初始选中值。 */
  defaultValue?: string[]
  /** 选中值发生变化时触发。 */
  onValueChange?: (value: string[]) => void
  /** 未选择任何选项时显示的文本。@default "请选择" */
  placeholder?: string
  /** 搜索框占位文本。@default "搜索选项" */
  searchPlaceholder?: string
  /** 没有匹配项时显示的内容。@default "没有匹配的选项" */
  emptyText?: React.ReactNode
  /** 触发器内最多直接展示多少个已选项。@default 2 */
  maxDisplay?: number
  /** 是否显示一键清空按钮。@default true */
  clearable?: boolean
  /** 尺寸密度。@default "default" */
  size?: "sm" | "default" | "lg"
  /** 应用于浮层的额外类名。 */
  contentClassName?: string
}

/** 支持搜索、键盘导航与批量清空的多选下拉组件。 */
function MultiSelect({
  className,
  options,
  value,
  defaultValue = [],
  onValueChange,
  placeholder = "请选择",
  searchPlaceholder = "搜索选项",
  emptyText = "没有匹配的选项",
  maxDisplay = 2,
  clearable = true,
  size = "default",
  contentClassName,
  disabled,
  ...props
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false)
  const [internalValue, setInternalValue] = React.useState(defaultValue)
  const selectedValue = value ?? internalValue
  const selectedSet = React.useMemo(() => new Set(selectedValue), [selectedValue])
  const selectedOptions = options.filter((option) => selectedSet.has(option.value))
  const visibleOptions = selectedOptions.slice(0, Math.max(0, maxDisplay))
  const hiddenCount = Math.max(0, selectedOptions.length - visibleOptions.length)

  function changeValue(nextValue: string[]) {
    if (value === undefined) setInternalValue(nextValue)
    onValueChange?.(nextValue)
  }

  function toggleValue(optionValue: string) {
    changeValue(
      selectedSet.has(optionValue)
        ? selectedValue.filter((current) => current !== optionValue)
        : [...selectedValue, optionValue]
    )
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <div
        data-slot="multi-select"
        data-disabled={disabled || undefined}
        data-placeholder={!selectedValue.length || undefined}
        className={cn(multiSelectVariants({ size }), className)}
      >
        <PopoverTrigger asChild>
          <button
            type="button"
            disabled={disabled}
            aria-haspopup="listbox"
            aria-expanded={open}
            className="flex min-h-[inherit] min-w-0 flex-1 items-center gap-1.5 px-3 text-left outline-none disabled:cursor-not-allowed"
            {...props}
          >
            <span className="flex min-w-0 flex-1 flex-wrap items-center gap-1.5 py-1">
              {visibleOptions.length ? (
                <>
                  {visibleOptions.map((option) => (
                    <span
                      key={option.value}
                      className="bg-secondary text-secondary-foreground inline-flex max-w-40 items-center truncate rounded-sm px-1.5 py-0.5 text-[0.85em] font-medium"
                    >
                      {option.label}
                    </span>
                  ))}
                  {hiddenCount ? (
                    <span className="bg-muted text-muted-foreground inline-flex rounded-sm px-1.5 py-0.5 text-[0.85em] font-medium tabular-nums">
                      +{hiddenCount}
                    </span>
                  ) : null}
                </>
              ) : (
                <span className="text-muted-foreground truncate">{placeholder}</span>
              )}
            </span>
            <ChevronDownIcon
              className={cn(
                "text-muted-foreground size-4 shrink-0 transition-transform duration-200",
                open && "rotate-180"
              )}
            />
          </button>
        </PopoverTrigger>

        {clearable && selectedValue.length ? (
          <button
            type="button"
            aria-label="清空选择"
            disabled={disabled}
            className="text-muted-foreground hover:text-foreground focus-visible:ring-ring mr-2 flex size-6 shrink-0 items-center justify-center rounded-sm outline-none transition-colors focus-visible:ring-2"
            onClick={() => changeValue([])}
          >
            <XIcon className="size-3.5" />
          </button>
        ) : null}
      </div>

      <PopoverContent
        data-slot="multi-select-content"
        align="start"
        className={cn(
          "w-[var(--radix-popover-trigger-width)] p-0",
          contentClassName
        )}
      >
        <Command>
          <CommandInput placeholder={searchPlaceholder} autoFocus />
          <CommandList aria-multiselectable="true">
            <CommandEmpty>{emptyText}</CommandEmpty>
            {options.map((option) => {
              const selected = selectedSet.has(option.value)
              return (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  keywords={[
                    typeof option.label === "string" ? option.label : "",
                    ...(option.keywords ?? []),
                  ]}
                  disabled={option.disabled}
                  aria-selected={selected}
                  onSelect={() => toggleValue(option.value)}
                >
                  <Checkbox
                    checked={selected}
                    size="sm"
                    tabIndex={-1}
                    aria-hidden="true"
                    className="pointer-events-none"
                  />
                  <span className="min-w-0 flex-1 truncate">{option.label}</span>
                </CommandItem>
              )
            })}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export { MultiSelect, multiSelectVariants }
