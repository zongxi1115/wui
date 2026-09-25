"use client"

import * as React from "react"
import { RotateCcwIcon } from "lucide-react"

import { Button } from "@/registry/ui/button"
import { Steps, type StepItem } from "@/registry/ui/steps"

const stages = [
  { title: "拉取代码", description: "main · a41c9e2" },
  { title: "构建镜像", description: "node 22 · pnpm 10" },
  { title: "集成测试", description: "312 个用例" },
  { title: "发布上线", description: "prod-cn-east" },
]

type Run = { current: number; failed: boolean }

export default function StepsStatus() {
  const [run, setRun] = React.useState<Run>({ current: 0, failed: false })
  const [running, setRunning] = React.useState(false)
  const attempt = React.useRef(0)

  React.useEffect(() => {
    if (!running) return
    const timer = window.setTimeout(() => {
      // 首次运行时让测试阶段失败，演示 error 状态；重试后顺利通过。
      if (run.current === 2 && attempt.current === 1) {
        setRun({ ...run, failed: true })
        setRunning(false)
        return
      }
      const next = run.current + 1
      setRun({ current: next, failed: false })
      if (next >= stages.length) setRunning(false)
    }, 900)
    return () => window.clearTimeout(timer)
  }, [run, running])

  const items: StepItem[] = stages.map((stage, index) =>
    run.failed && index === run.current
      ? { ...stage, status: "error", description: "2 个用例失败 · 查看日志" }
      : stage
  )
  const finished = run.current >= stages.length

  function start(from: number) {
    attempt.current += 1
    setRun({ current: from, failed: false })
    setRunning(true)
  }

  return (
    <div className="grid w-full max-w-2xl gap-8">
      <Steps items={items} current={run.current} aria-label="部署流水线" />
      <div className="flex items-center justify-between border-t pt-4">
        <p className="text-muted-foreground text-sm">
          {running
            ? `正在执行：${stages[run.current]?.title}`
            : run.failed
              ? "集成测试未通过，修复后可从失败阶段重试"
              : finished
                ? "发布完成，耗时 3 分 12 秒"
                : "流水线空闲"}
        </p>
        {run.failed ? (
          <Button size="sm" variant="outline" onClick={() => start(run.current)}>
            <RotateCcwIcon />
            从失败处重试
          </Button>
        ) : (
          <Button size="sm" disabled={running} onClick={() => start(0)}>
            {finished ? "重新部署" : "开始部署"}
          </Button>
        )}
      </div>
    </div>
  )
}
