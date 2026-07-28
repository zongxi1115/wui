"use client"

import * as React from "react"
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  ChevronDown,
  ChevronRight,
  ChevronsDownUp,
  ChevronsUpDown,
  GripVertical,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react"

import { Button } from "@/registry/ui/button"
import { Checkbox } from "@/registry/ui/checkbox"
import { Input } from "@/registry/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/registry/ui/table"
import { cn } from "@/registry/lib/utils"

type Status = "进行中" | "待开始" | "有风险" | "已完成"

type WorkItem = {
  id: string
  name: string
  owner: string
  start: string
  due: string
  status: Status
  progress: number
  budget: number
  children?: WorkItem[]
}

type SortKey = "name" | "due" | "progress" | "budget"

const initialRows: WorkItem[] = [
  {
    id: "website",
    name: "官网改版",
    owner: "林澈",
    start: "07-02",
    due: "08-16",
    status: "进行中",
    progress: 62,
    budget: 168000,
    children: [
      {
        id: "website-research",
        name: "用户调研与信息架构",
        owner: "林澈",
        start: "07-02",
        due: "07-18",
        status: "已完成",
        progress: 100,
        budget: 32000,
      },
      {
        id: "website-ui",
        name: "核心页面视觉设计",
        owner: "沈言",
        start: "07-19",
        due: "08-05",
        status: "进行中",
        progress: 68,
        budget: 56000,
      },
    ],
  },
  {
    id: "growth",
    name: "增长实验平台",
    owner: "周屿",
    start: "07-08",
    due: "09-06",
    status: "有风险",
    progress: 38,
    budget: 246000,
    children: [
      {
        id: "growth-events",
        name: "埋点模型梳理",
        owner: "周屿",
        start: "07-08",
        due: "07-25",
        status: "进行中",
        progress: 76,
        budget: 48000,
      },
      {
        id: "growth-engine",
        name: "实验分流引擎",
        owner: "唐可",
        start: "07-22",
        due: "08-28",
        status: "有风险",
        progress: 24,
        budget: 128000,
      },
    ],
  },
  {
    id: "insight",
    name: "客户洞察看板",
    owner: "唐可",
    start: "08-01",
    due: "09-20",
    status: "待开始",
    progress: 0,
    budget: 92000,
  },
  {
    id: "billing",
    name: "结算流程升级",
    owner: "沈言",
    start: "06-12",
    due: "07-30",
    status: "进行中",
    progress: 84,
    budget: 134000,
  },
]

const statusStyles: Record<Status, string> = {
  进行中: "bg-info/10 text-info",
  待开始: "bg-muted text-muted-foreground",
  有风险: "bg-warning/12 text-warning",
  已完成: "bg-success/10 text-success",
}

function moveWithinLevel(
  rows: WorkItem[],
  sourceId: string,
  targetId: string
): WorkItem[] {
  const sourceIndex = rows.findIndex((row) => row.id === sourceId)
  const targetIndex = rows.findIndex((row) => row.id === targetId)

  if (sourceIndex >= 0 && targetIndex >= 0) {
    const next = [...rows]
    const [source] = next.splice(sourceIndex, 1)
    next.splice(targetIndex, 0, source)
    return next
  }

  return rows.map((row) =>
    row.children
      ? {
          ...row,
          children: moveWithinLevel(row.children, sourceId, targetId),
        }
      : row
  )
}

function SortLabel({
  label,
  column,
  sort,
  onSort,
}: {
  label: string
  column: SortKey
  sort: { key: SortKey; direction: "asc" | "desc" } | null
  onSort: (key: SortKey) => void
}) {
  const active = sort?.key === column
  const Icon = !active
    ? ArrowUpDown
    : sort.direction === "asc"
      ? ArrowUp
      : ArrowDown

  return (
    <button
      type="button"
      className="-ml-2 inline-flex h-7 items-center gap-1.5 px-2 text-xs font-medium text-foreground outline-none hover:text-primary focus-visible:ring-2 focus-visible:ring-ring/40"
      onClick={() => onSort(column)}
    >
      {label}
      <Icon className={cn("size-3.5", !active && "text-muted-foreground/60")} />
    </button>
  )
}

