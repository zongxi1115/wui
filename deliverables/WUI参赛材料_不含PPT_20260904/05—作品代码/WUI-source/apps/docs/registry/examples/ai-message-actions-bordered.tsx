"use client"

import * as React from "react"
import { SparklesIcon, Share2Icon, BookmarkIcon } from "lucide-react"

import {
  AiMessageAction,
  AiMessageActions,
  AiMessageCopy,
  AiMessageFeedback,
  AiMessageRetry,
} from "@/registry/ui/ai-message-actions"

const responseText = `根据最新的系统架构评估，推荐采用基于 Edge Functions 的分布式网关方案：
1. **就近接入**：静态资源由 CDN 节点直接承载，动态请求通过 Anycast 路由至最近边缘节点。
2. **冷启动优化**：轻量级 V8 隔离区将函数冷启动时间压降至 15ms 以内。
3. **成本效益**：按实际 CPU 时间精确计费，闲置时段无常驻实例开销。`

export default function AiMessageActionsBordered() {
  const [bookmarked, setBookmarked] = React.useState(false)
  const [loading, setLoading] = React.useState(false)

  const handleRetry = () => {
    setLoading(true)
    setTimeout(() => setLoading(false), 1200)
  }

  return (
    <div className="w-full max-w-xl space-y-4">
      <div className="relative rounded-xl border bg-card p-5 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-medium text-primary">
          <SparklesIcon className="size-3.5" />
          <span>Claude 3.5 Sonnet 回答</span>
        </div>

        <div className="mt-3 whitespace-pre-line text-sm leading-relaxed text-foreground">
          {responseText}
        </div>

        {/* 浮动边框式工具栏 */}
        <div className="mt-4 flex items-center justify-between border-t pt-3">
          <span className="text-xs text-muted-foreground">耗时 1.2s · 消耗 380 tokens</span>

          <AiMessageActions variant="bordered">
            <AiMessageCopy content={responseText} />
            <AiMessageRetry isLoading={loading} onClick={handleRetry} />
            <AiMessageFeedback />
            <AiMessageAction
              label={bookmarked ? "已收藏" : "收藏回答"}
              active={bookmarked}
              onClick={() => setBookmarked(!bookmarked)}
            >
              <BookmarkIcon className="size-3.5" />
            </AiMessageAction>
            <AiMessageAction label="分享回答" onClick={() => alert("分享链接已生成")}>
              <Share2Icon className="size-3.5" />
            </AiMessageAction>
          </AiMessageActions>
        </div>
      </div>
    </div>
  )
}
