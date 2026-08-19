"use client"

import * as React from "react"
import { ArrowUpRight } from "lucide-react"

import { Button } from "@/registry/ui/button"
import { TextRoll } from "@/registry/ui/text-roll"

export default function TextRollButton() {
  return (
    <div className="flex w-full max-w-md flex-col items-center justify-center gap-6 rounded-xl border border-border bg-card p-8 text-center shadow-xs">
      <div className="space-y-1">
        <h4 className="text-sm font-semibold text-foreground">按钮翻转动效</h4>
        <p className="text-xs text-muted-foreground">
          将 TextRoll 置于按钮内部，悬停时文字与图标联动响应。
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button size="default" className="group rounded-full px-5">
          <TextRoll duration={0.35} className="font-semibold">
            Start Free Trial
          </TextRoll>
          <ArrowUpRight className="size-4 ml-1.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Button>

        <Button variant="outline" size="default" className="group rounded-full px-5">
          <TextRoll duration={0.35} className="font-semibold text-foreground">
            Schedule a Demo
          </TextRoll>
        </Button>
      </div>
    </div>
  )
}
