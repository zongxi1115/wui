"use client"

import * as React from "react"
import { ChevronDownIcon, SearchIcon, XIcon } from "lucide-react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"

import { cn } from "@/registry/lib/utils"
import { Input } from "@/registry/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/registry/ui/popover"
import { Tree, type TreeNode } from "@/registry/ui/tree"

export interface TreeSelectProps extends Omit<
  React.ComponentProps<"button">,
  "value" | "defaultValue" | "onChange"
> {
  /** 树形选项数据。 */
  items: TreeNode[]
  /** 受控模式下的选中值。 */
  value?: string
  /** 非受控模式下的初始选中值。 */
  defaultValue?: string
  /** 选中值变化或清空时触发。 */
  onValueChange?: (value: string, node?: TreeNode) => void
  /** 未选中时显示的文本。@default "请选择" */
  placeholder?: string
  /** 是否允许清空已选值。@default true */
  clearable?: boolean
  /** 是否显示搜索框。@default true */
  searchable?: boolean
  /** 搜索框占位文本。@default "搜索节点" */
  searchPlaceholder?: string
  /** 没有匹配节点时显示的文本。@default "没有匹配的节点" */
  emptyText?: React.ReactNode
  /** 应用于浮层面板的额外类名。 */
  contentClassName?: string
  /** 自定义节点搜索逻辑。 */
  filterNode?: (query: string, node: TreeNode) => boolean
}

function findNode(items: TreeNode[], value: string): TreeNode | undefined {
  for (const node of items) {
    if (node.value === value) return node
    const match = node.children ? findNode(node.children, value) : undefined
    if (match) return match
  }
}

function findAncestors(
  items: TreeNode[],
  value: string,
  trail: string[] = []
): string[] | undefined {
  for (const node of items) {
    if (node.value === value) return trail
    const match = node.children
      ? findAncestors(node.children, value, [...trail, node.value])
      : undefined
    if (match) return match
  }
}

function defaultFilterNode(query: string, node: TreeNode) {
  return typeof node.label === "string"
    ? node.label.toLocaleLowerCase().includes(query.toLocaleLowerCase())
    : false
}

function filterNodes(
  items: TreeNode[],
  query: string,
  filterNode: (query: string, node: TreeNode) => boolean
): TreeNode[] {
  if (!query.trim()) return items
  return items.flatMap((node) => {
    if (filterNode(query.trim(), node)) return [node]
    const children = node.children
      ? filterNodes(node.children, query, filterNode)
      : []
    return children.length ? [{ ...node, children }] : []
  })
}

function collectParentValues(items: TreeNode[]): string[] {
  return items.flatMap((node) => [
    ...(node.children?.length ? [node.value] : []),
    ...(node.children ? collectParentValues(node.children) : []),
  ])
}

