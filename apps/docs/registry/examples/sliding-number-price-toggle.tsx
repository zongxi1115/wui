"use client"

import * as React from "react"
import { CheckIcon } from "lucide-react"

import { Button } from "@/registry/ui/button"
import { SlidingNumber } from "@/registry/ui/sliding-number"
import { ToggleGroup, ToggleGroupItem } from "@/registry/ui/toggle-group"

const plans = [
  {
    name: "团队版",
    desc: "适合 50 人以内的成长型团队",
    monthly: 49,
    yearly: 39,
    features: ["无限项目与成员", "审批流与表单", "90 天操作日志"],
  },
  {
    name: "企业版",
    desc: "面向有合规要求的组织",
    monthly: 129,
    yearly: 99,
    features: ["单点登录（SSO）", "细粒度权限与审计", "专属客户成功经理"],
  },
]

export default function SlidingNumberPriceToggle() {
  const [cycle, setCycle] = React.useState("yearly")
  const yearly = cycle === "yearly"

  return (
    <div className="flex w-full max-w-xl flex-col items-center gap-6">
      <ToggleGroup
        type="single"
        value={cycle}
        onValueChange={(value) => value && setCycle(value)}
        aria-label="计费周期"
      >
        <ToggleGroupItem value="monthly">按月付</ToggleGroupItem>
        <ToggleGroupItem value="yearly">按年付 · 省 20%</ToggleGroupItem>
      </ToggleGroup>

      <div className="grid w-full divide-y rounded-lg border sm:grid-cols-2 sm:divide-x sm:divide-y-0">
        {plans.map((plan) => (
          <div key={plan.name} className="flex flex-col gap-4 p-5">
            <div>
              <p className="text-sm font-medium">{plan.name}</p>
              <p className="text-muted-foreground mt-0.5 text-xs">{plan.desc}</p>
            </div>
            <p className="flex items-baseline gap-1">
              <span className="text-muted-foreground text-sm">¥</span>
              <span className="text-3xl font-semibold tracking-tight">
                <SlidingNumber value={yearly ? plan.yearly : plan.monthly} />
              </span>
              <span className="text-muted-foreground text-xs">/ 人 / 月</span>
            </p>
            <ul className="text-muted-foreground space-y-1.5 text-sm">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-center gap-2">
                  <CheckIcon className="text-foreground size-3.5" />
                  {feature}
                </li>
              ))}
            </ul>
            <Button
              variant={plan.name === "企业版" ? "default" : "outline"}
              size="sm"
              className="mt-auto"
            >
              选择{plan.name}
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}
