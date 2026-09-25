"use client"

import * as React from "react"
import { motion, useReducedMotion } from "motion/react"

import { RadioGroup, RadioGroupItem } from "@/registry/ui/radio-group"

const plans = [
  {
    id: "starter",
    name: "个人版",
    price: "免费",
    description: "3 个项目、基础 API 调用，适合独立开发者",
  },
  {
    id: "pro",
    name: "团队版",
    price: "¥99/月",
    description: "不限项目、高级分析与团队协作，优先工单支持",
    badge: "推荐",
  },
  {
    id: "enterprise",
    name: "企业版",
    price: "¥399/月",
    description: "私有化部署、SSO 单点登录与 99.99% SLA 保障",
  },
]

export default function RadioGroupCards() {
  const reduceMotion = useReducedMotion()
  const layoutId = React.useId()
  const [selectedPlan, setSelectedPlan] = React.useState("pro")

  return (
    <RadioGroup
      value={selectedPlan}
      onValueChange={setSelectedPlan}
      aria-label="订阅方案"
      className="w-full max-w-md gap-2"
    >
      {plans.map((plan) => {
        const checked = selectedPlan === plan.id
        return (
          <label
            key={plan.id}
            htmlFor={`plan-${plan.id}`}
            className="hover:bg-muted/40 relative flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition-colors"
          >
            {checked ? (
              <motion.span
                aria-hidden="true"
                layoutId={layoutId}
                className="border-primary pointer-events-none absolute -inset-px rounded-lg border-2"
                transition={
                  reduceMotion
                    ? { duration: 0 }
                    : { type: "spring", stiffness: 520, damping: 38, mass: 0.7 }
                }
              />
            ) : null}
            <RadioGroupItem value={plan.id} id={`plan-${plan.id}`} className="mt-px" />
            <span className="grid flex-1 gap-1">
              <span className="flex items-center gap-2">
                <span className="text-sm font-medium leading-none">{plan.name}</span>
                {plan.badge ? (
                  <span className="bg-primary/10 text-primary rounded px-1.5 py-0.5 text-[10px] font-medium leading-none">
                    {plan.badge}
                  </span>
                ) : null}
              </span>
              <span className="text-muted-foreground text-xs">{plan.description}</span>
            </span>
            <span className="text-sm font-semibold tabular-nums">{plan.price}</span>
          </label>
        )
      })}
    </RadioGroup>
  )
}
