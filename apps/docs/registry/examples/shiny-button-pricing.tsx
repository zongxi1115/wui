"use client"

import * as React from "react"
import { CheckIcon, SparklesIcon } from "lucide-react"
import { Button } from "@/registry/ui/button"
import { ShinyButton } from "@/registry/ui/shiny-button"

export default function ShinyButtonPricing() {
  return (
    <div className="grid w-full max-w-2xl gap-6 md:grid-cols-2">
      {/* 标准方案 */}
      <div className="flex flex-col justify-between rounded-xl border bg-card p-6 shadow-xs">
        <div>
          <h4 className="text-base font-semibold">开发者方案</h4>
          <p className="mt-1 text-xs text-muted-foreground">适合个人项目与独立创作者</p>
          <div className="mt-4 flex items-baseline gap-1">
            <span className="text-3xl font-bold tracking-tight">¥0</span>
            <span className="text-xs text-muted-foreground">/ 永久免费</span>
          </div>
          <ul className="mt-6 space-y-2.5 text-xs text-muted-foreground">
            <li className="flex items-center gap-2">
              <CheckIcon className="size-4 text-foreground" />
              <span>每月 10,000 次 API 调用</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckIcon className="size-4 text-foreground" />
              <span>社区支持论坛</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckIcon className="size-4 text-foreground" />
              <span>基础数据分析看板</span>
            </li>
          </ul>
        </div>
        <Button variant="outline" className="mt-8 w-full">
          当前方案
        </Button>
      </div>

      {/* 专业方案 (Highlight with ShinyButton) */}
      <div className="relative flex flex-col justify-between rounded-xl border-2 border-primary bg-card p-6 shadow-md">
        <div className="absolute -top-3 right-4 rounded-full bg-primary px-3 py-0.5 text-[11px] font-semibold text-primary-foreground">
          最受欢迎
        </div>
        <div>
          <h4 className="text-base font-semibold">企业专业版</h4>
          <p className="mt-1 text-xs text-muted-foreground">为快速发展的团队提供全面支持</p>
          <div className="mt-4 flex items-baseline gap-1">
            <span className="text-3xl font-bold tracking-tight">¥199</span>
            <span className="text-xs text-muted-foreground">/ 月</span>
          </div>
          <ul className="mt-6 space-y-2.5 text-xs text-muted-foreground">
            <li className="flex items-center gap-2 text-foreground font-medium">
              <CheckIcon className="size-4 text-primary" />
              <span>无限次 API 调用与优先队列</span>
            </li>
            <li className="flex items-center gap-2 text-foreground font-medium">
              <CheckIcon className="size-4 text-primary" />
              <span>7×24 小时专属技术支持</span>
            </li>
            <li className="flex items-center gap-2 text-foreground font-medium">
              <CheckIcon className="size-4 text-primary" />
              <span>自定义模型微调与专属私有化网关</span>
            </li>
          </ul>
        </div>
        <ShinyButton speed={2.5} gap={1} className="mt-8 w-full">
          <SparklesIcon />
          <span>立即升级专业版</span>
        </ShinyButton>
      </div>
    </div>
  )
}
