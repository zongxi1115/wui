"use client"

import * as React from "react"
import { ArrowUpIcon, SquareIcon } from "lucide-react"

import { BorderBeam } from "@/registry/ui/border-beam"
import { Button } from "@/registry/ui/button"

export default function BorderBeamDemo() {
  const [generating, setGenerating] = React.useState(false)

  React.useEffect(() => {
    if (!generating) return
    const timer = window.setTimeout(() => setGenerating(false), 5000)
    return () => window.clearTimeout(timer)
  }, [generating])

  return (
    <div className="flex w-full max-w-lg flex-col gap-2">
      <div className="relative rounded-lg border bg-background">
        <textarea
          rows={3}
          aria-label="描述你想生成的内容"
          defaultValue="根据本周的用户访谈记录，整理出三个最高频的痛点，并给出优先级建议。"
          className="block w-full resize-none bg-transparent px-4 pt-3 text-sm outline-none placeholder:text-muted-foreground"
        />
        <div className="flex items-center justify-between px-3 pb-3">
          <span className="text-xs text-muted-foreground">
            {generating ? "正在分析 12 份访谈记录…" : "Enter 发送，Shift + Enter 换行"}
          </span>
          <Button
            size="icon"
            className="size-8"
            aria-label={generating ? "停止生成" : "发送"}
            onClick={() => setGenerating((current) => !current)}
          >
            {generating ? <SquareIcon className="size-3 fill-current" /> : <ArrowUpIcon />}
          </Button>
        </div>
        {generating ? <BorderBeam size={120} duration={4} /> : null}
      </div>
      <p className="text-xs text-muted-foreground">
        点击发送后，光束沿输入框边框流动，提示内容正在生成。
      </p>
    </div>
  )
}
