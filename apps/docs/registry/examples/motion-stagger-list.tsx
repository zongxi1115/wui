"use client"

import * as React from "react"
import { CircleCheckIcon, CircleDashedIcon, CircleDotIcon, RotateCcwIcon } from "lucide-react"

import { Button } from "@/registry/ui/button"
import { Motion, MotionGroup } from "@/registry/ui/motion"

const tasks = [
  { id: 1, title: "评审权限中心的角色继承方案", time: "10:00", status: "done" },
  { id: 2, title: "与设计同步表格组件的密度规范", time: "14:30", status: "doing" },
  { id: 3, title: "排查导出报表的内存占用问题", time: "16:00", status: "todo" },
  { id: 4, title: "撰写 v2.4 发布说明", time: "18:00", status: "todo" },
] as const

const statusIcon = {
  done: <CircleCheckIcon className="text-success size-4" />,
  doing: <CircleDotIcon className="text-info size-4" />,
  todo: <CircleDashedIcon className="text-muted-foreground size-4" />,
}

export default function MotionStaggerList() {
  const [key, setKey] = React.useState(0)

  return (
    <div className="w-full max-w-md">
      <div className="mb-3 flex items-center justify-between">
        <h4 className="text-sm font-medium">今日待办</h4>
        <Button variant="ghost" size="sm" onClick={() => setKey((k) => k + 1)}>
          <RotateCcwIcon />
          重播
        </Button>
      </div>

      <MotionGroup
        key={key}
        stagger={0.07}
        preset="slide-up"
        transition="gentle"
        className="divide-y rounded-lg border"
      >
        {tasks.map((task) => (
          <Motion
            key={task.id}
            className="flex items-center gap-3 px-4 py-3"
          >
            {statusIcon[task.status]}
            <span
              className={
                task.status === "done"
                  ? "text-muted-foreground flex-1 text-sm line-through"
                  : "flex-1 text-sm"
              }
            >
              {task.title}
            </span>
            <span className="text-muted-foreground font-mono text-xs tabular-nums">
              {task.time}
            </span>
          </Motion>
        ))}
      </MotionGroup>
    </div>
  )
}
