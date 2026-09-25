"use client"

import * as React from "react"
import { RotateCcwIcon } from "lucide-react"

import { Button } from "@/registry/ui/button"
import {
  AiTool,
  AiToolCode,
  AiToolContent,
  AiToolLabel,
  AiToolSection,
  AiToolTrigger,
  type AiToolStatus,
} from "@/registry/ui/ai-tool"

const TOOLS = [
  {
    name: "query_error_logs",
    input: `{
  "service": "api-gateway",
  "level": "error",
  "since": "15m"
}`,
    result: "捕获 14 条 504 Gateway Timeout，全部来自 /api/checkout。",
  },
  {
    name: "inspect_db_pool",
    input: `{
  "cluster": "orders-primary",
  "metrics": ["active", "waiting", "avg_wait_ms"]
}`,
    result: "连接池占用 98/100，42 个请求排队，平均等待 4.8s。",
  },
  {
    name: "explain_slow_query",
    input: `{
  "sql": "SELECT * FROM orders WHERE user_id = $1 AND status = 'pending' ORDER BY created_at DESC"
}`,
    result: "全表扫描 120 万行；建议新增 (user_id, status, created_at) 联合索引。",
  },
]

export default function AiToolChain() {
  // Index of the tool currently running; TOOLS.length means the chain finished.
  const [step, setStep] = React.useState(0)
  const [open, setOpen] = React.useState<Record<string, boolean>>({})

  React.useEffect(() => {
    if (step >= TOOLS.length) return
    const timer = window.setTimeout(() => setStep((current) => current + 1), 1800)
    return () => window.clearTimeout(timer)
  }, [step])

  function statusOf(index: number): AiToolStatus {
    if (index < step) return "success"
    if (index === step) return "running"
    return "pending"
  }

  return (
    <div className="mx-auto w-full max-w-xl space-y-3">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs text-muted-foreground">
          排查结算接口超时 · 已完成 {Math.min(step, TOOLS.length)}/{TOOLS.length} 次调用
        </p>
        <Button
          size="sm"
          variant="ghost"
          disabled={step < TOOLS.length}
          onClick={() => {
            setOpen({})
            setStep(0)
          }}
        >
          <RotateCcwIcon />
          重新执行
        </Button>
      </div>

      {TOOLS.map((tool, index) => {
        const status = statusOf(index)
        return (
          <AiTool
            key={tool.name}
            status={status}
            open={open[tool.name] ?? status === "running"}
            onOpenChange={(next) =>
              setOpen((current) => ({ ...current, [tool.name]: next }))
            }
          >
            <AiToolTrigger name={tool.name} />
            <AiToolContent>
              <AiToolSection>
                <AiToolLabel>输入</AiToolLabel>
                <AiToolCode>{tool.input}</AiToolCode>
              </AiToolSection>
              <AiToolSection className="text-xs leading-5">
                <AiToolLabel>结果</AiToolLabel>
                {status === "success" ? (
                  <span className="text-foreground">{tool.result}</span>
                ) : (
                  <span className="text-muted-foreground">
                    {status === "running" ? "等待工具返回…" : "排队中"}
                  </span>
                )}
              </AiToolSection>
            </AiToolContent>
          </AiTool>
        )
      })}
    </div>
  )
}
