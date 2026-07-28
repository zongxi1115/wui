"use client"

import * as React from "react"
import { CircleDotIcon, PlusIcon } from "lucide-react"

import {
  Kanban,
  KanbanCard,
  KanbanColumn,
  KanbanColumnBody,
  KanbanColumnCount,
  KanbanColumnHeader,
  KanbanColumnTitle,
  type KanbanMove,
} from "@/registry/ui/kanban"

type Task = { id: string; title: string; meta: string }
type Board = Record<string, Task[]>

const labels: Record<string, string> = {
  backlog: "待规划",
  progress: "进行中",
  done: "已完成",
}
const initial: Board = {
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
  function move({ itemId, from, to }: KanbanMove) {
    setBoard((current) => {
      const item = current[from].find((task) => task.id === itemId)
      if (!item) return current
      return {
        ...current,
        [from]: current[from].filter((task) => task.id !== itemId),
        [to]: [...current[to], item],
      }
    })
  }

  return (
    <Kanban onMove={move} className="w-full">
      {Object.entries(board).map(([column, tasks]) => (
        <KanbanColumn key={column} value={column}>
          <KanbanColumnHeader>
            <div className="flex items-center gap-2">
              <CircleDotIcon className="text-muted-foreground size-3.5" />
              <KanbanColumnTitle>{labels[column]}</KanbanColumnTitle>
              <KanbanColumnCount>{tasks.length}</KanbanColumnCount>
            </div>
            <button
              type="button"
              aria-label={`添加到${labels[column]}`}
              className="text-muted-foreground hover:bg-accent hover:text-foreground flex size-7 items-center justify-center rounded-md"
            >
              <PlusIcon className="size-4" />
            </button>
          </KanbanColumnHeader>
          <KanbanColumnBody>
            {tasks.map((task) => (
              <KanbanCard key={task.id} value={task.id}>
                <p className="pr-5 font-medium leading-5">{task.title}</p>
                <p className="text-muted-foreground mt-2 text-xs">
                  {task.meta}
                </p>
              </KanbanCard>
            ))}
          </KanbanColumnBody>
        </KanbanColumn>
      ))}
    </Kanban>
  )
}
