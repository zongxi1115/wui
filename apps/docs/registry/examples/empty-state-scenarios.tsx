"use client"

import * as React from "react"
import { PlusIcon, RefreshCwIcon } from "lucide-react"

import { Button } from "@/registry/ui/button"
import {
  EmptyState,
  EmptyStateActions,
  EmptyStateDescription,
  EmptyStateHint,
  EmptyStateIllustration,
  EmptyStateMedia,
  EmptyStateTitle,
  type EmptyStateClassicIllustration,
} from "@/registry/ui/empty-state"
import { Tabs, TabsList, TabsTrigger } from "@/registry/ui/tabs"

type Scenario = {
  value: string
  label: string
  illustration: EmptyStateClassicIllustration
  title: string
  description: string
  primary?: { label: string; icon: React.ReactNode }
  secondary?: string
  hint?: string
}

const scenarios: Scenario[] = [
  {
    value: "onboarding",
    label: "首次使用",
    illustration: "add-task",
    title: "还没有任务",
    description: "把需求拆成任务并指派给成员，进度会自动汇总到迭代看板。",
    primary: { label: "新建任务", icon: <PlusIcon /> },
    secondary: "从 Jira 导入",
    hint: "按 C 可在任意页面快速创建任务",
  },
  {
    value: "done",
    label: "全部完成",
    illustration: "task-done",
    title: "今日待办已全部处理",
    description: "共完成 12 项任务，新的指派会实时出现在这里。",
    secondary: "查看已完成",
  },
  {
    value: "offline",
    label: "网络异常",
    illustration: "connection-lost",
    title: "无法连接到服务器",
    description: "请检查网络或代理设置，数据会在恢复连接后自动同步。",
    primary: { label: "重新连接", icon: <RefreshCwIcon /> },
  },
]

export default function EmptyStateScenarios() {
  const [value, setValue] = React.useState(scenarios[0].value)
  const scenario = scenarios.find((item) => item.value === value)!

  return (
    <div className="flex w-full max-w-lg flex-col items-center gap-4">
      <Tabs value={value} onValueChange={setValue}>
        <TabsList>
          {scenarios.map((item) => (
            <TabsTrigger key={item.value} value={item.value}>
              {item.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <EmptyState key={scenario.value} className="rounded-lg border border-dashed">
        <EmptyStateMedia>
          <EmptyStateIllustration name={scenario.illustration} className="w-32" />
        </EmptyStateMedia>
        <EmptyStateTitle>{scenario.title}</EmptyStateTitle>
        <EmptyStateDescription>{scenario.description}</EmptyStateDescription>
        <EmptyStateActions>
          {scenario.primary ? (
            <Button size="sm">
              {scenario.primary.icon}
              {scenario.primary.label}
            </Button>
          ) : null}
          {scenario.secondary ? (
            <Button size="sm" variant="outline">
              {scenario.secondary}
            </Button>
          ) : null}
        </EmptyStateActions>
        {scenario.hint ? <EmptyStateHint>{scenario.hint}</EmptyStateHint> : null}
      </EmptyState>
    </div>
  )
}
