"use client"

import * as React from "react"

import {
  AiMessageActions,
  AiMessageBranch,
  AiMessageCopy,
  AiMessageEdit,
  AiMessageFeedback,
  AiMessageRetry,
} from "@/registry/ui/ai-message-actions"

const VERSIONS = [
  {
    label: "详细解释",
    content:
      "在 React 19 中，useActionState 接收 action 函数和初始状态，返回 [state, formAction, isPending]。表单提交时 React 自动追踪过渡状态，你只需要根据 isPending 禁用按钮、根据 state 显示错误。",
  },
  {
    label: "只给代码",
    content:
      "const [state, formAction, isPending] = useActionState(updateName, null)\n\n<form action={formAction}>\n  <button disabled={isPending}>保存</button>\n</form>",
  },
  {
    label: "对比 React 18",
    content:
      "React 18 需要手动维护 loading、error 两个 state 并包一层 try/finally；React 19 把这部分收进 useActionState，并能与服务端 Action 和渐进增强表单直接配合。",
  },
]

export default function AiMessageActionsBranching() {
  const [index, setIndex] = React.useState(0)
  const [direction, setDirection] = React.useState(1)
  const [loading, setLoading] = React.useState(false)

  React.useEffect(() => {
    if (!loading) return
    const timer = window.setTimeout(() => {
      setLoading(false)
      setDirection(1)
      setIndex((current) => (current + 1) % VERSIONS.length)
    }, 800)
    return () => window.clearTimeout(timer)
  }, [loading])

  const version = VERSIONS[index]

  function go(next: number) {
    setDirection(next > index ? 1 : -1)
    setIndex(next)
  }

  return (
    <div className="mx-auto w-full max-w-xl space-y-4">
      <div className="flex justify-end">
        <div className="max-w-[80%] rounded-2xl rounded-br-md bg-primary px-4 py-2.5 text-sm text-primary-foreground">
          useActionState 应该怎么用？
        </div>
      </div>

      <div className="space-y-2">
        <div
          key={index}
          className={
            direction > 0
              ? "duration-300 animate-in fade-in-0 slide-in-from-right-2"
              : "duration-300 animate-in fade-in-0 slide-in-from-left-2"
          }
        >
          <div className="mb-1 text-xs text-muted-foreground">{version.label}</div>
          <p className="whitespace-pre-wrap text-sm leading-7 text-foreground">
            {version.content}
          </p>
        </div>

        <div className="-ml-1.5 flex items-center gap-1">
          <AiMessageBranch
            current={index + 1}
            total={VERSIONS.length}
            onPrev={() => go(Math.max(0, index - 1))}
            onNext={() => go(Math.min(VERSIONS.length - 1, index + 1))}
          />
          <AiMessageActions>
            <AiMessageCopy content={version.content} />
            <AiMessageRetry isLoading={loading} onClick={() => setLoading(true)} />
            <AiMessageEdit />
            <AiMessageFeedback key={index} />
          </AiMessageActions>
        </div>
      </div>
    </div>
  )
}
