"use client"

import * as React from "react"
import { CheckIcon, LoaderCircleIcon, PlayIcon } from "lucide-react"

import { Button } from "@/registry/ui/button"
import { TextMorph } from "@/registry/ui/text-morph"

const stages = [
  "等待部署",
  "正在拉取依赖",
  "正在构建产物",
  "正在运行测试",
  "正在发布到生产",
  "已发布到生产",
]

export default function TextMorphStepper() {
  const [step, setStep] = React.useState(0)
  const timer = React.useRef<number | undefined>(undefined)
  const running = step > 0 && step < stages.length - 1
  const finished = step === stages.length - 1

  React.useEffect(() => () => window.clearInterval(timer.current), [])

  const run = () => {
    window.clearInterval(timer.current)
    setStep(1)
    timer.current = window.setInterval(() => {
      setStep((current) => {
        if (current >= stages.length - 1) {
          window.clearInterval(timer.current)
          return current
        }
        return current + 1
      })
    }, 1100)
  }

  return (
    <div className="flex w-full max-w-md items-center gap-3 rounded-lg border bg-background p-4">
      <span className="bg-muted flex size-8 shrink-0 items-center justify-center rounded-full">
        {finished ? (
          <CheckIcon className="text-success size-4" />
        ) : running ? (
          <LoaderCircleIcon className="text-muted-foreground size-4 animate-spin" />
        ) : (
          <span className="bg-muted-foreground/60 size-1.5 rounded-full" />
        )}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-muted-foreground text-xs">
          官网 · main 分支 · 第 {Math.max(step, 1)} / {stages.length - 1} 步
        </p>
        <TextMorph as="p" className="text-sm font-medium">
          {stages[step]}
        </TextMorph>
      </div>
      <Button variant="outline" size="sm" onClick={run} disabled={running}>
        <PlayIcon />
        {finished ? "重新部署" : "部署"}
      </Button>
    </div>
  )
}
