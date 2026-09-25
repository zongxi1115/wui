"use client"

import * as React from "react"

import {
  AiTodo,
  AiTodoHeader,
  AiTodoItem,
  AiTodoList,
  AiTodoProgress,
  type AiTodoStatus,
} from "@/registry/ui/ai-todo"

const initialItems: Array<{
  title: string
  description?: string
  status: AiTodoStatus
}> = [
  { title: "读取登录页现有结构", status: "completed" },
  {
    title: "重组表单信息层级",
    description: "保留原有校验与提交逻辑。",
    status: "in-progress",
  },
  { title: "核对移动端间距与点击区域", status: "pending" },
]

export default function AiTodoDemo() {
  const [items, setItems] = React.useState(initialItems)
  const completed = items.filter((item) => item.status === "completed").length

  return (
    <AiTodo className="mx-auto w-full max-w-xl">
      <AiTodoHeader>
        实施计划
        <span className="ml-auto font-mono text-xs font-normal tabular-nums text-muted-foreground">
          {completed}/{items.length}
        </span>
      </AiTodoHeader>
      <AiTodoProgress value={completed} max={items.length} />
      <AiTodoList>
        {items.map((item, index) => (
          <AiTodoItem
            key={item.title}
            {...item}
            onStatusChange={(status) =>
              setItems((current) =>
                current.map((entry, itemIndex) =>
                  itemIndex === index ? { ...entry, status } : entry
                )
              )
            }
          />
        ))}
      </AiTodoList>
    </AiTodo>
  )
}
