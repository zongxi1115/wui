"use client"

import * as React from "react"
import { SearchIcon } from "lucide-react"

import { cn } from "@/registry/lib/utils"

type CommandItemRecord = {
  id: string
  value: string
  keywords: string[]
  disabled: boolean
  onSelect: (value: string) => void
}

type CommandContextValue = {
  query: string
  setQuery: (query: string) => void
  activeId: string | null
  setActiveId: (id: string) => void
  visibleIds: Set<string>
  isItemVisible: (value: string, keywords: string[]) => boolean
  registerItem: (item: CommandItemRecord) => () => void
  selectItem: (id: string) => void
}

const CommandContext = React.createContext<CommandContextValue | null>(null)

function useCommandContext(component: string) {
  const context = React.useContext(CommandContext)
  if (!context) throw new Error(`${component} 必须在 Command 内使用。`)
  return context
}

function fuzzyMatch(value: string, query: string, keywords: string[]) {
  const text = [value, ...keywords].join(" ").toLocaleLowerCase()
  return query
    .trim()
    .toLocaleLowerCase()
    .split(/\s+/)
    .every((term) => {
      if (text.includes(term)) return true
      let cursor = 0
      for (const character of text) {
        if (character === term[cursor]) cursor += 1
        if (cursor === term.length) return true
      }
      return false
    })
}

export interface CommandProps extends React.ComponentProps<"div"> {
  /** 受控模式下的搜索词。 */
  query?: string
  /** 非受控模式下的初始搜索词。 */
  defaultQuery?: string
  /** 搜索词变化时触发。 */
  onQueryChange?: (query: string) => void
  /** 是否由组件过滤选项。关闭后可接入服务端搜索。@default true */
  shouldFilter?: boolean
  /** 自定义选项匹配规则。 */
  filter?: (value: string, query: string, keywords: string[]) => boolean
}

/** 支持模糊搜索和键盘导航的命令列表容器。 */
function Command({
  className,
  query,
  defaultQuery = "",
  onQueryChange,
  shouldFilter = true,
  filter = fuzzyMatch,
  onKeyDown,
  children,
  ...props
}: CommandProps) {
  const [internalQuery, setInternalQuery] = React.useState(defaultQuery)
  const [items, setItems] = React.useState<CommandItemRecord[]>([])
  const [activeId, setActiveId] = React.useState<string | null>(null)
  const search = query ?? internalQuery

  const visibleItems = React.useMemo(
    () =>
      items.filter(
        (item) =>
          !shouldFilter ||
          !search.trim() ||
          filter(item.value, search, item.keywords)
      ),
    [filter, items, search, shouldFilter]
  )
  const enabledItems = React.useMemo(
    () => visibleItems.filter((item) => !item.disabled),
    [visibleItems]
  )
  const visibleIds = React.useMemo(
    () => new Set(visibleItems.map((item) => item.id)),
    [visibleItems]
  )

  React.useEffect(() => {
    if (!enabledItems.some((item) => item.id === activeId))
      setActiveId(enabledItems[0]?.id ?? null)
  }, [activeId, enabledItems])

  function setQuery(nextQuery: string) {
    if (query === undefined) setInternalQuery(nextQuery)
    onQueryChange?.(nextQuery)
  }

  function isItemVisible(value: string, keywords: string[]) {
    return !shouldFilter || !search.trim() || filter(value, search, keywords)
  }

  const registerItem = React.useCallback((item: CommandItemRecord) => {
    setItems((current) => [
      ...current.filter((entry) => entry.id !== item.id),
      item,
    ])
    return () =>
      setItems((current) => current.filter((entry) => entry.id !== item.id))
  }, [])

  function selectItem(id: string) {
    const item = items.find((entry) => entry.id === id)
    if (item && !item.disabled && visibleIds.has(id)) item.onSelect(item.value)
  }

  function moveActive(direction: 1 | -1) {
    if (!enabledItems.length) return
    const currentIndex = enabledItems.findIndex((item) => item.id === activeId)
    const nextIndex =
      currentIndex < 0
        ? direction === 1
          ? 0
          : enabledItems.length - 1
        : (currentIndex + direction + enabledItems.length) % enabledItems.length
    setActiveId(enabledItems[nextIndex]?.id ?? null)
  }

  return (
    <CommandContext.Provider
      value={{
        query: search,
        setQuery,
        activeId,
        setActiveId,
        visibleIds,
        isItemVisible,
        registerItem,
        selectItem,
      }}
    >
      <div
        data-slot="command"
        className={cn(
          "bg-popover text-popover-foreground flex w-full flex-col overflow-hidden rounded-lg",
          className
        )}
        onKeyDown={(event) => {
          onKeyDown?.(event)
          if (event.defaultPrevented) return
          if (event.key === "ArrowDown") {
            event.preventDefault()
            moveActive(1)
          } else if (event.key === "ArrowUp") {
            event.preventDefault()
            moveActive(-1)
          } else if (event.key === "Enter" && activeId) {
            event.preventDefault()
            selectItem(activeId)
          }
        }}
        {...props}
      >
        {children}
      </div>
    </CommandContext.Provider>
  )
}

