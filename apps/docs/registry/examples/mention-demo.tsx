"use client"

import * as React from "react"
import { SparklesIcon, UserIcon, Code2Icon } from "lucide-react"
import { Badge } from "@/registry/ui/badge"
import { Button } from "@/registry/ui/button"
import { Mention, type MentionOption } from "@/registry/ui/mention"

const MENTION_OPTIONS: MentionOption[] = [
  {
    id: "claude",
    label: "Claude-3.5",
    description: "深度思考与代码推理助手",
    icon: <SparklesIcon className="size-3.5 text-primary" />,
    badge: <Badge variant="secondary" className="text-[10px] py-0">AI</Badge>,
  },
  {
    id: "alex",
    label: "Alex Chen",
    description: "前端系统架构师 (@alex)",
    icon: <UserIcon className="size-3.5" />,
    badge: <Badge variant="outline" className="text-[10px] py-0">Team</Badge>,
  },
  {
    id: "review-bot",
    label: "CodeReviewBot",
    description: "自动化代码评审与类型审计",
    icon: <Code2Icon className="size-3.5 text-info" />,
    badge: <Badge variant="secondary" className="text-[10px] py-0">Bot</Badge>,
  },
]

export default function MentionDemo() {
  const [value, setValue] = React.useState("请 @Claude-3.5 帮忙审查这个方案，并同步给 @Alex Chen ")

  return (
    <div className="flex w-full max-w-lg flex-col gap-3">
      <div className="rounded-xl border bg-card p-4 shadow-xs">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs font-medium text-foreground">任务指派与讨论</span>
          <span className="text-[11px] text-muted-foreground">输入 @ 唤起候选名单</span>
        </div>
        <Mention
          value={value}
          onValueChange={setValue}
          options={MENTION_OPTIONS}
          placeholder="键入 @ 提及成员、AI 助手或机器人..."
        />
        <div className="mt-3 flex items-center justify-between border-t border-border/50 pt-2.5">
          <span className="text-[11px] text-muted-foreground font-mono">
            {value.length} 字符
          </span>
          <Button size="sm" onClick={() => setValue("")}>
            清空内容
          </Button>
        </div>
      </div>
    </div>
  )
}
