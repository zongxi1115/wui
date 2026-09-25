"use client"

import * as React from "react"
import { RotateCcwIcon, SparklesIcon } from "lucide-react"

import { Button } from "@/registry/ui/button"
import { TextEffect } from "@/registry/ui/text-effect"

export default function TextEffectCard() {
  const [key, setKey] = React.useState(0)
  const [done, setDone] = React.useState(false)

  const replay = () => {
    setDone(false)
    setKey((k) => k + 1)
  }

  return (
    <div className="w-full max-w-md rounded-lg border bg-background">
      <div className="flex items-center justify-between border-b px-4 py-2.5">
        <span className="flex items-center gap-2 text-sm font-medium">
          <SparklesIcon className="text-muted-foreground size-4" />
          会议纪要摘要
        </span>
        <Button
          variant="ghost"
          size="icon"
          className="size-7"
          onClick={replay}
          aria-label="重新生成"
        >
          <RotateCcwIcon className="size-3.5" />
        </Button>
      </div>

      <div key={key} className="space-y-4 p-4">
        <TextEffect
          as="h4"
          per="word"
          preset="fade-in-blur"
          speedReveal={1.6}
          className="text-base font-medium"
        >
          Q4 预算评审：整体通过，营销费用下调 8%
        </TextEffect>
        <TextEffect
          per="word"
          preset="fade"
          delay={0.3}
          speedReveal={3}
          className="text-muted-foreground text-sm leading-6"
        >
          与会者一致同意保留研发投入，将线下活动预算转移至内容营销；新预算将在 10 月 8 日前同步给各部门负责人。
        </TextEffect>
        <TextEffect
          as="div"
          per="line"
          preset="slide"
          delay={1.4}
          onAnimationComplete={() => setDone(true)}
          className="gap-1.5 border-l-2 pl-3 text-sm"
        >
          {`待办：财务部更新预算模板\n待办：市场部提交内容排期\n待办：下周三复核执行情况`}
        </TextEffect>
      </div>

      <div className="text-muted-foreground flex h-10 items-center border-t px-4 text-xs">
        {done ? "由 AI 生成，请核对关键数字" : "正在整理…"}
      </div>
    </div>
  )
}