export interface CommandInputProps extends Omit<
  React.ComponentProps<"input">,
  "value" | "defaultValue" | "onChange"
> {}

/** 绑定 Command 搜索状态的输入框。 */
function CommandInput({ className, ...props }: CommandInputProps) {
  const { activeId, query, setQuery } = useCommandContext("CommandInput")

  return (
    <div
      data-slot="command-input-wrapper"
      className="border-border/70 flex h-11 items-center gap-2 border-b px-3"
    >
      <SearchIcon className="text-muted-foreground size-4 shrink-0" />
      <input
        data-slot="command-input"
        role="combobox"
        aria-autocomplete="list"
        aria-expanded="true"
        aria-activedescendant={activeId ?? undefined}
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        className={cn(
          "placeholder:text-muted-foreground h-full min-w-0 flex-1 bg-transparent text-sm outline-none disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        {...props}
      />
    </div>
  )
}

/** 命令选项的可滚动区域。 */
function CommandList({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="command-list"
      role="listbox"
      className={cn(
        "max-h-72 overflow-y-auto overflow-x-hidden p-1.5 [&:has([data-slot=command-item])_[data-slot=command-empty]]:hidden",
        className
      )}
      {...props}
    />
  )
}

/** 搜索无匹配项时显示的内容。 */
function CommandEmpty({ className, ...props }: React.ComponentProps<"div">) {
  const { visibleIds } = useCommandContext("CommandEmpty")
  if (visibleIds.size) return null
  return (
    <div
      data-slot="command-empty"
      className={cn(
        "text-muted-foreground px-4 py-8 text-center text-sm",
        className
      )}
      {...props}
    />
  )
}

/** 为一组选项提供标签和结构。 */
function CommandGroup({
  className,
  heading,
  children,
  ...props
}: React.ComponentProps<"div"> & { heading?: React.ReactNode }) {
  return (
    <div
      data-slot="command-group"
      role="group"
      className={cn("overflow-hidden", className)}
      {...props}
    >
      {heading ? (
        <div
          data-slot="command-group-heading"
          className="text-muted-foreground px-2 py-1.5 text-xs font-medium"
        >
          {heading}
        </div>
      ) : null}
      {children}
    </div>
  )
}

export interface CommandItemProps extends Omit<
  React.ComponentProps<"div">,
  "onSelect"
> {
  /** 用于搜索和选择回调的稳定值。 */
  value: string
  /** 参与搜索的别名，例如拼音或缩写。 */
  keywords?: string[]
  /** 禁止聚焦和选择此项。 */
  disabled?: boolean
  /** 通过点击或 Enter 选中时触发。 */
  onSelect?: (value: string) => void
}

/** 可搜索、可通过键盘选中的命令项。 */
function CommandItem({
  className,
  value,
  keywords = [],
  disabled = false,
  onSelect,
  onMouseMove,
  onClick,
  children,
  ...props
}: CommandItemProps) {
  const id = React.useId()
  const { activeId, setActiveId, isItemVisible, registerItem, selectItem } =
    useCommandContext("CommandItem")
  const onSelectRef = React.useRef(onSelect)
  onSelectRef.current = onSelect
  const keywordsKey = keywords.join("\u0000")

  React.useEffect(
    () =>
      registerItem({
        id,
        value,
        keywords: keywordsKey ? keywordsKey.split("\u0000") : [],
        disabled,
        onSelect: (selectedValue) => onSelectRef.current?.(selectedValue),
      }),
    [disabled, id, keywordsKey, registerItem, value]
  )

  if (!isItemVisible(value, keywords)) return null
  const active = activeId === id

  return (
    <div
      id={id}
      data-slot="command-item"
      data-active={active || undefined}
      data-disabled={disabled || undefined}
      role="option"
      aria-selected={active}
      aria-disabled={disabled || undefined}
      className={cn(
        "hover:bg-accent hover:text-accent-foreground data-[active=true]:bg-accent data-[active=true]:text-accent-foreground relative flex min-h-9 cursor-default select-none items-center gap-2 rounded-md px-2.5 py-2 text-sm outline-none transition-colors data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-40 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
        className
      )}
      onMouseDown={(event) => event.preventDefault()}
      onMouseMove={(event) => {
        onMouseMove?.(event)
        if (!disabled && !event.defaultPrevented) setActiveId(id)
      }}
      onClick={(event) => {
        onClick?.(event)
        if (!event.defaultPrevented) selectItem(id)
      }}
      {...props}
    >
      {children}
    </div>
  )
}

/** 命令列表中的视觉分隔线。 */
function CommandSeparator({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="command-separator"
      role="separator"
      className={cn("bg-border -mx-1 my-1 h-px", className)}
      {...props}
    />
  )
}

function CommandShortcut({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="command-shortcut"
      className={cn(
        "ml-auto text-xs tracking-widest text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}

export {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
}
