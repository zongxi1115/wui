import { CheckIcon } from "lucide-react"

import { Button } from "@/registry/ui/button"
import { Glow } from "@/registry/ui/glow"
import { cn } from "@/registry/lib/utils"

const plans = [
  {
    name: "团队版",
    price: "39",
    features: ["无限项目与成员", "审批流与表单", "90 天操作日志"],
    featured: false,
  },
  {
    name: "企业版",
    price: "99",
    features: ["单点登录（SSO）", "细粒度权限与审计", "专属客户成功经理", "99.95% 可用性承诺"],
    featured: true,
  },
]

function PlanBody({ plan }: { plan: (typeof plans)[number] }) {
  return (
    <div
      className={cn(
        "bg-background flex h-full flex-col rounded-lg p-5",
        !plan.featured && "border"
      )}
    >
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">{plan.name}</p>
        {plan.featured ? (
          <span className="text-muted-foreground text-xs">最多团队选择</span>
        ) : null}
      </div>
      <p className="mt-3 flex items-baseline gap-1">
        <span className="text-muted-foreground text-sm">¥</span>
        <span className="text-3xl font-semibold tracking-tight">{plan.price}</span>
        <span className="text-muted-foreground text-xs">/ 人 / 月</span>
      </p>
      <ul className="text-muted-foreground mt-4 flex-1 space-y-2 text-sm">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-center gap-2">
            <CheckIcon className="text-foreground size-3.5" />
            {feature}
          </li>
        ))}
      </ul>
      <Button
        variant={plan.featured ? "default" : "outline"}
        size="sm"
        className="mt-5"
      >
        选择{plan.name}
      </Button>
    </div>
  )
}

export default function GlowCardDemo() {
  return (
    <div className="grid w-full max-w-xl gap-6 sm:grid-cols-2">
      {plans.map((plan) =>
        plan.featured ? (
          <Glow key={plan.name} spread={24} glowOpacity={0.5} duration={6} className="rounded-lg [&>[data-slot=glow-content]]:h-full">
            <PlanBody plan={plan} />
          </Glow>
        ) : (
          <PlanBody key={plan.name} plan={plan} />
        )
      )}
    </div>
  )
}
