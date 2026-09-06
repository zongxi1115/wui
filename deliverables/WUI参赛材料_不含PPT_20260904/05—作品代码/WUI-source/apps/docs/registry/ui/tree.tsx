"use client"

import * as React from "react"
import { ChevronRightIcon } from "lucide-react"

import { cn } from "@/registry/lib/utils"

export interface TreeNode {
  /** 节点的稳定值。 */
  value: string
  /** 展示给用户的节点文本。 */
  label: React.ReactNode
  /** 嵌套的子节点。 */
  children?: TreeNode[]
  /** 禁止展开和选择此节点。 */
  disabled?: boolean
  /** 显示在标签前的自定义图标。 */
  icon?: React.ReactNode
}

export interface TreeProps extends Omit<
  React.ComponentProps<"div">,
  "defaultValue" | "onChange"
> {
  /** 树形节点数据。 */
  items: TreeNode[]
  /** 受控模式下的选中值。 */
  value?: string
  /** 非受控模式下的初始选中值。 */
  defaultValue?: string
  /** 节点被选中时触发。 */
  onValueChange?: (value: string, node: TreeNode) => void
  /** 受控模式下已展开的节点值。 */
  expanded?: string[]
  /** 非受控模式下初始展开的节点值。 */
  defaultExpanded?: string[]
  /** 展开集合变化时触发。 */
  onExpandedChange?: (expanded: string[]) => void
}

interface VisibleNode {
  node: TreeNode
  depth: number
  parentValue?: string
}

function flattenVisible(
  items: TreeNode[],
  expanded: Set<string>,
  depth = 1,
  parentValue?: string
): VisibleNode[] {
  return items.flatMap((node) => [
    { node, depth, parentValue },
    ...(node.children?.length && expanded.has(node.value)
      ? flattenVisible(node.children, expanded, depth + 1, node.value)
      : []),
  ])
}

/** 展示和选择嵌套数据的可访问树，支持鼠标与方向键操作。 */
function Tree({
  className,
  items,
  value,
  defaultValue = "",
  onValueChange,
  expanded,
  defaultExpanded = [],
  onExpandedChange,
  ...props
}: TreeProps) {
  const [internalValue, setInternalValue] = React.useState(defaultValue)
  const [internalExpanded, setInternalExpanded] =
    React.useState(defaultExpanded)
  const selectedValue = value ?? internalValue
  const expandedValues = expanded ?? internalExpanded
  const expandedSet = React.useMemo(
    () => new Set(expandedValues),
    [expandedValues]
  )
  const visible = React.useMemo(
    () => flattenVisible(items, expandedSet),
    [items, expandedSet]
  )
  const [focusedValue, setFocusedValue] = React.useState(
    selectedValue || visible[0]?.node.value || ""
  )
  const nodeRefs = React.useRef(new Map<string, HTMLDivElement>())

  React.useEffect(() => {
    if (visible.some(({ node }) => node.value === focusedValue)) return
    setFocusedValue(selectedValue || visible[0]?.node.value || "")
  }, [focusedValue, selectedValue, visible])

  function changeExpanded(next: string[]) {
    if (expanded === undefined) setInternalExpanded(next)
    onExpandedChange?.(next)
  }

  function toggle(node: TreeNode, force?: boolean) {
    if (!node.children?.length || node.disabled) return
    const shouldExpand = force ?? !expandedSet.has(node.value)
    changeExpanded(
      shouldExpand
        ? [...expandedValues, node.value]
        : expandedValues.filter((item) => item !== node.value)
    )
  }

  function select(node: TreeNode) {
    if (node.disabled) return
    if (value === undefined) setInternalValue(node.value)
    onValueChange?.(node.value, node)
  }

  function focusNode(nextValue: string) {
    setFocusedValue(nextValue)
    nodeRefs.current.get(nextValue)?.focus()
  }

  function handleKeyDown(
    event: React.KeyboardEvent<HTMLDivElement>,
    item: VisibleNode
  ) {
    const index = visible.findIndex(
      ({ node }) => node.value === item.node.value
    )
    let nextValue: string | undefined

    switch (event.key) {
      case "ArrowDown":
        nextValue = visible[Math.min(index + 1, visible.length - 1)]?.node.value
        break
      case "ArrowUp":
        nextValue = visible[Math.max(index - 1, 0)]?.node.value
        break
      case "Home":
        nextValue = visible[0]?.node.value
        break
      case "End":
        nextValue = visible.at(-1)?.node.value
        break
      case "ArrowRight":
        if (item.node.children?.length && !expandedSet.has(item.node.value)) {
          toggle(item.node, true)
        } else if (item.node.children?.length) {
          nextValue = item.node.children[0]?.value
        }
        break
      case "ArrowLeft":
        if (item.node.children?.length && expandedSet.has(item.node.value)) {
          toggle(item.node, false)
        } else {
          nextValue = item.parentValue
        }
        break
      case "Enter":
      case " ":
        select(item.node)
        break
      default:
        return
    }

    event.preventDefault()
    if (nextValue) focusNode(nextValue)
  }

  return (
    <div
      data-slot="tree"
      role="tree"
      aria-label={props["aria-label"] ?? "树形列表"}
      className={cn("w-full text-sm", className)}
      {...props}
    >
      {visible.map((item) => {
        const { node, depth } = item
        const hasChildren = Boolean(node.children?.length)
        const isExpanded = hasChildren && expandedSet.has(node.value)
        const isSelected = selectedValue === node.value

        return (
          <div
            key={node.value}
            ref={(element) => {
              if (element) nodeRefs.current.set(node.value, element)
              else nodeRefs.current.delete(node.value)
            }}
            data-slot="tree-item"
            data-selected={isSelected || undefined}
            data-disabled={node.disabled || undefined}
            role="treeitem"
            aria-level={depth}
            aria-selected={isSelected}
            aria-expanded={hasChildren ? isExpanded : undefined}
            aria-disabled={node.disabled || undefined}
            tabIndex={focusedValue === node.value ? 0 : -1}
            className="hover:bg-accent/60 focus-visible:ring-ring data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground flex min-h-9 cursor-default items-center rounded-md pr-2 outline-none transition-colors focus-visible:ring-2 data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50"
            style={{ paddingLeft: `${(depth - 1) * 20 + 4}px` }}
            onFocus={() => setFocusedValue(node.value)}
            onClick={() => select(node)}
            onDoubleClick={() => toggle(node)}
            onKeyDown={(event) => handleKeyDown(event, item)}
          >
            <button
              type="button"
              data-slot="tree-item-toggle"
              tabIndex={-1}
              aria-label={isExpanded ? "收起" : "展开"}
              aria-hidden={!hasChildren}
              disabled={!hasChildren || node.disabled}
              className="text-muted-foreground mr-1 flex size-7 shrink-0 items-center justify-center rounded-sm outline-none disabled:invisible"
              onClick={(event) => {
                event.stopPropagation()
                toggle(node)
              }}
            >
              <ChevronRightIcon
                className={cn(
                  "size-4 transition-transform",
                  isExpanded && "rotate-90"
                )}
              />
            </button>
            {node.icon ? (
              <span data-slot="tree-item-icon" className="mr-2 shrink-0">
                {node.icon}
              </span>
            ) : null}
            <span
              data-slot="tree-item-label"
              className="min-w-0 flex-1 truncate"
            >
              {node.label}
            </span>
          </div>
        )
      })}
    </div>
  )
}

export { Tree }
