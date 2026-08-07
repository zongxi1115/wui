"use client"

import * as React from "react"
import { Popover as PopoverPrimitive } from "radix-ui"
import {
  CheckIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  SearchIcon,
} from "lucide-react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"

import { cn } from "@/registry/lib/utils"
import { Input } from "@/registry/ui/input"

export interface CascaderOption {
  /** 选中路径中保存的稳定值。 */
  value: string
  /** 展示给用户的文本。 */
  label: React.ReactNode
  /** 在下一列展示的子选项。 */
  children?: CascaderOption[]
  /** 禁止选择此选项。 */
  disabled?: boolean
  /** 参与本地搜索的额外关键词，例如拼音或首字母。 */
  keywords?: string[]
}

export interface CascaderProps extends Omit<
  React.ComponentProps<"button">,
  "value" | "defaultValue" | "onChange"
> {
  /** 层级选项树。 */
  options: CascaderOption[]
  /** 受控模式下的选中值路径。 */
  value?: string[]
  /** 非受控模式下的初始值路径。 */
  defaultValue?: string[]
  /** 当前路径发生变化时调用。 */
  onValueChange?: (value: string[], options: CascaderOption[]) => void
  /** 未选中完整路径时展示的占位文本。@default "请选择地区" */
  placeholder?: string
  /** 选中标签之间的分隔符。@default " / " */
  separator?: React.ReactNode
  /** 选中叶子节点后是否关闭面板。@default true */
  closeOnSelect?: boolean
  /** 选项面板的无障碍标签。@default "级联选项" */
  panelLabel?: string
  /** 应用于浮层面板的额外类名。 */
  contentClassName?: string
  /** 自定义触发器的选中值渲染。 */
  renderValue?: (options: CascaderOption[]) => React.ReactNode
  /** 在面板顶部显示路径搜索框。@default false */
  searchable?: boolean
  /** 搜索框占位文本。@default "搜索选项" */
  searchPlaceholder?: string
  /** 自定义路径匹配逻辑。 */
  filterOption?: (query: string, path: CascaderOption[]) => boolean
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

function flattenLeafPaths(
  options: CascaderOption[],
  parentPath: CascaderOption[] = []
) {
  const paths: CascaderOption[][] = []

  for (const option of options) {
    const path = [...parentPath, option]
    if (option.children?.length)
      paths.push(...flattenLeafPaths(option.children, path))
    else paths.push(path)
  }

  return paths
}

function defaultFilterOption(query: string, path: CascaderOption[]) {
  const terms = query.trim().toLocaleLowerCase().split(/\s+/)
  const searchableText = path
    .flatMap((option) => [
      typeof option.label === "string" ? option.label : "",
      ...(option.keywords ?? []),
    ])
    .join(" ")
    .toLocaleLowerCase()

  return terms.every((term) => {
    if (searchableText.includes(term)) return true
    let cursor = 0
    for (const character of searchableText) {
      if (character === term[cursor]) cursor += 1
      if (cursor === term.length) return true
    }
    return false
  })
}

/** 用于层级值的紧凑多列选择器。 */
function Cascader({
  className,
  options,
  value,
  defaultValue = [],
  onValueChange,
  placeholder = "请选择地区",
  separator = " / ",
  closeOnSelect = true,
  panelLabel = "级联选项",
  contentClassName,
  renderValue,
  searchable = false,
  searchPlaceholder = "搜索选项",
  filterOption = defaultFilterOption,
  disabled,
  ...props
}: CascaderProps) {
  const reduceMotion = useReducedMotion()
  const [open, setOpen] = React.useState(false)
  const [query, setQuery] = React.useState("")
  const searchInputRef = React.useRef<HTMLInputElement>(null)
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

  const searchResults = React.useMemo(() => {
    if (!searchable || !query.trim()) return []
    return flattenLeafPaths(options).filter((path) => filterOption(query, path))
  }, [filterOption, options, query, searchable])

  function changeOpen(nextOpen: boolean) {
    setOpen(nextOpen)
    if (!nextOpen) setQuery("")
  }

  function commitPath(path: CascaderOption[]) {
    const nextValues = path.map((option) => option.value)
    if (value === undefined) setInternalValue(nextValues)
    onValueChange?.(nextValues, path)
    if (closeOnSelect) changeOpen(false)
  }

  function selectOption(option: CascaderOption, depth: number) {
    if (option.disabled) return
    const nextValues = [...selectedValues.slice(0, depth), option.value]
    const nextOptions = resolvePath(options, nextValues)
    if (value === undefined) setInternalValue(nextValues)
    onValueChange?.(nextValues, nextOptions)
    if (!option.children?.length && closeOnSelect) changeOpen(false)
  }

  return (
    <PopoverPrimitive.Root open={open} onOpenChange={changeOpen}>
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
              ? (renderValue?.(selectedOptions) ??
                selectedOptions.map((option, index) => (
                  <React.Fragment key={option.value}>
                    {index > 0 ? (
                      <span className="text-muted-foreground/60 mx-1.5">
                        {separator}
                      </span>
                    ) : null}
                    <span className="truncate">{option.label}</span>
                  </React.Fragment>
                )))
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
              onOpenAutoFocus={(event) => {
                event.preventDefault()
                if (searchable) searchInputRef.current?.focus()
              }}
            >
              <motion.div
                data-slot="cascader-content"
                role={searchable ? undefined : "listbox"}
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
                  "bg-popover text-popover-foreground z-50 flex max-w-[calc(100vw-2rem)] flex-col rounded-xl border p-1.5 shadow-lg outline-none",
                  contentClassName
                )}
              >
                {searchable ? (
                  <div className="border-border/70 border-b p-1.5 pb-2">
                    <Input
                      ref={searchInputRef}
                      value={query}
                      onChange={(event) => setQuery(event.target.value)}
                      placeholder={searchPlaceholder}
                      aria-label={searchPlaceholder}
                      visualSize="sm"
                      startContent={<SearchIcon />}
                    />
                  </div>
                ) : null}

                <div className="flex overflow-x-auto">
                  {query.trim() ? (
                    <div
                      data-slot="cascader-search-results"
                      role="listbox"
                      aria-label="搜索结果"
                      className="max-h-72 w-80 max-w-[calc(100vw-3rem)] overflow-y-auto p-1"
                    >
                      {searchResults.length ? (
                        searchResults.map((path) => (
                          <button
                            key={path.map((option) => option.value).join("/")}
                            type="button"
                            role="option"
                            aria-selected={path.every(
                              (option, index) =>
                                selectedValues[index] === option.value
                            )}
                            disabled={path.some((option) => option.disabled)}
                            onClick={() => commitPath(path)}
                            className="hover:bg-accent focus-visible:bg-accent flex min-h-9 w-full items-center rounded-lg px-2.5 py-2 text-left text-sm outline-none transition-colors disabled:pointer-events-none disabled:opacity-40"
                          >
                            <span className="min-w-0 truncate">
                              {path.map((option, index) => (
                                <React.Fragment key={option.value}>
                                  {index > 0 ? (
                                    <span className="text-muted-foreground/60 mx-1.5">
                                      {separator}
                                    </span>
                                  ) : null}
                                  <span>{option.label}</span>
                                </React.Fragment>
                              ))}
                            </span>
                          </button>
                        ))
                      ) : (
                        <p className="text-muted-foreground px-3 py-8 text-center text-sm">
                          没有匹配的选项
                        </p>
                      )}
                    </div>
                  ) : (
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
                            const active =
                              selectedValues[depth] === option.value
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
                  )}
                </div>
              </motion.div>
            </PopoverPrimitive.Content>
          ) : null}
        </AnimatePresence>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  )
}

export { Cascader }
