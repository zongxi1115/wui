"use client"

import * as React from "react"
import { BotIcon, CheckCircleIcon } from "lucide-react"

import {
  AiMessageActions,
  AiMessageBranch,
  AiMessageCopy,
  AiMessageFeedback,
  AiMessageRetry,
} from "@/registry/ui/ai-message-actions"

const versions = [
  {
    id: 1,
    title: "版本 1（技术详尽版）",
    content:
      "在 React 19 中，你可以使用 `useActionState` 管理异步表单状态。它接收一个 action 函数和初始状态，返回 [state, formAction, isPending]，极大简化了提交中的加载反馈与错误回显逻辑。",
  },
  {
    id: 2,
    title: "版本 2（极简代码示例）",
    content:
      "核心代码示例：\n```tsx\nconst [state, formAction, isPending] = useActionState(updateName, null)\nreturn <form action={formAction}><button disabled={isPending}>保存</button></form>\n```",
  },
  {
    id: 3,
    title: "版本 3（与 React 18 对比）",
    content:
      "相较于 React 18 手动 useState + try/catch/finally 的繁琐模式，React 19 Action 原生与服务端组件、流式 Suspense 和渐进增强表单无缝融合。",
  },
]

export default function AiMessageActionsBranching() {
  const [currentIdx, setCurrentIdx] = React.useState(0)
  const [loading, setLoading] = React.useState(false)
  const [copiedNotice, setCopiedNotice] = React.useState(false)

  const activeVersion = versions[currentIdx]

  const handleRetry = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      // Switch to next or loop
      setCurrentIdx((prev) => (prev + 1) % versions.length)
    }, 800)
  }

  const handleCopy = () => {
    setCopiedNotice(true)
    setTimeout(() => setCopiedNotice(false), 2000)
  }

  return (
    <div className="w-full max-w-xl space-y-3">
      <div className="rounded-xl border bg-card p-5 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold text-primary">
            <BotIcon className="size-4" />
            <span>{activeVersion.title}</span>
          </div>
          {copiedNotice && (
            <span className="flex items-center gap-1 text-xs text-emerald-500 font-medium animate-in fade-in">
              <CheckCircleIcon className="size-3.5" /> 已复制到剪贴板
            </span>
          )}
        </div>

        <div className="mt-3 whitespace-pre-line text-sm leading-relaxed text-foreground">
          {activeVersion.content}
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-3">
          {/* 版本分支切换器 */}
          <AiMessageBranch
            current={currentIdx + 1}
            total={versions.length}
            onPrev={() => setCurrentIdx((p) => Math.max(0, p - 1))}
            onNext={() => setCurrentIdx((p) => Math.min(versions.length - 1, p + 1))}
          />

          {/* 快捷操作区 */}
          <AiMessageActions>
            <AiMessageCopy content={activeVersion.content} onCopy={handleCopy} />
            <AiMessageRetry isLoading={loading} onClick={handleRetry} />
            <AiMessageFeedback />
          </AiMessageActions>
        </div>
      </div>
    </div>
  )
}
