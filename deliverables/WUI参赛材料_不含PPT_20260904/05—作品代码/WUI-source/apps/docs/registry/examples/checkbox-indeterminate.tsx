"use client"

import * as React from "react"
import { Checkbox } from "@/registry/ui/checkbox"

interface SubTask {
  id: string
  label: string
  completed: boolean
}

export default function CheckboxIndeterminate() {
  const [tasks, setTasks] = React.useState<SubTask[]>([
    { id: "task-1", label: "完成需求评审与技术方案设计", completed: true },
    { id: "task-2", label: "实现核心业务组件与单元测试", completed: true },
    { id: "task-3", label: "编写交互规范与 API 文档", completed: false },
    { id: "task-4", label: "部署至预发环境并回归验证", completed: false },
  ])

  const allCompleted = tasks.every((t) => t.completed)
  const someCompleted = tasks.some((t) => t.completed)
  const isIndeterminate = someCompleted && !allCompleted

  const handleParentChange = (checked: boolean | "indeterminate") => {
    const nextCompleted = checked === true
    setTasks((prev) => prev.map((t) => ({ ...t, completed: nextCompleted })))
  }

  const handleChildChange = (id: string, checked: boolean | "indeterminate") => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: checked === true } : t))
    )
  }

  return (
    <div className="w-full max-w-md space-y-3 rounded-lg border border-border bg-card p-4 text-card-foreground">
      <div className="flex items-center gap-3 border-b border-border pb-3">
        <Checkbox
          id="select-all-tasks"
          checked={isIndeterminate ? "indeterminate" : allCompleted}
          onCheckedChange={handleParentChange}
        />
        <label
          htmlFor="select-all-tasks"
          className="cursor-pointer text-sm font-semibold leading-none"
        >
          全选项目交付物 ({tasks.filter((t) => t.completed).length}/{tasks.length})
        </label>
      </div>

      <div className="space-y-2.5 pl-6 pt-1">
        {tasks.map((task) => (
          <label
            key={task.id}
            htmlFor={task.id}
            className="flex cursor-pointer items-center gap-3 text-sm transition-colors hover:text-foreground"
          >
            <Checkbox
              id={task.id}
              size="sm"
              checked={task.completed}
              onCheckedChange={(checked) => handleChildChange(task.id, checked)}
            />
            <span
              className={task.completed ? "text-muted-foreground line-through" : "text-foreground"}
            >
              {task.label}
            </span>
          </label>
        ))}
      </div>
    </div>
  )
}
