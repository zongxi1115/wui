"use client"

import * as React from "react"

import {
  AiMessageActions,
  AiMessageBranch,
  AiMessageCopy,
  AiMessageFeedback,
  AiMessageRetry,
} from "@/registry/ui/ai-message-actions"

const ANSWERS = [
  "useActionState 接收一个 action 和初始状态，返回当前状态、可直接绑定到表单的 action，以及 isPending。提交中的禁用、错误回显都可以从这三个值派生。",
  "可以把它理解为「为表单提交定制的 useReducer」：每次提交都会以上一次的状态调用 action，返回值成为新的状态，并自动追踪进行中的过渡。",
  "如果只需要知道表单是否在提交中，用 useFormStatus 更轻；需要保存提交结果或错误信息时，再使用 useActionState。",
]

export default function AiMessageActionsDemo() {
  const [branch, setBranch] = React.useState(1)
  const [total, setTotal] = React.useState(1)
  const [loading, setLoading] = React.useState(false)

  React.useEffect(() => {
    if (!loading) return
    const timer = window.setTimeout(() => {
      setLoading(false)
      setTotal((current) => Math.min(current + 1, ANSWERS.length))
      setBranch((current) => Math.min(current + 1, ANSWERS.length))
    }, 900)
    return () => window.clearTimeout(timer)
  }, [loading])

  const answer = ANSWERS[branch - 1]

  return (
    <div className="mx-auto w-full max-w-xl space-y-2">
      <p
        key={branch}
        className="text-sm leading-7 text-foreground duration-300 animate-in fade-in-0"
      >
        {answer}
      </p>

      <div className="-ml-1.5 flex items-center gap-1">
        <AiMessageActions>
          <AiMessageCopy content={answer} />
          <AiMessageRetry
            isLoading={loading}
            disabled={total >= ANSWERS.length}
            onClick={() => setLoading(true)}
          />
          <AiMessageFeedback key={branch} />
        </AiMessageActions>
        <AiMessageBranch
          current={branch}
          total={total}
          onPrev={() => setBranch((current) => Math.max(1, current - 1))}
          onNext={() => setBranch((current) => Math.min(total, current + 1))}
        />
      </div>
    </div>
  )
}
