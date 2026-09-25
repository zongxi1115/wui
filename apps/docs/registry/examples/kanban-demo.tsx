"use client"

import * as React from "react"
import { CircleCheckIcon, CircleDashedIcon, CircleDotIcon, PlusIcon } from "lucide-react"

import { Button } from "@/registry/ui/button"
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

type Task = { id: string; title: string; meta: string }

const columns = [
  { id: "backlog", label: "待规划", icon: CircleDashedIcon },
  { id: "progress", label: "进行中", icon: CircleDotIcon },
  { id: "done", label: "已完成", icon: CircleCheckIcon },
]

const drafts = ["整理 Q4 设计评审议题", "补充表单校验文案", "对齐图标描边规范"]

const initial: Record<string, Task[]> = {
  backlog: [
    { id: "nav", title: "重构移动端导航", meta: "设计 · 中优先级" },
    { id: "empty", title: "补齐空状态规范", meta: "文档 · 低优先级" },
  ],
  progress: [
    { id: "calendar", title: "日历键盘交互", meta: "开发 · 高优先级" },
    { id: "tokens", title: "检查深色主题 token", meta: "设计系统 · 中优先级" },
  ],
  done: [{ id: "api", title: "确认组件 API", meta: "开发 · 已完成" }],
}

export default function KanbanDemo() {
  const [board, setBoard] = React.useState(initial)
  const created = React.useRef(0)

  function addTask(column: string) {
    const count = created.current++
    const task = {
      id: `draft-${count}`,
      title: drafts[count % drafts.length],
      meta: "新建 · 未指派",
    }
    setBoard((current) => ({ ...current, [column]: [task, ...current[column]] }))
  }

  return (
    <Kanban
      className="w-full"
      onMove={(move) =>
        setBoard((current) => moveKanbanItem(current, move, (task) => task.id))
      }
    >
      {columns.map((column) => {
        const tasks = board[column.id]
        const Icon = column.icon
        return (
          <KanbanColumn key={column.id} value={column.id}>
            <KanbanColumnHeader>
              <div className="flex items-center gap-2">
                <Icon className="text-muted-foreground size-3.5" />
                <KanbanColumnTitle>{column.label}</KanbanColumnTitle>
                <KanbanColumnCount>{tasks.length}</KanbanColumnCount>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground size-7"
                aria-label={`添加到${column.label}`}
                onClick={() => addTask(column.id)}
              >
                <PlusIcon />
              </Button>
            </KanbanColumnHeader>
            <KanbanColumnBody>
              {tasks.map((task) => (
                <KanbanCard key={task.id} value={task.id}>
                  <p className="pr-5 font-medium leading-5">{task.title}</p>
                  <p className="text-muted-foreground mt-2 text-xs">{task.meta}</p>
                </KanbanCard>
              ))}
            </KanbanColumnBody>
          </KanbanColumn>
        )
      })}
    </Kanban>
  )
}
