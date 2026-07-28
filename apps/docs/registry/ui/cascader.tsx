"use client"

import * as React from "react"
import { Popover as PopoverPrimitive } from "radix-ui"
import { CheckIcon, ChevronDownIcon, ChevronRightIcon } from "lucide-react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"

import { cn } from "@/registry/lib/utils"

export interface CascaderOption {
  /** Stable value stored in the selected path. */
  value: string
  /** Text displayed to the user. */
  label: React.ReactNode
  /** Nested options shown in the next column. */
  children?: CascaderOption[]
  /** Prevent this option from being selected. */
  disabled?: boolean
}

export interface CascaderProps extends Omit<
  React.ComponentProps<"button">,
  "value" | "defaultValue" | "onChange"
> {
  /** Hierarchical option tree. */
  options: CascaderOption[]
  /** Selected value path in controlled mode. */
  value?: string[]
  /** Initial value path in uncontrolled mode. */
  defaultValue?: string[]
  /** Called whenever the active path changes. */
  onValueChange?: (value: string[], options: CascaderOption[]) => void
  /** Placeholder shown before a complete path is selected. @default "Select a location" */
  placeholder?: string
  /** Separator placed between selected labels. @default " / " */
  separator?: React.ReactNode
  /** Close the panel after choosing a leaf option. @default true */
  closeOnSelect?: boolean
  /** Accessible label for the option panel. @default "Cascader options" */
  panelLabel?: string
  /** Extra classes applied to the floating panel. */
  contentClassName?: string
}

function resolvePath(options: CascaderOption[], values: string[]) {
  const resolved: CascaderOption[] = []
  let level = options

  for (const value of values) {
    const option = level.find((item) => item.value === value)
    if (!option) break
    resolved.push(option)
    level = option.children ?? []
  }

  return resolved
}

