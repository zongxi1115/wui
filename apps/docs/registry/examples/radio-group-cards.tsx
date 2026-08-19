"use client"

import * as React from "react"
import { RadioGroup, RadioGroupItem } from "@/registry/ui/radio-group"

interface Plan {
  id: string
  name: string
  price: string
  description: string
  badge?: string
}

export default function RadioGroupCards() {
  const [selectedPlan, setSelectedPlan] = React.useState("pro")

  const plans: Plan[] = [
    {
      id: "starter",
      name: "个人版 Starter",
      price: "¥ 0 / 永久免费",
      description: "适合独立开发者与个人项目，支持 3 个项目与基础 API 访问。",
    },
    {
      id: "pro",
      name: "专业版 Pro",
      price: "¥ 99 / 每月",
      description: "面向成长型团队，无限项目、高级分析、团队协作与优先客服支持。",
      badge: "最受欢迎",
    },
    {
      id: "enterprise",
      name: "企业版 Enterprise",
      price: "¥ 399 / 每月",
      description: "专为大规模业务设计，独立私有化部署、SSO 登录及 99.99% SLA 保障。",
    },
  ]

  return (
    <div className="w-full max-w-lg">
      <RadioGroup
        value={selectedPlan}
        onValueChange={setSelectedPlan}
        className="gap-3"
      >
        {plans.map((plan) => {
          const isChecked = selectedPlan === plan.id
          return (
            <label
              key={plan.id}
              htmlFor={`plan-${plan.id}`}
              className={`relative flex cursor-pointer items-start justify-between rounded-xl border p-4 transition-all ${
                isChecked
                  ? "border-primary bg-primary/5 shadow-xs"
                  : "border-border hover:border-border/80 hover:bg-muted/30"
              }`}
            >
              <div className="flex items-start gap-3.5">
                <RadioGroupItem value={plan.id} id={`plan-${plan.id}`} className="mt-0.5" />
                <div className="grid gap-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-foreground">{plan.name}</span>
                    {plan.badge ? (
                      <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                        {plan.badge}
                      </span>
                    ) : null}
                  </div>
                  <p className="text-xs text-muted-foreground">{plan.description}</p>
                </div>
              </div>
              <span className="shrink-0 text-xs font-semibold tabular-nums text-foreground">
                {plan.price}
              </span>
            </label>
          )
        })}
      </RadioGroup>
    </div>
  )
}
