"use client"

import * as React from "react"

import {
  AiTodo,
  AiTodoHeader,
  AiTodoItem,
  AiTodoList,
  type AiTodoStatus,
} from "@/registry/ui/ai-todo"

const initialItems: Array<{
  title: string
  description?: string
  status: AiTodoStatus
}> = [
  { title: "读取现有页面结构", status: "completed" },
  {
    title: "实现新的聊天布局",
    description: "保留主题变量和键盘交互。",
    status: "in-progress",
  },
  { title: "核对移动端密度", status: "pending" },
]

export default function AiTodoDemo() {
  const [items, setItems] = React.useState(initialItems)
  const completed = items.filter((item) => item.status === "completed").length

  return (
    <AiTodo className="mx-auto w-full max-w-xl">
      <AiTodoHeader>
        实施计划
        <span className="ml-auto text-xs font-normal text-muted-foreground">
          {completed}/{items.length}
        </span>
      </AiTodoHeader>
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