export default function TableAdvanced() {
  const [rows, setRows] = React.useState(initialRows)
  const [expanded, setExpanded] = React.useState(
    () => new Set(["website", "growth"])
  )
  const [selected, setSelected] = React.useState(() => new Set<string>())
  const [query, setQuery] = React.useState("")
  const [owner, setOwner] = React.useState("all")
  const [status, setStatus] = React.useState("all")
  const [sort, setSort] = React.useState<{
    key: SortKey
    direction: "asc" | "desc"
  } | null>(null)
  const [compact, setCompact] = React.useState(true)
  const [draggingId, setDraggingId] = React.useState<string | null>(null)
  const dragHandleRef = React.useRef<string | null>(null)
  const filterActive = Boolean(query || owner !== "all" || status !== "all")

  const visibleRows = React.useMemo(() => {
    const queryValue = query.trim().toLowerCase()

    const filterTree = (items: WorkItem[]): WorkItem[] =>
      items.flatMap((item) => {
        const children = item.children ? filterTree(item.children) : []
        const matches =
          (!queryValue ||
            item.name.toLowerCase().includes(queryValue) ||
            item.owner.toLowerCase().includes(queryValue)) &&
          (owner === "all" || item.owner === owner) &&
          (status === "all" || item.status === status)

        return matches || children.length
          ? [{ ...item, children: children.length ? children : item.children }]
          : []
      })

    const sortTree = (items: WorkItem[]): WorkItem[] => {
      if (!sort) return items
      const factor = sort.direction === "asc" ? 1 : -1
      const sorted = [...items].sort((a, b) => {
        const left = a[sort.key]
        const right = b[sort.key]
        return (
          (typeof left === "number"
            ? left - Number(right)
            : String(left).localeCompare(String(right), "zh-CN")) * factor
        )
      })
      return sorted.map((item) => ({
        ...item,
        children: item.children ? sortTree(item.children) : undefined,
      }))
    }

    return sortTree(filterTree(rows))
  }, [owner, query, rows, sort, status])

  const flatRows = React.useMemo(() => {
    const flatten = (
      items: WorkItem[],
      depth = 0
    ): Array<{ item: WorkItem; depth: number }> =>
      items.flatMap((item) => [
        { item, depth },
        ...(item.children &&
        (expanded.has(item.id) || filterActive)
          ? flatten(item.children, depth + 1)
          : []),
      ])

    return flatten(visibleRows)
  }, [expanded, filterActive, visibleRows])

  const toggleSort = (key: SortKey) => {
    setSort((current) =>
      current?.key === key
        ? {
            key,
            direction: current.direction === "asc" ? "desc" : "asc",
          }
        : { key, direction: "asc" }
    )
  }

  const resetFilters = () => {
    setQuery("")
    setOwner("all")
    setStatus("all")
  }

  const allVisibleSelected =
    flatRows.length > 0 &&
    flatRows.every(({ item }) => selected.has(item.id))

  return (
    <div className="w-full min-w-0">
      <div className="flex flex-wrap items-center justify-between gap-3 border border-b-0 bg-muted/20 px-3 py-2.5">
        <div className="flex min-w-[220px] flex-1 items-center gap-2">
          <Input
            aria-label="搜索工作项"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="搜索工作项或负责人"
            visualSize="sm"
            startContent={<Search />}
            wrapperClassName="max-w-[280px] bg-background"
          />
          <span className="hidden text-xs text-muted-foreground sm:inline">
            {flatRows.length} 条结果
            {selected.size > 0 ? ` · 已选 ${selected.size}` : ""}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() =>
              setExpanded(
                expanded.size
                  ? new Set()
                  : new Set(["website", "growth"])
              )
            }
          >
            {expanded.size ? <ChevronsDownUp /> : <ChevronsUpDown />}
            <span className="hidden sm:inline">
              {expanded.size ? "收起" : "展开"}
            </span>
          </Button>
          <Button
            type="button"
            variant={compact ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setCompact((value) => !value)}
          >
            <SlidersHorizontal />
            <span className="hidden sm:inline">紧凑</span>
          </Button>
          {filterActive ? (
            <Button type="button" variant="ghost" size="sm" onClick={resetFilters}>
              <X />
              清除
            </Button>
          ) : null}
        </div>
      </div>

      <Table
        density={compact ? "compact" : "default"}
        stickyHeader
        containerClassName="max-h-[460px] border"
        className="w-[1024px] min-w-full table-fixed"
      >
        <colgroup>
          <col style={{ width: 44 }} />
          <col style={{ width: 36 }} />
          <col style={{ width: 260 }} />
          <col style={{ width: 120 }} />
          <col style={{ width: 92 }} />
          <col style={{ width: 92 }} />
          <col style={{ width: 110 }} />
          <col style={{ width: 150 }} />
          <col style={{ width: 120 }} />
        </colgroup>
        <TableHeader>
          <TableRow className="bg-muted/35 hover:bg-muted/35">
            <TableHead
              rowSpan={2}
              pinned="left"
              className="w-11 bg-muted/35 px-3 text-center"
            >
              <Checkbox
                size="sm"
                aria-label="选择当前结果"
                checked={
                  allVisibleSelected
                    ? true
                    : selected.size > 0
                      ? "indeterminate"
                      : false
                }
                onCheckedChange={(checked) =>
                  setSelected(
                    checked
                      ? new Set(flatRows.map(({ item }) => item.id))
                      : new Set()
                  )
                }
              />
            </TableHead>
            <TableHead
              rowSpan={2}
              pinned="left"
              pinOffset={44}
              className="w-9 bg-muted/35 px-2"
            >
              <span className="sr-only">拖动排序</span>
            </TableHead>
            <TableHead colSpan={2} className="border-r bg-muted/35 text-xs">
              工作项
            </TableHead>
            <TableHead colSpan={2} className="border-r bg-muted/35 text-xs">
              计划周期
            </TableHead>
            <TableHead colSpan={2} className="border-r bg-muted/35 text-xs">
              交付状态
            </TableHead>
            <TableHead
              rowSpan={2}
              pinned="right"
              className="w-[120px] bg-muted/35 text-right"
            >
              <SortLabel
                label="预算"
                column="budget"
                sort={sort}
                onSort={toggleSort}
              />
            </TableHead>
          </TableRow>
          <TableRow className="bg-muted/15 hover:bg-muted/15">
            <TableHead
              pinned="left"
              pinOffset={80}
              className="w-[260px] bg-muted/15"
            >
              <SortLabel
                label="名称"
                column="name"
                sort={sort}
                onSort={toggleSort}
              />
            </TableHead>
            <TableHead className="w-[120px]">负责人</TableHead>
            <TableHead className="w-[92px]">开始</TableHead>
            <TableHead className="w-[92px] border-r">
              <SortLabel
                label="截止"
                column="due"
                sort={sort}
                onSort={toggleSort}
              />
            </TableHead>
            <TableHead className="w-[110px]">状态</TableHead>
            <TableHead className="w-[150px] border-r">
              <SortLabel
                label="进度"
                column="progress"
                sort={sort}
                onSort={toggleSort}
              />
            </TableHead>
          </TableRow>
          <TableRow className="bg-background hover:bg-background">
            <TableHead
              pinned="left"
              className="w-11 bg-background px-3"
            />
            <TableHead
              pinned="left"
              pinOffset={44}
              className="w-9 bg-background px-2"
            />
            <TableHead
              pinned="left"
              pinOffset={80}
              className="bg-background px-2"
            >
              <input
                aria-label="按名称筛选"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="筛选名称…"
                className="h-7 w-full border-b bg-transparent px-1 text-xs text-foreground outline-none placeholder:text-muted-foreground focus:border-foreground"
              />
            </TableHead>
            <TableHead className="px-2">
              <select
                aria-label="按负责人筛选"
                value={owner}
                onChange={(event) => setOwner(event.target.value)}
                className="h-7 w-full border-b bg-transparent text-xs text-foreground outline-none focus:border-foreground"
              >
                <option value="all">全部负责人</option>
                <option value="林澈">林澈</option>
                <option value="沈言">沈言</option>
                <option value="周屿">周屿</option>
                <option value="唐可">唐可</option>
              </select>
            </TableHead>
            <TableHead className="px-2 text-xs text-muted-foreground">—</TableHead>
            <TableHead className="border-r px-2 text-xs text-muted-foreground">
              —
            </TableHead>
            <TableHead className="px-2">
              <select
                aria-label="按状态筛选"
                value={status}
                onChange={(event) => setStatus(event.target.value)}
                className="h-7 w-full border-b bg-transparent text-xs text-foreground outline-none focus:border-foreground"
              >
                <option value="all">全部状态</option>
                <option value="进行中">进行中</option>
                <option value="待开始">待开始</option>
                <option value="有风险">有风险</option>
                <option value="已完成">已完成</option>
              </select>
            </TableHead>
            <TableHead className="border-r px-2 text-xs text-muted-foreground">
              —
            </TableHead>
            <TableHead pinned="right" className="bg-background px-2 text-right">
              <span className="text-xs text-muted-foreground">固定列</span>
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {flatRows.map(({ item, depth }) => {
            const hasChildren = Boolean(item.children?.length)
            const isExpanded = expanded.has(item.id)

            return (
              <TableRow
                key={item.id}
                draggable
                data-dragging={draggingId === item.id}
                data-state={selected.has(item.id) ? "selected" : undefined}
                onPointerDownCapture={(event) => {
                  dragHandleRef.current = (
                    event.target as HTMLElement
                  ).closest("[data-slot=table-drag-handle]")
                    ? item.id
                    : null
                }}
                onDragStart={(event) => {
                  if (dragHandleRef.current !== item.id) {
                    event.preventDefault()
                    return
                  }
                  setDraggingId(item.id)
                  event.dataTransfer.effectAllowed = "move"
                }}
                onDragEnd={() => {
                  dragHandleRef.current = null
                  setDraggingId(null)
                }}
                onDragOver={(event) => {
                  if (draggingId && draggingId !== item.id) {
                    event.preventDefault()
                    event.dataTransfer.dropEffect = "move"
                  }
                }}
                onDrop={(event) => {
                  event.preventDefault()
                  if (draggingId && draggingId !== item.id) {
                    setRows((current) =>
                      moveWithinLevel(current, draggingId, item.id)
                    )
                    setSort(null)
                  }
                  dragHandleRef.current = null
                  setDraggingId(null)
                }}
              >
                <TableCell pinned="left" className="w-11 px-3 text-center">
                  <Checkbox
                    size="sm"
                    aria-label={`选择${item.name}`}
                    checked={selected.has(item.id)}
                    onCheckedChange={(checked) =>
                      setSelected((current) => {
                        const next = new Set(current)
                        checked ? next.add(item.id) : next.delete(item.id)
                        return next
                      })
                    }
                  />
                </TableCell>
                <TableCell
                  pinned="left"
                  pinOffset={44}
                  className="w-9 px-2 text-muted-foreground"
                >
                  <button
                    type="button"
                    data-slot="table-drag-handle"
                    className="cursor-grab touch-none p-1 outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/40 active:cursor-grabbing"
                    aria-label={`拖动${item.name}`}
                  >
                    <GripVertical className="size-4" />
                  </button>
                </TableCell>
                <TableCell
                  pinned="left"
                  pinOffset={80}
                  className="w-[260px] font-medium"
                >
                  <div
                    className="flex items-center gap-1.5"
                    style={{ paddingInlineStart: depth * 20 }}
                  >
                    {hasChildren ? (
                      <button
                        type="button"
                        className="flex size-6 shrink-0 items-center justify-center text-muted-foreground outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/40"
                        aria-label={isExpanded ? "收起子项" : "展开子项"}
                        onClick={() =>
                          setExpanded((current) => {
                            const next = new Set(current)
                            next.has(item.id)
                              ? next.delete(item.id)
                              : next.add(item.id)
                            return next
                          })
                        }
                      >
                        {isExpanded || filterActive ? (
                          <ChevronDown className="size-4" />
                        ) : (
                          <ChevronRight className="size-4" />
                        )}
                      </button>
                    ) : (
                      <span className="size-6 shrink-0" />
                    )}
                    <span>{item.name}</span>
                    {hasChildren ? (
                      <span className="text-[11px] font-normal text-muted-foreground">
                        {item.children?.length}
                      </span>
                    ) : null}
                  </div>
                </TableCell>
                <TableCell>{item.owner}</TableCell>
                <TableCell className="tabular-nums text-muted-foreground">
                  {item.start}
                </TableCell>
                <TableCell className="border-r tabular-nums">
                  {item.due}
                </TableCell>
                <TableCell>
                  <span
                    className={cn(
                      "inline-flex px-2 py-1 text-xs font-medium",
                      statusStyles[item.status]
                    )}
                  >
                    {item.status}
                  </span>
                </TableCell>
                <TableCell className="border-r">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-20 overflow-hidden bg-muted">
                      <div
                        className={cn(
                          "h-full",
                          item.status === "有风险"
                            ? "bg-warning"
                            : "bg-foreground/70"
                        )}
                        style={{ width: `${item.progress}%` }}
                      />
                    </div>
                    <span className="w-8 text-right text-xs tabular-nums text-muted-foreground">
                      {item.progress}%
                    </span>
                  </div>
                </TableCell>
                <TableCell
                  pinned="right"
                  className="w-[120px] text-right font-medium tabular-nums"
                >
                  ¥{item.budget.toLocaleString("zh-CN")}
                </TableCell>
              </TableRow>
            )
          })}
          {flatRows.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={9}
                className="h-32 text-center text-muted-foreground"
              >
                没有符合当前筛选条件的工作项
              </TableCell>
            </TableRow>
          ) : null}
        </TableBody>
      </Table>
      <p className="mt-2 text-xs text-muted-foreground">
        拖动手柄可在同级内排序；横向滚动时，选择、拖动、名称和预算列保持固定。
      </p>
    </div>
  )
}
