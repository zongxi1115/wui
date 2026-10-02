"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import {
  AtSignIcon,
  CornerDownLeftIcon,
  HashIcon,
  SlashIcon,
} from "lucide-react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"

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
  "relative flex w-full flex-col rounded-md border transition-[border-color,box-shadow,background-color] duration-200 ease-out focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/30 motion-reduce:transition-none",
  {
    variants: {
      variant: {
        default: "border-input bg-background shadow-xs",
        ghost: "border-transparent bg-muted/50 focus-within:bg-background",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface MentionProps
  extends
    Omit<React.ComponentProps<"div">, "onChange">,
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
  const reduceMotion = useReducedMotion()
  const baseId = React.useId()
  const listId = `${baseId}-list`
  const [internalValue, setInternalValue] = React.useState(defaultValue)
  const [isOpen, setIsOpen] = React.useState(false)
  const [query, setQuery] = React.useState("")
  const [selectedIndex, setSelectedIndex] = React.useState(0)
  const inputRef = React.useRef<HTMLTextAreaElement>(null)
  const listRef = React.useRef<HTMLDivElement>(null)

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

  const optionGroups = React.useMemo(() => {
    const groups: {
      label?: string
      items: { option: MentionOption; index: number }[]
    }[] = []

    filteredOptions.forEach((option, index) => {
      const previous = groups.at(-1)
      if (previous && previous.label === option.group) {
        previous.items.push({ option, index })
      } else {
        groups.push({ label: option.group, items: [{ option, index }] })
      }
    })

    return groups
  }, [filteredOptions])

  const showList = isOpen && filteredOptions.length > 0
  const activeOption = showList ? filteredOptions[selectedIndex] : undefined
  const optionId = (option: MentionOption) => `${baseId}-option-${option.id}`

  React.useEffect(() => {
    if (!activeOption) return
    listRef.current
      ?.querySelector(`[id="${CSS.escape(optionId(activeOption))}"]`)
      ?.scrollIntoView({ block: "nearest" })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeOption?.id])

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const nextValue = e.target.value
    const cursor = e.target.selectionStart ?? 0
    const textBeforeCursor = nextValue.slice(0, cursor)
    const triggerIndex = textBeforeCursor.lastIndexOf(trigger)

    if (
      triggerIndex !== -1 &&
      (triggerIndex === 0 || /\s/.test(textBeforeCursor[triggerIndex - 1]))
    ) {
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
        const newPos =
          (triggerIndex !== -1 ? triggerIndex : cursor) + insertText.length
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
      setSelectedIndex(
        (prev) => (prev - 1 + filteredOptions.length) % filteredOptions.length
      )
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
        onBlur={() => setIsOpen(false)}
        placeholder={placeholder}
        rows={3}
        role="combobox"
        aria-autocomplete="list"
        aria-expanded={showList}
        aria-controls={showList ? listId : undefined}
        aria-activedescendant={
          activeOption ? optionId(activeOption) : undefined
        }
        className="text-foreground placeholder:text-muted-foreground w-full resize-none bg-transparent px-3 py-2.5 text-sm leading-6 outline-none"
      />

      <AnimatePresence>
        {showList ? (
          <motion.div
            data-slot="mention-menu"
            className="bg-popover text-popover-foreground border-border/80 absolute bottom-full start-0 z-50 mb-2 w-80 max-w-full origin-bottom-left overflow-hidden rounded-lg border shadow-sm"
            initial={reduceMotion ? false : { opacity: 0, y: 6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={
              reduceMotion ? { opacity: 0 } : { opacity: 0, y: 4, scale: 0.98 }
            }
            transition={
              reduceMotion
                ? { duration: 0 }
                : { type: "spring", stiffness: 520, damping: 38, mass: 0.7 }
            }
            // Keep focus in the textarea while picking with the pointer.
            onMouseDown={(event) => event.preventDefault()}
          >
            <div
              ref={listRef}
              id={listId}
              role="listbox"
              aria-label="提及候选项"
              data-slot="mention-list"
              className="max-h-72 overflow-y-auto overscroll-contain p-1"
            >
              {optionGroups.map((group, groupIndex) => (
                <div
                  key={groupIndex}
                  role="group"
                  aria-labelledby={
                    group.label ? `${baseId}-group-${groupIndex}` : undefined
                  }
                  className="not-first:mt-2"
                >
                  {group.label ? (
                    <div
                      id={`${baseId}-group-${groupIndex}`}
                      data-slot="mention-group-label"
                      className="text-muted-foreground px-2 py-1.5 text-[11px] font-medium leading-4"
                    >
                      {group.label}
                    </div>
                  ) : null}
                  {group.items.map(({ option: opt, index: idx }) => {
                    const isSelected = idx === selectedIndex
                    return (
                      <div
                        key={opt.id}
                        id={optionId(opt)}
                        role="option"
                        aria-selected={isSelected}
                        data-slot="mention-item"
                        data-selected={isSelected ? "true" : "false"}
                        onMouseMove={() => {
                          if (!isSelected) setSelectedIndex(idx)
                        }}
                        onClick={() => handleSelect(opt)}
                        className={cn(
                          "flex w-full cursor-pointer items-center gap-3 rounded-sm px-2 py-2 text-start outline-none transition-colors duration-150 motion-reduce:transition-none",
                          isSelected && "bg-accent"
                        )}
                      >
                        <span
                          data-slot="mention-item-icon"
                          aria-hidden="true"
                          className="text-muted-foreground [&:has(>svg)]:bg-muted flex size-8 shrink-0 items-center justify-center [&:has(>svg)]:rounded-md [&>[data-slot=avatar]]:size-full [&>svg]:size-4"
                        >
                          {opt.icon ??
                            (trigger === "@" ? (
                              <AtSignIcon className="size-3.5" />
                            ) : trigger === "#" ? (
                              <HashIcon className="size-3.5" />
                            ) : (
                              <SlashIcon className="size-3.5" />
                            ))}
                        </span>
                        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                          <span
                            data-slot="mention-item-label"
                            className="text-foreground truncate text-[13px] font-medium leading-4"
                          >
                            {opt.label}
                          </span>
                          {opt.description && (
                            <p
                              data-slot="mention-item-description"
                              className="text-muted-foreground m-0 truncate text-xs leading-4"
                            >
                              {opt.description}
                            </p>
                          )}
                        </div>
                        <div className="flex shrink-0 items-center gap-2">
                          {opt.badge ? (
                            <span
                              data-slot="mention-item-badge"
                              className="inline-flex shrink-0 items-center"
                            >
                              {opt.badge}
                            </span>
                          ) : null}
                          <CornerDownLeftIcon
                            aria-hidden="true"
                            className={cn(
                              "text-muted-foreground/70 size-3.5",
                              !isSelected && "invisible"
                            )}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              ))}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
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
        "bg-primary/10 text-primary inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-xs font-medium",
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
