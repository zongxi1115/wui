"use client"

import * as React from "react"
import {
  AlertCircleIcon,
  CheckCircle2Icon,
  ClockIcon,
  FlameIcon,
  PlusIcon,
  TagIcon,
} from "lucide-react"

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
import { Badge } from "@/registry/ui/badge"
import { Button } from "@/registry/ui/button"

type Task = {
  id: string
  title: string
  tag: string
  priority: "high" | "medium" | "low"
  points: number
  assignee: string
}

type BoardData = Record<string, Task[]>

const INITIAL_BOARD: BoardData = {
  todo: [
    {
      id: "TASK-101",
      title: "实现 OAuth 2.0 第三方快捷登录",
      tag: "Auth",
      priority: "high",
      points: 5,
      assignee: "Alex",
    },
    {
      id: "TASK-102",
      title: "优化大屏图表在移动端的响应式排版",
      tag: "UI/UX",
      priority: "low",
      points: 2,
      assignee: "Zongxi",
    },
  ],
  in_progress: [
    {
      id: "TASK-103",
      title: "流式 AI 对话 Markdown 代码块高亮与复制",
      tag: "AI Agent",
      priority: "high",
      points: 8,
      assignee: "David",
    },
  ],
  review: [
    {
      id: "TASK-104",
      title: "补充全组件库 ARIA 键盘无障碍焦点审查",
      tag: "A11y",
      priority: "medium",
      points: 3,
      assignee: "Elena",
    },
  ],
  done: [
    {
      id: "TASK-105",
      title: "升级 Tailwind CSS v4 与 Motion 12 核心依赖",
      tag: "Core",
      priority: "medium",
      points: 5,
      assignee: "Alex",
    },
  ],
}

const COLUMN_CONFIG = [
  { id: "todo", title: "待办需求 (Todo)", icon: ClockIcon },
  { id: "in_progress", title: "开发中 (In Progress)", icon: FlameIcon },
  { id: "review", title: "代码评审 (Code Review)", icon: AlertCircleIcon },
  { id: "done", title: "已发布 (Done)", icon: CheckCircle2Icon },
]

export default function KanbanProjectBoard() {
  const [board, setBoard] = React.useState<BoardData>(INITIAL_BOARD)

  const handleMove = ({ itemId, from, to }: KanbanMove) => {
    setBoard((current) => {
      const task = current[from]?.find((t) => t.id === itemId)
      if (!task) return current
      return {
        ...current,
        [from]: current[from].filter((t) => t.id !== itemId),
        [to]: [...(current[to] || []), task],
      }
    })
  }

  return (
    <div className="w-full space-y-3">
      <div className="flex items-center justify-between">
        <div className="text-xs text-muted-foreground">
          提示：直接鼠标<strong>按住卡片并拖拽</strong>至其他列即可完成流转。
        </div>
        <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs">
          <PlusIcon className="size-3.5" />
          新建任务
        </Button>
      </div>

      <Kanban onMove={handleMove} className="w-full">
        {COLUMN_CONFIG.map(({ id, title, icon: Icon }) => {
          const tasks = board[id] || []
          return (
            <KanbanColumn key={id} value={id}>
              <KanbanColumnHeader>
                <div className="flex items-center gap-2">
                  <Icon className="size-3.5 text-muted-foreground" />
                  <KanbanColumnTitle>{title}</KanbanColumnTitle>
                  <KanbanColumnCount>{tasks.length}</KanbanColumnCount>
                </div>
              </KanbanColumnHeader>

              <KanbanColumnBody>
                {tasks.map((task) => (
                  <KanbanCard key={task.id} value={task.id} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] text-muted-foreground">
                        {task.id}
                      </span>
                      <Badge
                        variant={
                          task.priority === "high"
                            ? "destructive"
                            : task.priority === "medium"
                            ? "default"
                            : "secondary"
                        }
                        className="h-4 px-1 text-[9px]"
                      >
                        {task.priority.toUpperCase()}
                      </Badge>
                    </div>

                    <p className="font-medium text-xs leading-relaxed text-foreground">
                      {task.title}
                    </p>

                    <div className="flex items-center justify-between pt-1 border-t text-[11px] text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <TagIcon className="size-3" />
                        <span>{task.tag}</span>
                      </div>
                      <div className="flex items-center gap-1.5 font-medium">
                        <span className="flex size-5 items-center justify-center rounded-full bg-primary/10 text-[10px] text-primary">
                          {task.assignee.slice(0, 1)}
                        </span>
                        <span className="tabular-nums">{task.points} pts</span>
                      </div>
                    </div>
                  </KanbanCard>
                ))}
              </KanbanColumnBody>
            </KanbanColumn>
          )
        })}
      </Kanban>
    </div>
  )
}
