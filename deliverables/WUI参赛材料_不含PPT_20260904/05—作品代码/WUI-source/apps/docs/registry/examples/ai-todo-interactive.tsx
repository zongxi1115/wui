"use client"

import * as React from "react"
import { PlayIcon, RotateCcwIcon, BotIcon } from "lucide-react"

import {
  AiTodo,
  AiTodoHeader,
  AiTodoItem,
  AiTodoList,
  type AiTodoStatus,
} from "@/registry/ui/ai-todo"

interface TaskItem {
  id: string
  title: string
  description?: string
  status: AiTodoStatus
}

const initialTasks: TaskItem[] = [
  {
    id: "1",
    title: "分析用户提出的系统性能瓶颈",
    description: "解析慢查询日志与 APM 链路追踪数据。",
    status: "completed",
  },
  {
    id: "2",
    title: "重构数据库联合索引",
    description: "针对 user_orders 表中的 (tenant_id, created_at) 增加覆盖索引。",
    status: "in-progress",
  },
  {
    id: "3",
    title: "部署 Redis 二级缓存中间层",
    description: "配置热点商品详情的 30 秒滑动过期缓存。",
    status: "pending",
  },
  {
    id: "4",
    title: "压测验证与吞吐量评估",
    description: "使用 k6 模拟 5000 并发压测，确保 P99 延迟低于 50ms。",
    status: "pending",
  },
]

export default function AiTodoInteractive() {
  const [tasks, setTasks] = React.useState<TaskItem[]>(initialTasks)
  const [isRunning, setIsRunning] = React.useState(false)

  const completedCount = tasks.filter((t) => t.status === "completed").length
  const percent = Math.round((completedCount / tasks.length) * 100)

  // 模拟 Agent 自动逐步执行任务
  React.useEffect(() => {
    if (!isRunning) return

    const timer = setInterval(() => {
      setTasks((current) => {
        const inProgressIdx = current.findIndex((t) => t.status === "in-progress")
        if (inProgressIdx !== -1) {
          const next = [...current]
          next[inProgressIdx] = { ...next[inProgressIdx], status: "completed" }
          if (inProgressIdx + 1 < next.length) {
            next[inProgressIdx + 1] = { ...next[inProgressIdx + 1], status: "in-progress" }
          } else {
            setIsRunning(false)
          }
          return next
        }

        const pendingIdx = current.findIndex((t) => t.status === "pending")
        if (pendingIdx !== -1) {
          const next = [...current]
          next[pendingIdx] = { ...next[pendingIdx], status: "in-progress" }
          return next
        }

        setIsRunning(false)
        return current
      })
    }, 1500)

    return () => clearInterval(timer)
  }, [isRunning])

  const handleReset = () => {
    setIsRunning(false)
    setTasks(initialTasks)
  }

  return (
    <div className="w-full max-w-xl space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-semibold text-primary">
          <BotIcon className="size-4" />
          <span>AI 自动化调优任务流</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsRunning(!isRunning)}
            disabled={percent === 100}
            className="flex items-center gap-1 rounded-md bg-primary px-2.5 py-1 text-xs font-medium text-primary-foreground shadow-xs transition-opacity hover:opacity-90 disabled:opacity-40 cursor-pointer"
          >
            <PlayIcon className="size-3" />
            <span>{isRunning ? "暂停执行" : "自动执行"}</span>
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1 rounded-md border bg-background px-2.5 py-1 text-xs font-medium text-foreground shadow-xs transition-colors hover:bg-muted cursor-pointer"
          >
            <RotateCcwIcon className="size-3" />
            <span>重置</span>
          </button>
        </div>
      </div>

      <AiTodo>
        <AiTodoHeader>
          <span>执行任务清单</span>
          <div className="ml-auto flex items-center gap-2 text-xs text-muted-foreground">
            <span className="font-mono tabular-nums">{completedCount} / {tasks.length}</span>
            <span className="rounded bg-primary/10 px-1.5 py-0.5 font-mono text-[11px] font-semibold text-primary">
              {percent}%
            </span>
          </div>
        </AiTodoHeader>

        <AiTodoList>
          {tasks.map((task, idx) => (
            <AiTodoItem
              key={task.id}
              title={task.title}
              description={task.description}
              status={task.status}
              onStatusChange={(nextStatus) => {
                setTasks((prev) =>
                  prev.map((t, i) => (i === idx ? { ...t, status: nextStatus } : t))
                )
              }}
            />
          ))}
        </AiTodoList>
      </AiTodo>
    </div>
  )
}
