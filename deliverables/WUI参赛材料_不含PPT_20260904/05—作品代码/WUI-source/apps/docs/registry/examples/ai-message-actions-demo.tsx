"use client"

import * as React from "react"
import {
  AiMessageActions,
  AiMessageBranch,
  AiMessageCopy,
  AiMessageFeedback,
  AiMessageRetry,
} from "@/registry/ui/ai-message-actions"

const SAMPLE_TEXT =
  "React 19 的 Server Actions 允许直接将异步函数作为表单的 action 处理，并自动追踪 pending 状态，极大简化了全栈数据交互。"

export default function AiMessageActionsDemo() {
  const [branch, setBranch] = React.useState(1)
  const [loading, setLoading] = React.useState(false)

  const handleRetry = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setBranch((b) => Math.min(3, b + 1))
    }, 1000)
  }

  return (
    <div className="w-full max-w-xl space-y-3">
      <div className="rounded-xl border bg-card p-4 text-sm leading-relaxed shadow-xs">
        <p className="text-foreground">{SAMPLE_TEXT}</p>

        <div className="mt-3 flex items-center justify-between border-t border-border/50 pt-2.5">
          <AiMessageBranch
            current={branch}
            total={3}
            onPrev={() => setBranch((b) => Math.max(1, b - 1))}
            onNext={() => setBranch((b) => Math.min(3, b + 1))}
          />

          <AiMessageActions>
            <AiMessageCopy content={SAMPLE_TEXT} />
            <AiMessageRetry isLoading={loading} onClick={handleRetry} />
            <AiMessageFeedback />
          </AiMessageActions>
        </div>
      </div>
    </div>
  )
}