/** A compact multi-column picker for hierarchical values. */
function Cascader({
  className,
  options,
  value,
  defaultValue = [],
  onValueChange,
  placeholder = "Select a location",
  separator = " / ",
  closeOnSelect = true,
  panelLabel = "Cascader options",
  contentClassName,
  disabled,
  ...props
}: CascaderProps) {
  const reduceMotion = useReducedMotion()
  const [open, setOpen] = React.useState(false)
  const [internalValue, setInternalValue] = React.useState(defaultValue)
  const selectedValues = value ?? internalValue
  const selectedOptions = React.useMemo(
    () => resolvePath(options, selectedValues),
    [options, selectedValues]
  )

  const columns = React.useMemo(() => {
    const result: CascaderOption[][] = [options]
    for (const option of selectedOptions) {
      if (option.children?.length) result.push(option.children)
      else break
    }
    return result
  }, [options, selectedOptions])

  function selectOption(option: CascaderOption, depth: number) {
    if (option.disabled) return
    const nextValues = [...selectedValues.slice(0, depth), option.value]
    const nextOptions = resolvePath(options, nextValues)
    if (value === undefined) setInternalValue(nextValues)
    onValueChange?.(nextValues, nextOptions)
    if (!option.children?.length && closeOnSelect) setOpen(false)
  }

  return (
    <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
      <PopoverPrimitive.Trigger asChild>
        <button
          type="button"
          data-slot="cascader"
          data-placeholder={!selectedOptions.length || undefined}
          className={cn(
            "border-input bg-background shadow-xs hover:bg-accent/40 focus-visible:border-ring focus-visible:ring-ring/30 data-[placeholder=true]:text-muted-foreground group flex h-10 w-full min-w-56 items-center gap-2 rounded-md border px-3.5 text-left text-sm outline-none transition-[border-color,box-shadow,background-color] duration-200 ease-out focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50",
            className
          )}
          disabled={disabled}
          aria-haspopup="listbox"
          aria-expanded={open}
          {...props}
        >
          <span className="flex min-w-0 flex-1 items-center truncate">
            {selectedOptions.length
              ? selectedOptions.map((option, index) => (
                  <React.Fragment key={option.value}>
                    {index > 0 ? (
                      <span className="text-muted-foreground/60 mx-1.5">
                        {separator}
                      </span>
                    ) : null}
                    <span className="truncate">{option.label}</span>
                  </React.Fragment>
                ))
              : placeholder}
          </span>
          <motion.span
            animate={{ rotate: open ? 180 : 0 }}
            transition={
              reduceMotion
                ? { duration: 0 }
                : { type: "spring", stiffness: 520, damping: 32 }
            }
            className="text-muted-foreground"
          >
            <ChevronDownIcon className="size-4" />
          </motion.span>
        </button>
      </PopoverPrimitive.Trigger>

      <PopoverPrimitive.Portal>
        <AnimatePresence>
          {open ? (
            <PopoverPrimitive.Content
              forceMount
              asChild
              align="start"
              sideOffset={7}
              onOpenAutoFocus={(event) => event.preventDefault()}
            >
              <motion.div
                data-slot="cascader-content"
                role="listbox"
                aria-label={panelLabel}
                initial={
                  reduceMotion ? false : { opacity: 0, y: -6, scale: 0.98 }
                }
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={
                  reduceMotion ? undefined : { opacity: 0, y: -3, scale: 0.985 }
                }
                transition={
                  reduceMotion
                    ? { duration: 0 }
                    : {
                        type: "spring",
                        stiffness: 520,
                        damping: 38,
                        mass: 0.72,
                      }
                }
                className={cn(
                  "bg-popover text-popover-foreground z-50 flex max-w-[calc(100vw-2rem)] overflow-x-auto rounded-xl border p-1.5 shadow-lg outline-none",
                  contentClassName
                )}
              >
                <AnimatePresence initial={false} mode="popLayout">
                  {columns.map((column, depth) => (
                    <motion.div
                      key={depth}
                      data-slot="cascader-column"
                      aria-label={`Level ${depth + 1}`}
                      initial={reduceMotion ? false : { opacity: 0, x: 16 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={reduceMotion ? undefined : { opacity: 0, x: 8 }}
                      transition={
                        reduceMotion
                          ? { duration: 0 }
                          : { type: "spring", stiffness: 500, damping: 38 }
                      }
                      className={cn(
                        "w-44 shrink-0 p-1",
                        depth > 0 && "border-border/70 border-l"
                      )}
                    >
                      {column.map((option) => {
                        const active = selectedValues[depth] === option.value
                        const isLeaf = !option.children?.length
                        return (
                          <button
                            key={option.value}
                            type="button"
                            role="option"
                            aria-selected={active}
                            disabled={option.disabled}
                            onClick={() => selectOption(option, depth)}
                            className={cn(
                              "group/option hover:bg-accent focus-visible:bg-accent relative flex min-h-9 w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm outline-none transition-colors duration-150 disabled:pointer-events-none disabled:opacity-40",
                              active && "bg-accent text-accent-foreground"
                            )}
                          >
                            {active ? (
                              <motion.span
                                layoutId={`cascader-active-${depth}`}
                                className="bg-accent absolute inset-0 rounded-lg"
                                transition={{
                                  type: "spring",
                                  stiffness: 520,
                                  damping: 38,
                                }}
                              />
                            ) : null}
                            <span className="relative z-10 min-w-0 flex-1 truncate">
                              {option.label}
                            </span>
                            <span className="text-muted-foreground relative z-10 flex size-4 items-center justify-center">
                              {active && isLeaf ? (
                                <motion.span
                                  initial={
                                    reduceMotion
                                      ? false
                                      : { scale: 0.5, opacity: 0 }
                                  }
                                  animate={{ scale: 1, opacity: 1 }}
                                >
                                  <CheckIcon className="text-foreground size-4" />
                                </motion.span>
                              ) : !isLeaf ? (
                                <ChevronRightIcon className="size-4 transition-transform group-hover/option:translate-x-0.5" />
                              ) : null}
                            </span>
                          </button>
                        )
                      })}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            </PopoverPrimitive.Content>
          ) : null}
        </AnimatePresence>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  )
}

export { Cascader }
