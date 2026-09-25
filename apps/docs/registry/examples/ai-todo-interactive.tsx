"use client"

import * as React from "react"
import { PauseIcon, PlayIcon, RotateCcwIcon } from "lucide-react"

import { Button } from "@/registry/ui/button"
import {
  AiTodo,
  AiTodoHeader,
  AiTodoItem,
  AiTodoList,
  AiTodoProgress,
  type AiTodoStatus,
} from "@/registry/ui/ai-todo"

interface Task {
  id: string
  title: string
  description?: string
  status: AiTodoStatus
}

const INITIAL_TASKS: Task[] = [
  {
    id: "trace",
    title: "定位慢查询与调用链瓶颈",
    description: "对照 APM 链路，确认 P99 集中在订单列表接口。",
    status: "completed",
  },
  {
    id: "index",
    title: "为 orders 表补充联合索引",
    description: "(tenant_id, created_at) 覆盖列表页排序查询。",
    status: "in-progress",
  },
  {
    id: "cache",
    title: "为商品详情接入二级缓存",
    description: "热点数据 30 秒滑动过期，写入时主动失效。",
    status: "pending",
  },
  {
    id: "load-test",
    title: "压测并对比优化前后指标",
    description: "k6 模拟 5000 并发，目标 P99 低于 200ms。",
    status: "pending",
  },
]

/** Completes the running task and starts the next pending one. */
function advance(tasks: Task[]) {
  const running = tasks.findIndex((task) => task.status === "in-progress")
  const nextPending = tasks.findIndex(
    (task, index) => index > running && task.status === "pending"
  )
  return tasks.map((task, index) => {
    if (index === running) return { ...task, status: "completed" as const }
    if (index === nextPending) return { ...task, status: "in-progress" as const }
    return task
  })
}

export default function AiTodoInteractive() {
  const [tasks, setTasks] = React.useState(INITIAL_TASKS)
  const [running, setRunning] = React.useState(false)

  const completed = tasks.filter((task) => task.status === "completed").length
  const finished = completed === tasks.length

  React.useEffect(() => {
    if (!running) return
    if (finished) {
      setRunning(false)
      return
    }
    const timer = window.setTimeout(() => setTasks(advance), 1400)
    return () => window.clearTimeout(timer)
  }, [finished, running, tasks])

  return (
    <div className="mx-auto w-full max-w-xl space-y-3">
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          disabled={finished}
          onClick={() => setRunning((current) => !current)}
        >
          {running ? <PauseIcon /> : <PlayIcon />}
          {running ? "暂停" : "继续执行"}
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => {
            setRunning(false)
            setTasks(INITIAL_TASKS)
          }}
        >
          <RotateCcwIcon />
          重置
        </Button>
      </div>

      <AiTodo>
        <AiTodoHeader>
          性能优化计划
          <span className="ml-auto font-mono text-xs font-normal tabular-nums text-muted-foreground">
            {completed}/{tasks.length}
          </span>
        </AiTodoHeader>
        <AiTodoProgress value={completed} max={tasks.length} />
        <AiTodoList>
          {tasks.map((task) => (
            <AiTodoItem
              key={task.id}
              title={task.title}
              description={task.description}
              status={task.status}
              onStatusChange={(status) =>
                setTasks((current) =>
                  current.map((entry) =>
                    entry.id === task.id ? { ...entry, status } : entry
                  )
                )
              }
            />
          ))}
        </AiTodoList>
      </AiTodo>
    </div>
  )
}