/** 由 Popover、Input 与 Tree 组合而成的可搜索树形选择器。 */
function TreeSelect({
  className,
  items,
  value,
  defaultValue = "",
  onValueChange,
  placeholder = "请选择",
  clearable = true,
  searchable = true,
  searchPlaceholder = "搜索节点",
  emptyText = "没有匹配的节点",
  contentClassName,
  filterNode = defaultFilterNode,
  disabled,
  ...props
}: TreeSelectProps) {
  const reduceMotion = useReducedMotion()
  const [open, setOpen] = React.useState(false)
  const [query, setQuery] = React.useState("")
  const [expanded, setExpanded] = React.useState<string[]>([])
  const [internalValue, setInternalValue] = React.useState(defaultValue)
  const selectedValue = value ?? internalValue
  const selectedNode = findNode(items, selectedValue)
  const filteredItems = React.useMemo(
    () => filterNodes(items, query, filterNode),
    [filterNode, items, query]
  )
  const searchExpanded = React.useMemo(
    () => (query.trim() ? collectParentValues(filteredItems) : undefined),
    [filteredItems, query]
  )

  function changeValue(nextValue: string, node?: TreeNode) {
    if (value === undefined) setInternalValue(nextValue)
    onValueChange?.(nextValue, node)
  }

  function changeOpen(nextOpen: boolean) {
    setOpen(nextOpen)
    if (nextOpen) setExpanded(findAncestors(items, selectedValue) ?? [])
    else setQuery("")
  }

  return (
    <Popover open={open} onOpenChange={changeOpen}>
      <div
        data-slot="tree-select"
        data-disabled={disabled || undefined}
        className={cn(
          "border-input bg-background shadow-xs focus-within:border-ring focus-within:ring-ring/30 has-[button[aria-invalid=true]]:border-destructive has-[button[aria-invalid=true]]:ring-[3px] has-[button[aria-invalid=true]]:ring-destructive/20 flex h-10 w-full min-w-56 items-center rounded-md border transition-[border-color,box-shadow] duration-200 focus-within:ring-[3px] data-[disabled=true]:cursor-not-allowed data-[disabled=true]:opacity-50",
          className
        )}
      >
        <PopoverTrigger asChild>
          <button
            type="button"
            data-slot="tree-select-trigger"
            role="combobox"
            aria-expanded={open}
            disabled={disabled}
            className="flex h-full min-w-0 flex-1 items-center gap-2 rounded-l-md px-3 text-left text-sm outline-none"
            {...props}
          >
            <span className="relative flex min-w-0 flex-1 overflow-hidden">
              <AnimatePresence initial={false} mode="popLayout">
                <motion.span
                  key={selectedNode?.value ?? "__placeholder"}
                  data-placeholder={!selectedNode || undefined}
                  className="data-[placeholder=true]:text-muted-foreground min-w-0 flex-1 truncate"
                  initial={reduceMotion ? false : { opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduceMotion ? undefined : { opacity: 0, y: -6 }}
                  transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                >
                  {selectedNode?.label ?? placeholder}
                </motion.span>
              </AnimatePresence>
            </span>
            <ChevronDownIcon
              className={cn(
                "text-muted-foreground size-4 shrink-0 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
                open && "rotate-180"
              )}
            />
          </button>
        </PopoverTrigger>
        <AnimatePresence initial={false}>
          {clearable && selectedNode ? (
            <motion.button
              type="button"
              data-slot="tree-select-clear"
              aria-label="清空选择"
              disabled={disabled}
              className="text-muted-foreground hover:bg-accent hover:text-foreground focus-visible:ring-ring/40 mr-2 flex size-6 shrink-0 items-center justify-center rounded-sm outline-none transition-colors focus-visible:ring-2"
              initial={reduceMotion ? false : { opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={reduceMotion ? undefined : { opacity: 0, scale: 0.6 }}
              transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
              onClick={() => changeValue("")}
            >
              <XIcon className="size-3.5" />
            </motion.button>
          ) : null}
        </AnimatePresence>
      </div>
      <PopoverContent
        data-slot="tree-select-content"
        align="start"
        className={cn(
          "w-[var(--radix-popover-trigger-width)] min-w-64 origin-(--radix-popover-content-transform-origin) p-1.5",
          contentClassName
        )}
      >
        {searchable ? (
          <Input
            data-slot="tree-select-search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={searchPlaceholder}
            aria-label={searchPlaceholder}
            size="sm"
            startContent={<SearchIcon />}
            wrapperClassName="mb-1.5"
            autoFocus
          />
        ) : null}
        <div className="max-h-72 overflow-y-auto overscroll-contain">
          {filteredItems.length ? (
            <Tree
              items={filteredItems}
              value={selectedValue}
              expanded={searchExpanded ?? expanded}
              onExpandedChange={searchExpanded ? undefined : setExpanded}
              onValueChange={(nextValue, node) => {
                changeValue(nextValue, node)
                changeOpen(false)
              }}
              aria-label="树形选项"
            />
          ) : (
            <div
              data-slot="tree-select-empty"
              className="text-muted-foreground px-3 py-8 text-center text-sm"
            >
              {emptyText}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}

export { TreeSelect }
