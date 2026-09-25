"use client"

import * as React from "react"
import { CheckIcon } from "lucide-react"

import { StickyStack, StickyStackItem } from "@/registry/ui/sticky-stack"

const plans = [
  {
    name: "个人版",
    price: "免费",
    note: "适合独立创作者",
    perks: ["3 个项目", "基础模板", "7 天版本历史"],
  },
  {
    name: "团队版",
    price: "¥48",
    note: "每位成员 / 月",
    perks: ["无限项目", "权限与审批流", "90 天版本历史", "优先支持"],
  },
  {
    name: "企业版",
    price: "联系我们",
    note: "按组织规模定制",
    perks: ["单点登录与审计日志", "私有化部署", "专属客户成功经理"],
  },
]

export default function StickyStackFeatures() {
  const container = React.useRef<HTMLDivElement>(null)

  return (
    <div
      ref={container}
      className="h-[26rem] w-full overflow-y-auto rounded-b-lg"
    >
      <div className="mx-auto max-w-md px-6 pt-8 pb-4">
        <h3 className="font-semibold">选择适合你的方案</h3>
        <p className="text-muted-foreground mt-1 text-sm">
          所有方案均可随时升级或降级。
        </p>
      </div>

      <StickyStack
        container={container}
        top={12}
        gap={8}
        scaleStep={0.04}
        dim={0.35}
        className="mx-auto max-w-md px-6 pb-20"
      >
        {plans.map((plan) => (
          <StickyStackItem
            key={plan.name}
            className="bg-background mb-24 rounded-lg border p-5"
          >
            <div className="flex items-baseline justify-between gap-4">
              <h4 className="font-medium">{plan.name}</h4>
              <p>
                <span className="text-xl font-semibold tracking-tight">
                  {plan.price}
                </span>
              </p>
            </div>
            <p className="text-muted-foreground text-right text-xs">
              {plan.note}
            </p>
            <ul className="mt-4 space-y-2 border-t pt-4">
              {plan.perks.map((perk) => (
                <li key={perk} className="flex items-center gap-2 text-sm">
                  <CheckIcon className="text-muted-foreground size-3.5" />
                  {perk}
                </li>
              ))}
            </ul>
          </StickyStackItem>
        ))}
      </StickyStack>
    </div>
  )
}
