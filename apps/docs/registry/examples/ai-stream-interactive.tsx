"use client"

import * as React from "react"
import { PlayIcon, RotateCcwIcon, PauseIcon } from "lucide-react"

import { Button } from "@/registry/ui/button"
import { AiStream } from "@/registry/ui/ai-stream"
import { Badge } from "@/registry/ui/badge"

const SAMPLE_TEXT = `TypeScript 5.8 引入了针对返回类型推断与模块解析的多项重要优化。在大型单体仓库（Monorepo）中，类型检查吞吐量提升了约 25%。同时，原生支持 ECMAScript 模式匹配提案语法，使得在 Redux Reducer 或复杂状态机分支判断中，代码冗余大幅减少，类型收窄（Type Narrowing）更加可靠。`

export default function AiStreamInteractive() {
  const [displayedText, setDisplayedText] = React.useState("")
  const [isStreaming, setIsStreaming] = React.useState(false)
  const speed = 35 // ms per chunk
  const featherLength = 18
  const timerRef = React.useRef<NodeJS.Timeout | null>(null)

  const startStream = React.useCallback(() => {
    setIsStreaming(true)
    let index = displayedText.length >= SAMPLE_TEXT.length ? 0 : displayedText.length
    if (index === 0) setDisplayedText("")

    if (timerRef.current) clearInterval(timerRef.current)

    timerRef.current = setInterval(() => {
      index = Math.min(index + 2, SAMPLE_TEXT.length)
      setDisplayedText(SAMPLE_TEXT.slice(0, index))

      if (index >= SAMPLE_TEXT.length) {
        if (timerRef.current) clearInterval(timerRef.current)
        setIsStreaming(false)
      }
    }, speed)
  }, [displayedText.length, speed])

  const pauseStream = () => {
    if (timerRef.current) clearInterval(timerRef.current)
    setIsStreaming(false)
  }

  const resetStream = () => {
    if (timerRef.current) clearInterval(timerRef.current)
    setIsStreaming(false)
    setDisplayedText("")
  }

  React.useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

  return (
    <div className="w-full max-w-xl mx-auto space-y-4">
      <div className="rounded-xl border bg-card p-5 shadow-xs">
        <div className="flex items-center justify-between border-b pb-3 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-foreground">流式文本演示</span>
            <Badge variant={isStreaming ? "default" : "outline"} className="text-[10px]">
              {isStreaming ? "Generating (Live)" : "Idle / Completed"}
            </Badge>
          </div>
          <span className="text-xs font-mono text-muted-foreground">
            {displayedText.length} / {SAMPLE_TEXT.length} 字符
          </span>
        </div>

        <div className="min-h-28 text-sm leading-relaxed text-foreground">
          {displayedText ? (
            <AiStream isStreaming={isStreaming} featherLength={featherLength}>
              {displayedText}
            </AiStream>
          ) : (
            <span className="text-xs text-muted-foreground italic">
              点击下方「开始流式输出」按钮查看实时文本羽化与打字动效…
            </span>
          )}
        </div>
      </div>

      {/* Control bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border bg-muted/30 px-3.5 py-2.5">
        <div className="flex items-center gap-2">
          {isStreaming ? (
            <Button size="sm" variant="outline" onClick={pauseStream}>
              <PauseIcon className="size-3.5 mr-1" />
              暂停
            </Button>
          ) : (
            <Button size="sm" onClick={startStream}>
              <PlayIcon className="size-3.5 mr-1" />
              {displayedText.length >= SAMPLE_TEXT.length ? "重新播放" : "开始流式输出"}
            </Button>
          )}
          <Button size="sm" variant="ghost" onClick={resetStream} disabled={!displayedText}>
            <RotateCcwIcon className="size-3.5 mr-1" />
            重置
          </Button>
        </div>

        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <span>羽化长度:</span>
            <span className="font-mono font-medium text-foreground">{featherLength}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span>速率:</span>
            <span className="font-mono font-medium text-foreground">{speed}ms</span>
          </div>
        </div>
      </div>
    </div>
  )
}
