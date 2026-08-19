"use client"

import * as React from "react"
import { Check, Sparkles } from "lucide-react"

import { Button } from "@/registry/ui/button"
import { SlidingNumber } from "@/registry/ui/sliding-number"

export default function SlidingNumberPriceToggle() {
  const [isYearly, setIsYearly] = React.useState(true)

  const proPrice = isYearly ? 29 : 39
  const enterprisePrice = isYearly ? 79 : 99

  return (
    <div className="flex w-full max-w-xl flex-col items-center gap-6 rounded-xl border border-border bg-card p-6 shadow-xs">
      <div className="flex flex-col items-center gap-2">
        <h4 className="text-sm font-semibold text-foreground">按需订购计划</h4>
        <div className="flex items-center gap-2 rounded-full border border-border bg-muted/40 p-1 text-xs">
          <button
            type="button"
            onClick={() => setIsYearly(false)}
            className={`rounded-full px-3 py-1 font-medium transition-colors ${
              !isYearly
                ? "bg-background text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            按月计费
          </button>
          <button
            type="button"
            onClick={() => setIsYearly(true)}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1 font-medium transition-colors ${
              isYearly
                ? "bg-background text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            按年计费
            <span className="rounded-full bg-emerald-500/10 px-1.5 py-0.2 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
              省 25%
            </span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 w-full sm:grid-cols-2">
        {/* Pro Plan */}
        <div className="space-y-4 rounded-xl border border-border bg-background p-5">
          <div>
            <span className="text-xs font-semibold text-foreground">Pro 专业版</span>
            <p className="text-[11px] text-muted-foreground">适合独立开发者与快速增长团队</p>
          </div>

          <div className="flex items-baseline font-mono text-3xl font-bold tracking-tight text-foreground">
            <span>$</span>
            <SlidingNumber value={proPrice} />
            <span className="ml-1 text-xs font-normal text-muted-foreground">/ 月</span>
          </div>

          <ul className="space-y-1.5 text-xs text-muted-foreground">
            <li className="flex items-center gap-1.5">
              <Check className="size-3 text-primary" /> 无限并发 AI 运算
            </li>
            <li className="flex items-center gap-1.5">
              <Check className="size-3 text-primary" /> 专属优先技术支持
            </li>
          </ul>

          <Button size="sm" variant="outline" className="w-full text-xs">
            选择专业版
          </Button>
        </div>

        {/* Enterprise Plan */}
        <div className="relative space-y-4 rounded-xl border-2 border-primary bg-background p-5">
          <div className="absolute -top-2.5 right-4 flex items-center gap-1 rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold text-primary-foreground">
            <Sparkles className="size-2.5" /> 推荐
          </div>

          <div>
            <span className="text-xs font-semibold text-foreground">Enterprise 企业版</span>
            <p className="text-[11px] text-muted-foreground">全方位企业合规与专属私有化集群</p>
          </div>

          <div className="flex items-baseline font-mono text-3xl font-bold tracking-tight text-foreground">
            <span>$</span>
            <SlidingNumber value={enterprisePrice} />
            <span className="ml-1 text-xs font-normal text-muted-foreground">/ 月</span>
          </div>

          <ul className="space-y-1.5 text-xs text-muted-foreground">
            <li className="flex items-center gap-1.5">
              <Check className="size-3 text-primary" /> 99.999% SLA 保证
            </li>
            <li className="flex items-center gap-1.5">
              <Check className="size-3 text-primary" /> 专属架构师 1v1 支持
            </li>
          </ul>

          <Button size="sm" className="w-full text-xs">
            开启企业授权
          </Button>
        </div>
      </div>
    </div>
  )
}
