"use client"

import * as React from "react"
import { RotateCcwIcon } from "lucide-react"

import { Button } from "@/registry/ui/button"
import { TextEffect } from "@/registry/ui/text-effect"

export default function TextEffectDemo() {
  const [key, setKey] = React.useState(0)

  return (
    <div className="flex w-full max-w-md flex-col items-center gap-6 text-center">
      <div key={key} className="space-y-3">
        <TextEffect
          as="h3"
          per="char"
          preset="fade-in-blur"
          className="text-2xl font-semibold tracking-tight sm:text-3xl"
        >
          让每一次发布都从容不迫
        </TextEffect>
        <TextEffect
          per="word"
          preset="fade"
          delay={0.45}
          speedReveal={3}
          className="text-muted-foreground text-sm leading-6"
        >
          自动化测试、灰度发布与一键回滚，帮助团队在工作日的任何时刻安心上线。
        </TextEffect>
      </div>
      <Button variant="ghost" size="sm" onClick={() => setKey((k) => k + 1)}>
        <RotateCcwIcon />
        重播
      </Button>
    </div>
  )
}
