"use client"

import * as React from "react"
import { SparklesIcon } from "lucide-react"

import {
  AiTodo,
  AiTodoHeader,
  AiTodoItem,
  AiTodoList,
  type AiTodoStatus,
} from "@/registry/ui/ai-todo"

export default function AiTodoWorkflow() {
  const steps: Array<{
    title: string
    description?: string
    status: AiTodoStatus
  }> = [
    {
      title: "静态代码质量与安全性扫描",
      description: "ESLint 与 SonarQube 检查通过，0 致命漏洞。",
      status: "completed",
    },
    {
      title: "自动生成单元测试套件",
      description: "覆盖率提升至 92.4%，18 个用例全部通过。",
      status: "completed",
    },
    {
      title: "端到端集成测试 (Playwright)",
      description: "正在模拟多用户并发下单与结算流程...",
      status: "in-progress",
    },
    {
      title: "旧版本灰度流量回滚预案",
      description: "因全链路验证顺利，已跳过回滚步骤。",
      status: "cancelled",
    },
    {
      title: "全量上线生产集群",
      description: "等待自动化金丝雀发布完成确认。",
      status: "pending",
    },
  ]

  return (
    <div className="w-full max-w-xl space-y-3">
      <AiTodo>
        <AiTodoHeader>
          <div className="flex items-center gap-2">
            <SparklesIcon className="size-4 text-primary" />
            <span className="font-semibold">发布部署流水线 (Read-only)</span>
          </div>
          <span className="ml-auto rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
            Stage 3 of 5
          </span>
        </AiTodoHeader>

        <AiTodoList>
          {steps.map((step) => (
            <AiTodoItem
              key={step.title}
              title={step.title}
              description={step.description}
              status={step.status}
            />
          ))}
        </AiTodoList>
      </AiTodo>
    </div>
  )
}
