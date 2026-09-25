"use client"

import * as React from "react"
import { RotateCcwIcon, SearchIcon } from "lucide-react"

import { Button } from "@/registry/ui/button"
import {
  AiCitation,
  AiSourceItem,
  AiSources,
  AiSourcesContent,
  AiSourcesHeader,
  AiSourcesList,
} from "@/registry/ui/ai-sources"
import { AiStream } from "@/registry/ui/ai-stream"
import { TextShimmer } from "@/registry/ui/text-shimmer"

const SOURCES = [
  {
    index: 1,
    title: "Web Vitals 指标说明",
    domain: "web.dev",
    href: "https://web.dev/articles/vitals",
    snippet: "LCP 衡量最大内容元素的渲染时间，良好阈值为 2.5 秒以内。",
  },
  {
    index: 2,
    title: "优化 Largest Contentful Paint",
    domain: "web.dev",
    href: "https://web.dev/articles/optimize-lcp",
    snippet: "预加载首屏关键图片，并避免它被懒加载或排在低优先级队列中。",
  },
  {
    index: 3,
    title: "fetchpriority 属性",
    domain: "developer.mozilla.org",
    href: "https://developer.mozilla.org/docs/Web/HTML/Element/img#fetchpriority",
    snippet: "为首屏主图设置 fetchpriority=high，可让浏览器更早发起请求。",
  },
]

/** Answer segments; a citation is rendered after each segment that has one. */
const SEGMENTS = [
  { text: "首页 LCP 偏高，主要是首屏主图加载太晚。LCP 的良好阈值是 2.5 秒", cite: 0 },
  { text: "，而当前主图在脚本执行后才开始请求。建议在 head 中预加载主图并取消它的懒加载", cite: 1 },
  { text: "，同时给图片加上 fetchpriority=\"high\"", cite: 2 },
  { text: "。预计 LCP 可以回到 2 秒左右。" },
]

const FULL_LENGTH = SEGMENTS.reduce((sum, segment) => sum + segment.text.length, 0)

type Phase = "searching" | "answering" | "done"

export default function AiSourcesStreaming() {
  const [phase, setPhase] = React.useState<Phase>("searching")
  const [length, setLength] = React.useState(0)

  React.useEffect(() => {
    if (phase === "searching") {
      const timer = window.setTimeout(() => setPhase("answering"), 1200)
      return () => window.clearTimeout(timer)
    }
    if (phase !== "answering") return

    const timer = window.setInterval(() => {
      setLength((current) => Math.min(current + 2, FULL_LENGTH))
    }, 40)
    return () => window.clearInterval(timer)
  }, [phase])

  React.useEffect(() => {
    if (phase === "answering" && length === FULL_LENGTH) setPhase("done")
  }, [length, phase])

  // Walk the segments to find how much of each one is visible.
  let remaining = length
  const visible = SEGMENTS.map((segment) => {
    const text = segment.text.slice(0, Math.max(remaining, 0))
    remaining -= segment.text.length
    return { ...segment, text, complete: text.length === segment.text.length }
  })

  const cited = visible.filter(
    (segment) => segment.complete && segment.cite !== undefined
  ).length

  return (
    <div className="mx-auto w-full max-w-2xl space-y-3">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <SearchIcon className="size-3.5" />
          {phase === "searching" ? (
            <TextShimmer>正在搜索网页…</TextShimmer>
          ) : (
            <span>已搜索 3 个网页</span>
          )}
        </div>
        <Button
          size="sm"
          variant="ghost"
          disabled={phase !== "done"}
          onClick={() => {
            setLength(0)
            setPhase("searching")
          }}
        >
          <RotateCcwIcon />
          重新生成
        </Button>
      </div>

      <div className="min-h-20 text-sm leading-7 text-foreground">
        {visible.map((segment, index) =>
          segment.text ? (
            <React.Fragment key={index}>
              <AiStream
                className="inline"
                isStreaming={phase === "answering" && !segment.complete}
                caret={phase === "answering" && !segment.complete}
              >
                {segment.text}
              </AiStream>
              {segment.complete && segment.cite !== undefined ? (
                <AiCitation
                  className="duration-300 animate-in fade-in-0 zoom-in-50"
                  {...SOURCES[segment.cite]}
                />
              ) : null}
            </React.Fragment>
          ) : null
        )}
      </div>

      {cited > 0 ? (
        <AiSources count={cited} defaultOpen>
          <AiSourcesHeader />
          <AiSourcesContent>
            <AiSourcesList>
              {SOURCES.slice(0, cited).map((source) => (
                <AiSourceItem key={source.index} {...source} />
              ))}
            </AiSourcesList>
          </AiSourcesContent>
        </AiSources>
      ) : null}
    </div>
  )
}
