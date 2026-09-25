"use client"

import * as React from "react"
import { AnimatePresence, motion } from "motion/react"
import { CheckIcon, LoaderCircleIcon, RotateCcwIcon } from "lucide-react"

import { Button } from "@/registry/ui/button"
import {
  Timeline,
  TimelineContent,
  TimelineDescription,
  TimelineDot,
  TimelineHeader,
  TimelineItem,
  TimelineTime,
  TimelineTitle,
} from "@/registry/ui/timeline"

const stages = [
  { title: "合并主干", description: "PR #1284 已通过 2 位评审", time: "14:02" },
  { title: "构建镜像", description: "registry/web:2.5.0 · 182 MB", time: "14:05" },
  { title: "集成测试", description: "412 个用例全部通过", time: "14:11" },
  { title: "灰度发布 10%", description: "华东 2 区 · 错误率 0.02%", time: "14:26" },
  { title: "全量发布", description: "全部 6 个可用区", time: "14:40" },
]

export default function TimelineLive() {
  const [current, setCurrent] = React.useState(2)
  const [run, setRun] = React.useState(0)
  const finished = current >= stages.length

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="mb-5 flex items-center justify-between gap-3 border-b pb-3">
        <div className="min-w-0">
          <p className="text-sm font-medium">发布 v2.5.0</p>
          <p className="text-muted-foreground text-xs">
            {finished
              ? "已完成全部阶段"
              : `进行中 · 第 ${current + 1}/${stages.length} 阶段`}
          </p>
        </div>
        <div className="flex shrink-0 gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              setCurrent(0)
              setRun((value) => value + 1)
            }}
          >
            <RotateCcwIcon />
            重放
          </Button>
          <Button
            size="sm"
            disabled={finished}
            onClick={() => setCurrent((value) => value + 1)}
          >
            完成当前阶段
          </Button>
        </div>
      </div>

      <Timeline key={run}>
        {stages.map((stage, index) => {
          const state =
            index < current
              ? "complete"
              : index === current
                ? "current"
                : "upcoming"

          return (
            <TimelineItem key={stage.title} state={state}>
              <TimelineDot
                size="icon"
                variant={
                  state === "complete"
                    ? "success"
                    : state === "current"
                      ? "primary"
                      : "default"
                }
                pulse={state === "current"}
                className={
                  state === "upcoming"
                    ? "bg-muted text-muted-foreground"
                    : undefined
                }
              >
                <AnimatePresence initial={false} mode="popLayout">
                  <motion.span
                    key={state}
                    className="flex"
                    initial={{ scale: 0.4, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.4, opacity: 0 }}
                    transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {state === "complete" ? (
                      <CheckIcon />
                    ) : state === "current" ? (
                      <LoaderCircleIcon className="animate-spin motion-reduce:animate-none" />
                    ) : (
                      <span className="text-[11px] font-medium tabular-nums">
                        {index + 1}
                      </span>
                    )}
                  </motion.span>
                </AnimatePresence>
              </TimelineDot>
              <TimelineContent className="pt-1.5">
                <TimelineHeader>
                  <TimelineTitle>{stage.title}</TimelineTitle>
                  {state === "complete" ? (
                    <TimelineTime>{stage.time}</TimelineTime>
                  ) : null}
                </TimelineHeader>
                <TimelineDescription>
                  {state === "current" ? "执行中…" : stage.description}
                </TimelineDescription>
              </TimelineContent>
            </TimelineItem>
          )
        })}
      </Timeline>
    </div>
  )
}
