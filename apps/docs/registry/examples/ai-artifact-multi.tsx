"use client"

import * as React from "react"
import { RefreshCwIcon } from "lucide-react"

import { Badge } from "@/registry/ui/badge"
import {
  AiArtifact,
  AiArtifactAction,
  AiArtifactActions,
  AiArtifactBody,
  AiArtifactCode,
  AiArtifactCopy,
  AiArtifactFullscreenToggle,
  AiArtifactHeader,
  AiArtifactPanel,
  AiArtifactPreview,
  AiArtifactTabList,
  AiArtifactTabTrigger,
  AiArtifactTitle,
} from "@/registry/ui/ai-artifact"

const CODE = `type MetricProps = {
  title: string
  value: string
  change: string
}

export function Metric({ title, value, change }: MetricProps) {
  return (
    <div className="rounded-md border p-4">
      <div className="text-xs text-muted-foreground">{title}</div>
      <div className="mt-1 font-mono text-2xl tabular-nums">{value}</div>
      <div className="mt-1 text-xs text-success">{change}</div>
    </div>
  )
}`

const METRICS = [
  { title: "月活跃用户", value: "128,490", change: "较上周 +14.2%" },
  { title: "接口平均耗时", value: "42ms", change: "较上周 -8.5ms" },
]

function timestamp() {
  return new Date().toLocaleTimeString("zh-CN", { hour12: false })
}

export default function AiArtifactMulti() {
  const [tab, setTab] = React.useState("preview")
  const [generating, setGenerating] = React.useState(false)
  const [codeLength, setCodeLength] = React.useState(CODE.length)
  const [logs, setLogs] = React.useState([
    "[build] 编译完成，用时 312ms",
    "[preview] 已连接热更新",
  ])

  React.useEffect(() => {
    if (!generating) return
    const timer = window.setInterval(() => {
      setCodeLength((current) => Math.min(current + 12, CODE.length))
    }, 40)
    return () => window.clearInterval(timer)
  }, [generating])

  React.useEffect(() => {
    if (!generating || codeLength < CODE.length) return
    setGenerating(false)
    setLogs((current) => [...current, `[build] ${timestamp()} 重新生成完成`])
  }, [codeLength, generating])

  function regenerate() {
    setCodeLength(0)
    setTab("code")
    setGenerating(true)
  }

  return (
    <AiArtifact
      className="mx-auto w-full max-w-2xl"
      activeTab={tab}
      onTabChange={setTab}
      isStreaming={generating}
    >
      <AiArtifactHeader
        badge={
          <Badge variant="outline" size="sm">
            {generating ? "生成中" : "v2"}
          </Badge>
        }
      >
        <AiArtifactTitle>Metric.tsx</AiArtifactTitle>
        <div className="ml-auto flex items-center gap-2">
          <AiArtifactTabList>
            <AiArtifactTabTrigger value="preview">预览</AiArtifactTabTrigger>
            <AiArtifactTabTrigger value="code">代码</AiArtifactTabTrigger>
            <AiArtifactTabTrigger value="console">日志</AiArtifactTabTrigger>
          </AiArtifactTabList>
          <AiArtifactActions>
            <AiArtifactAction
              label="重新生成"
              disabled={generating}
              onClick={regenerate}
            >
              <RefreshCwIcon className="size-3.5" />
            </AiArtifactAction>
            <AiArtifactCopy content={CODE} />
            <AiArtifactFullscreenToggle />
          </AiArtifactActions>
        </div>
      </AiArtifactHeader>

      <AiArtifactBody className="min-h-72">
        <AiArtifactPanel value="preview" className="p-0">
          <AiArtifactPreview className="min-h-72">
            <div className="grid w-full max-w-md grid-cols-1 gap-3 sm:grid-cols-2">
              {METRICS.map((metric) => (
                <div
                  key={metric.title}
                  className="rounded-md border bg-background p-4"
                >
                  <div className="text-xs text-muted-foreground">{metric.title}</div>
                  <div className="mt-1 font-mono text-2xl tabular-nums text-foreground">
                    {metric.value}
                  </div>
                  <div className="mt-1 text-xs text-success">{metric.change}</div>
                </div>
              ))}
            </div>
          </AiArtifactPreview>
        </AiArtifactPanel>

        <AiArtifactPanel value="code" className="p-0">
          <AiArtifactCode code={CODE.slice(0, codeLength)} language="tsx" />
        </AiArtifactPanel>

        <AiArtifactPanel
          value="console"
          className="space-y-1 bg-muted/40 font-mono text-xs leading-5 text-muted-foreground"
        >
          {logs.map((log, index) => (
            <div key={index}>{log}</div>
          ))}
        </AiArtifactPanel>
      </AiArtifactBody>
    </AiArtifact>
  )
}
