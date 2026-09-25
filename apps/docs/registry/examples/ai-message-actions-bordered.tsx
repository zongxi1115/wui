"use client"

import * as React from "react"
import { BookmarkIcon, Share2Icon } from "lucide-react"

import {
  AiMessageAction,
  AiMessageActions,
  AiMessageCopy,
  AiMessageFeedback,
  AiMessageRetry,
} from "@/registry/ui/ai-message-actions"

const RESPONSE = `推荐把网关迁移到边缘函数：
1. 静态资源由 CDN 直出，动态请求就近路由到边缘节点；
2. 轻量运行时的冷启动在 15ms 以内，不需要常驻实例；
3. 按实际 CPU 时间计费，夜间低峰几乎没有成本。`

export default function AiMessageActionsBordered() {
  const [saved, setSaved] = React.useState(false)
  const [shared, setShared] = React.useState(false)
  const [loading, setLoading] = React.useState(false)

  React.useEffect(() => {
    if (!loading) return
    const timer = window.setTimeout(() => setLoading(false), 1200)
    return () => window.clearTimeout(timer)
  }, [loading])

  React.useEffect(() => {
    if (!shared) return
    const timer = window.setTimeout(() => setShared(false), 1800)
    return () => window.clearTimeout(timer)
  }, [shared])

  return (
    <div className="mx-auto w-full max-w-xl">
      <p className="whitespace-pre-line text-sm leading-7 text-foreground">
        {RESPONSE}
      </p>

      <div className="mt-2 flex items-center gap-3">
        <AiMessageActions variant="bordered">
          <AiMessageCopy content={RESPONSE} />
          <AiMessageRetry isLoading={loading} onClick={() => setLoading(true)} />
          <AiMessageFeedback />
          <AiMessageAction
            label={saved ? "取消收藏" : "收藏回答"}
            aria-pressed={saved}
            active={saved}
            onClick={() => setSaved((current) => !current)}
          >
            <BookmarkIcon
              className={saved ? "size-3.5 fill-current" : "size-3.5"}
            />
          </AiMessageAction>
          <AiMessageAction label="复制分享链接" onClick={() => setShared(true)}>
            <Share2Icon className="size-3.5" />
          </AiMessageAction>
        </AiMessageActions>

        <span
          role="status"
          className="text-xs text-muted-foreground transition-opacity duration-200 data-[visible=false]:opacity-0"
          data-visible={shared}
        >
          分享链接已复制
        </span>
        <span className="ml-auto text-xs tabular-nums text-muted-foreground">
          1.2s · 380 tokens
        </span>
      </div>
    </div>
  )
}
