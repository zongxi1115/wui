"use client"

import * as React from "react"
import { PlusIcon } from "lucide-react"

import { cn } from "@/registry/lib/utils"
import { Avatar, AvatarFallback } from "@/registry/ui/avatar"
import { Button } from "@/registry/ui/button"
import { Kbd } from "@/registry/ui/kbd"
import {
  Kanban,
  KanbanCard,
  KanbanColumn,
  KanbanColumnBody,
  KanbanColumnCount,
  KanbanColumnHeader,
  KanbanColumnTitle,
  moveKanbanItem,
} from "@/registry/ui/kanban"

type Priority = "urgent" | "high" | "medium" | "low"

type Task = {
  id: string
  title: string
  label: string
  priority: Priority
  points: number
  assignee: string
}

const priorities: Record<Priority, { label: string; className: string }> = {
  urgent: { label: "紧急", className: "bg-destructive" },
  high: { label: "高", className: "bg-warning" },
  medium: { label: "中", className: "bg-info" },
  low: { label: "低", className: "bg-muted-foreground/50" },
}

const columns = [
  { id: "todo", title: "待开发", limit: undefined },
  { id: "doing", title: "开发中", limit: 3 },
  { id: "review", title: "代码评审", limit: 2 },
  { id: "done", title: "已发布", limit: undefined },
]

const initialBoard: Record<string, Task[]> = {
  todo: [
    { id: "FE-231", title: "企业微信扫码登录", label: "账号", priority: "high", points: 5, assignee: "陈默" },
    { id: "FE-236", title: "数据大屏在 1280 宽度下的栅格适配", label: "可视化", priority: "low", points: 2, assignee: "周以宁" },
  ],
  doing: [
    { id: "FE-219", title: "流式回复中的代码块高亮与复制", label: "AI 助手", priority: "urgent", points: 8, assignee: "林澈" },
    { id: "FE-224", title: "表格列宽拖拽与本地持久化", label: "表格", priority: "medium", points: 3, assignee: "许嘉" },
  ],
  review: [
    { id: "FE-212", title: "全局快捷键冲突检测", label: "基础设施", priority: "medium", points: 3, assignee: "周以宁" },
  ],
  done: [
    { id: "FE-205", title: "升级 Tailwind CSS v4 与 Motion 12", label: "基础设施", priority: "medium", points: 5, assignee: "林澈" },
  ],
}

const backlog: Omit<Task, "id">[] = [
  { title: "上传组件支持断点续传", label: "文件", priority: "high", points: 5, assignee: "许嘉" },
  { title: "消息通知聚合与免打扰时段", label: "通知", priority: "medium", points: 3, assignee: "陈默" },
  { title: "暗色模式下图表配色校准", label: "可视化", priority: "low", points: 2, assignee: "周以宁" },
]

export default function KanbanProjectBoard() {
  const [board, setBoard] = React.useState(initialBoard)
  const nextId = React.useRef(240)

  function createTask() {
    const id = nextId.current++
    const template = backlog[id % backlog.length]
    setBoard((current) => ({
      ...current,
      todo: [{ ...template, id: `FE-${id}` }, ...current.todo],
    }))
  }

  const totalPoints = Object.values(board)
    .flat()
    .reduce((sum, task) => sum + task.points, 0)
  const donePoints = board.done.reduce((sum, task) => sum + task.points, 0)

  return (
    <div className="w-full space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium">Sprint 24 · 前端</p>
          <p className="text-muted-foreground mt-0.5 text-xs tabular-nums">
            已完成 {donePoints} / {totalPoints} 点 · 拖拽卡片，或聚焦后按 <Kbd>Space</Kbd> 用方向键移动
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={createTask}>
          <PlusIcon />
          新建任务
        </Button>
      </div>

      <Kanban
        className="w-full"
        onMove={(move) =>
          setBoard((current) => moveKanbanItem(current, move, (task) => task.id))
        }
      >
        {columns.map((column) => {
          const tasks = board[column.id]
          const overLimit = column.limit !== undefined && tasks.length > column.limit
          return (
            <KanbanColumn key={column.id} value={column.id}>
              <KanbanColumnHeader>
                <div className="flex items-center gap-2">
                  <KanbanColumnTitle>{column.title}</KanbanColumnTitle>
                  <KanbanColumnCount
                    className={cn(
                      "transition-colors duration-200",
                      overLimit && "bg-warning-subtle text-warning"
                    )}
                  >
                    {tasks.length}
                  </KanbanColumnCount>
                </div>
                {column.limit !== undefined ? (
                  <span
                    className={cn(
                      "text-muted-foreground text-xs transition-colors duration-200",
                      overLimit && "text-warning"
                    )}
                  >
                    上限 {column.limit}
                  </span>
                ) : null}
              </KanbanColumnHeader>

              <KanbanColumnBody>
                {tasks.map((task) => {
                  const priority = priorities[task.priority]
                  return (
                    <KanbanCard key={task.id} value={task.id} aria-label={`${task.id} ${task.title}`}>
                      <div className="text-muted-foreground flex items-center gap-2 pr-5 text-xs">
                        <span className="font-mono">{task.id}</span>
                        <span className="flex items-center gap-1">
                          <span className={cn("size-1.5 rounded-full", priority.className)} />
                          {priority.label}
                        </span>
                      </div>
                      <p className="mt-1.5 font-medium leading-5">{task.title}</p>
                      <div className="text-muted-foreground mt-3 flex items-center justify-between text-xs">
                        <span className="bg-muted rounded px-1.5 py-0.5">{task.label}</span>
                        <div className="flex items-center gap-2">
                          <span className="tabular-nums">{task.points} 点</span>
                          <Avatar size="xs" title={task.assignee}>
                            <AvatarFallback>{task.assignee.slice(0, 1)}</AvatarFallback>
                          </Avatar>
                        </div>
                      </div>
                    </KanbanCard>
                  )
                })}
              </KanbanColumnBody>
            </KanbanColumn>
          )
        })}
      </Kanban>
    </div>
  )
}
