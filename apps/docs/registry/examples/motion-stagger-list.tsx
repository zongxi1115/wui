"use client"

import * as React from "react"
import { CheckCircle2Icon, ClockIcon, RotateCcwIcon } from "lucide-react"
import { Button } from "@/registry/ui/button"
import { Motion } from "@/registry/ui/motion"

const tasks = [
  { id: 1, title: "系统架构微服务拆分评审", time: "10:00 AM", status: "已完成" },
  { id: 2, title: "与前端团队同步设计系统规范", time: "02:30 PM", status: "进行中" },
  { id: 3, title: "优化全站首屏渲染与动效降级策略", time: "04:00 PM", status: "待办" },
  { id: 4, title: "发布 v2.4 生产版本变更日志", time: "06:00 PM", status: "待办" },
]

export default function MotionStaggerList() {
  const [key, setKey] = React.useState(0)

  return (
    <div className="w-full max-w-md space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold">今日待办事项</h4>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setKey((k) => k + 1)}
          className="gap-1.5 text-xs"
        >
          <RotateCcwIcon className="size-3.5" />
          重播入场动画
        </Button>
      </div>

      <div key={key} className="space-y-2.5">
        {tasks.map((task, index) => (
          <Motion
            key={task.id}
            preset="slide-up"
            transition="spring"
            delay={index * 0.08}
            className="flex items-center justify-between rounded-lg border bg-card p-3 shadow-xs"
          >
            <div className="flex items-center gap-3">
              <CheckCircle2Icon
                className={
                  task.status === "已完成"
                    ? "size-4 text-emerald-500"
                    : "size-4 text-muted-foreground/50"
                }
              />
              <span className="text-xs font-medium">{task.title}</span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <ClockIcon className="size-3" />
              <span>{task.time}</span>
            </div>
          </Motion>
        ))}
      </div>
    </div>
  )
}
