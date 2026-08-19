"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { AtSignIcon, HashIcon, SlashIcon } from "lucide-react"

import { cn } from "@/registry/lib/utils"

export interface MentionOption {
  /** 选项唯一标识值。 */
  id: string
  /** 选项展示主文本。 */
  label: string
  /** 补充描述信息。 */
  description?: string
  /** 自定义头像或图标。 */
  icon?: React.ReactNode
  /** 分组标签。 */
  group?: string
  /** 徽标标签。 */
  badge?: React.ReactNode
}

const mentionVariants = cva(
  "relative flex flex-col w-full rounded-xl border border-border bg-background transition-shadow duration-200 focus-within:ring-2 focus-within:ring-ring/35",
  {
    variants: {
      variant: {
        default: "shadow-xs",
        ghost: "border-transparent bg-muted/30 shadow-none",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface MentionProps
  extends Omit<React.ComponentProps<"div">, "onChange">,
    VariantProps<typeof mentionVariants> {
  /** 触发提及菜单的前缀字符（如 "@", "#", "/"）。 @default "@" */
  trigger?: string
  /** 可供匹配选择的候选提及列表。 */
  options?: MentionOption[]
  /** 当前输入框文本（受控模式）。 */
  value?: string
  /** 默认输入框文本（非受控模式）。 */
  defaultValue?: string
  /** 输入文本发生变动时的回调。 */
  onValueChange?: (value: string) => void
  /** 选中某项提及项时的回调函数。 */
  onSelectOption?: (option: MentionOption) => void
  /** 输入框占位提示文案。 */
  placeholder?: string
  /** 外观样式变体。 @default "default" */
  variant?: "default" | "ghost"
}

/** 提及输入组件，支持键入特定前缀（如 @ 或 #）快速检索并插入成员、标签或快捷指令。 */
function Mention({
  className,
  variant = "default",
  trigger = "@",
  options = [],
  value: controlledValue,
  defaultValue = "",
  onValueChange,
  onSelectOption,
  placeholder = "输入 @ 提及成员或技能...",
  ...props
}: MentionProps) {
  const [internalValue, setInternalValue] = React.useState(defaultValue)
  const [isOpen, setIsOpen] = React.useState(false)
  const [query, setQuery] = React.useState("")
  const [selectedIndex, setSelectedIndex] = React.useState(0)
  const inputRef = React.useRef<HTMLTextAreaElement>(null)

  const value = controlledValue !== undefined ? controlledValue : internalValue

  const filteredOptions = React.useMemo(() => {
    if (!query) return options
    const q = query.toLowerCase()
    return options.filter(
      (opt) =>
        opt.label.toLowerCase().includes(q) ||
        (opt.description && opt.description.toLowerCase().includes(q))
    )
  }, [options, query])

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const nextValue = e.target.value
    const cursor = e.target.selectionStart ?? 0
    const textBeforeCursor = nextValue.slice(0, cursor)
    const triggerIndex = textBeforeCursor.lastIndexOf(trigger)

    if (triggerIndex !== -1 && (triggerIndex === 0 || /\s/.test(textBeforeCursor[triggerIndex - 1]))) {
      const currentQuery = textBeforeCursor.slice(triggerIndex + 1)
      if (!/\s/.test(currentQuery)) {
        setQuery(currentQuery)
        setIsOpen(true)
        setSelectedIndex(0)
      } else {
        setIsOpen(false)
      }
    } else {
      setIsOpen(false)
    }

    if (controlledValue === undefined) {
      setInternalValue(nextValue)
    }
    onValueChange?.(nextValue)
  }

  const handleSelect = (option: MentionOption) => {
    const cursor = inputRef.current?.selectionStart ?? value.length
    const textBeforeCursor = value.slice(0, cursor)
    const triggerIndex = textBeforeCursor.lastIndexOf(trigger)
    const textAfterCursor = value.slice(cursor)

    const insertText = `${trigger}${option.label} `
    const newValue =
      triggerIndex !== -1
        ? value.slice(0, triggerIndex) + insertText + textAfterCursor
        : value + insertText

    if (controlledValue === undefined) {
      setInternalValue(newValue)
    }
    onValueChange?.(newValue)
    onSelectOption?.(option)
    setIsOpen(false)

    // Focus back to input
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus()
        const newPos = (triggerIndex !== -1 ? triggerIndex : cursor) + insertText.length
        inputRef.current.setSelectionRange(newPos, newPos)
      }
    }, 0)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (!isOpen || filteredOptions.length === 0) return

    if (e.key === "ArrowDown") {
      e.preventDefault()
      setSelectedIndex((prev) => (prev + 1) % filteredOptions.length)
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setSelectedIndex((prev) => (prev - 1 + filteredOptions.length) % filteredOptions.length)
    } else if (e.key === "Enter" || e.key === "Tab") {
      e.preventDefault()
      const selected = filteredOptions[selectedIndex]
      if (selected) {
        handleSelect(selected)
      }
    } else if (e.key === "Escape") {
      e.preventDefault()
      setIsOpen(false)
    }
  }

  return (
    <div
      data-slot="mention"
      className={cn(mentionVariants({ variant }), className)}
      {...props}
    >
      <textarea
        ref={inputRef}
        value={value}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        rows={3}
        className="w-full resize-none bg-transparent p-3 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground outline-none leading-relaxed"
      />

      {isOpen && filteredOptions.length > 0 && (
        <div
          data-slot="mention-list"
          className="absolute left-3 bottom-full mb-2 z-50 w-64 max-h-60 overflow-y-auto rounded-xl border border-border/80 bg-popover p-1 text-popover-foreground shadow-lg animate-in fade-in-0 zoom-in-95"
        >
          <div className="flex flex-col gap-0.5">
            {filteredOptions.map((opt, idx) => {
              const isSelected = idx === selectedIndex
              return (
                <button
                  key={opt.id}
                  type="button"
                  data-slot="mention-item"
                  data-selected={isSelected ? "true" : "false"}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  onClick={() => handleSelect(opt)}
                  className={cn(
                    "flex w-full items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-left text-xs transition-colors cursor-pointer outline-none",
                    isSelected ? "bg-muted text-foreground font-medium" : "text-muted-foreground hover:bg-muted/60"
                  )}
                >
                  <span className="flex size-4 shrink-0 items-center justify-center text-muted-foreground">
                    {opt.icon ?? (
                      trigger === "@" ? (
                        <AtSignIcon className="size-3.5" />
                      ) : trigger === "#" ? (
                        <HashIcon className="size-3.5" />
                      ) : (
                        <SlashIcon className="size-3.5" />
                      )
                    )}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <span className="truncate text-foreground font-medium">{opt.label}</span>
                      {opt.badge}
                    </div>
                    {opt.description && (
                      <p className="line-clamp-1 text-[11px] text-muted-foreground">
                        {opt.description}
                      </p>
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export interface MentionBadgeProps extends React.ComponentProps<"span"> {
  /** 提及前缀符号。 @default "@" */
  prefix?: string
}

function MentionBadge({
  className,
  prefix = "@",
  children,
  ...props
}: MentionBadgeProps) {
  return (
    <span
      data-slot="mention-badge"
      className={cn(
        "inline-flex items-center gap-0.5 rounded-md bg-primary/10 px-1.5 py-0.5 font-medium text-primary text-xs",
        className
      )}
      {...props}
    >
      <span className="opacity-70">{prefix}</span>
      <span>{children}</span>
    </span>
  )
}

export { Mention, MentionBadge, mentionVariants }
