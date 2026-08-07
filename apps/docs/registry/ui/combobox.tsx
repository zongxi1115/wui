"use client"

import * as React from "react"
import { CheckIcon, ChevronsUpDownIcon, XIcon } from "lucide-react"

import { cn } from "@/registry/lib/utils"
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/registry/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/registry/ui/popover"

export interface ComboboxOption {
  /** 表单提交和受控状态中使用的稳定值。 */
  value: string
  /** 展示给用户的文本。 */
  label: React.ReactNode
  /** 参与模糊搜索的别名，例如拼音或缩写。 */
  keywords?: string[]
  /** 禁止选择此项。 */
  disabled?: boolean
}

export interface ComboboxProps extends Omit<
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
  contentClassName,
  disabled,
  ...props
}: ComboboxProps) {
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
        className={cn(
          "border-input bg-background shadow-xs focus-within:border-ring focus-within:ring-ring/30 flex h-10 w-full min-w-56 items-center rounded-md border transition-[border-color,box-shadow,background-color] duration-200 focus-within:ring-[3px] data-[disabled=true]:cursor-not-allowed data-[disabled=true]:opacity-50",
          className
        )}
      >
        <PopoverTrigger asChild>
          <button
            type="button"
            data-slot="combobox-trigger"
            role="combobox"
            aria-expanded={open}
            disabled={disabled}
            className="flex h-full min-w-0 flex-1 items-center gap-2 rounded-l-md px-3 text-left text-sm outline-none"
            {...props}
          >
            <span
              data-placeholder={!selectedOption || undefined}
              className="data-[placeholder=true]:text-muted-foreground min-w-0 flex-1 truncate"
            >
              {selectedOption?.label ?? placeholder}
            </span>
            <ChevronsUpDownIcon className="text-muted-foreground size-4 shrink-0" />
          </button>
        </PopoverTrigger>

        {clearable && selectedOption ? (
          <button
            type="button"
            data-slot="combobox-clear"
            aria-label="清空选择"
            disabled={disabled}
            className="text-muted-foreground hover:text-foreground focus-visible:ring-ring mr-2 flex size-6 shrink-0 items-center justify-center rounded-sm outline-none transition-colors focus-visible:ring-2"
            onClick={() => changeValue("")}
          >
            <XIcon className="size-3.5" />
          </button>
        ) : null}
      </div>

      <PopoverContent
        data-slot="combobox-content"
        align="start"
        className={cn(
          "w-[var(--radix-popover-trigger-width)] p-0",
          contentClassName
        )}
      >
        <Command>
          <CommandInput placeholder={searchPlaceholder} autoFocus />
          <CommandList>
            <CommandEmpty>{emptyText}</CommandEmpty>
            {options.map((option) => (
              <CommandItem
                key={option.value}
                value={option.value}
                keywords={[
                  typeof option.label === "string" ? option.label : "",
                  ...(option.keywords ?? []),
                ]}
                disabled={option.disabled}
                onSelect={() => {
                  changeValue(option.value)
                  setOpen(false)
                }}
              >
                <CheckIcon
                  className={cn(
                    "text-primary",
                    selectedValue !== option.value && "opacity-0"
                  )}
                />
                <span className="min-w-0 flex-1 truncate">{option.label}</span>
              </CommandItem>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export { Combobox }
