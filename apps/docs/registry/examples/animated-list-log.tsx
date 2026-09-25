"use client"

import * as React from "react"
import { CheckIcon, RotateCcwIcon } from "lucide-react"

import { AnimatedList } from "@/registry/ui/animated-list"
import { Button } from "@/registry/ui/button"

const steps = [
  { time: "00:02", text: "拉取代码 main@8f3c21a" },
  { time: "00:14", text: "安装依赖，命中缓存 96%" },
  { time: "00:41", text: "类型检查与单元测试通过" },
  { time: "01:08", text: "构建产物 2.4 MB（gzip 612 KB）" },
  { time: "01:15", text: "发布到预览环境" },
]

export default function AnimatedListLog() {
  const [run, setRun] = React.useState(0)

  return (
    <div className="flex w-full max-w-sm flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">构建记录 #2048</span>
        <Button variant="ghost" size="sm" onClick={() => setRun((current) => current + 1)}>
          <RotateCcwIcon />
          重新运行
        </Button>
      </div>
      <AnimatedList key={run} delay={900} className="gap-1.5" aria-label="构建记录">
        {steps.map((step) => (
          <div key={step.text} className="flex items-center gap-3 rounded-md border px-3 py-2 text-sm">
            <CheckIcon className="size-3.5 shrink-0 text-muted-foreground" />
            <span className="flex-1 truncate">{step.text}</span>
            <span className="font-mono text-xs text-muted-foreground">{step.time}</span>
          </div>
        ))}
      </AnimatedList>
    </div>
  )
}
