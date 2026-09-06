"use client"

import * as React from "react"
import { ArrowRight, CheckCircle2, RefreshCw, Zap } from "lucide-react"

import { Button } from "@/registry/ui/button"
import { TextEffect } from "@/registry/ui/text-effect"

export default function TextEffectCard() {
  const [trigger, setTrigger] = React.useState(true)
  const [isCompleted, setIsCompleted] = React.useState(false)

  const handleReplay = () => {
    setIsCompleted(false)
    setTrigger(false)
    window.setTimeout(() => setTrigger(true), 100)
  }

  return (
    <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-sm">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Zap className="size-4" />
          </div>
          <div>
            <span className="text-xs font-semibold text-foreground">WUI Cloud AI 4.0</span>
            <span className="block text-[10px] text-muted-foreground">Release Highlights</span>
          </div>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-7"
          onClick={handleReplay}
          title="重新播放入场动画"
        >
          <RefreshCw className="size-3.5" />
        </Button>
      </div>

      <div className="space-y-4 py-5">
        <TextEffect
          as="h4"
          per="word"
          preset="fade-in-blur"
          trigger={trigger}
          className="text-lg font-semibold tracking-tight text-foreground"
        >
          Hyper-optimized AI Edge Inference Engine
        </TextEffect>

        <TextEffect
          as="p"
          per="word"
          preset="fade"
          delay={0.25}
          trigger={trigger}
          className="text-xs leading-relaxed text-muted-foreground"
        >
          Experience 10x faster response latencies with our globally distributed
          neural execution nodes. Zero cold-start latency guaranteed.
        </TextEffect>

        <TextEffect
          as="div"
          per="line"
          preset="slide"
          delay={0.5}
          trigger={trigger}
          onAnimationComplete={() => setIsCompleted(true)}
          className="space-y-1.5 rounded-lg bg-muted/40 p-3 text-xs text-foreground"
        >
          {`⚡ 全球 320+ 边缘节点就近调度\n🔒 硬件级端到端 Enclave 加密隔离\n📈 自动负载均衡与毫秒级容灾切换`}
        </TextEffect>
      </div>

      <div className="flex items-center justify-between border-t border-border pt-4">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          {isCompleted && (
            <>
              <CheckCircle2 className="size-3.5 text-success" />
              <span className="text-[11px] text-foreground">Ready to deploy</span>
            </>
          )}
        </div>
        <Button size="sm" className="gap-1.5 text-xs">
          立即开通
          <ArrowRight className="size-3.5" />
        </Button>
      </div>
    </div>
  )
}
