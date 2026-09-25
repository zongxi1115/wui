import { CheckIcon } from "lucide-react"

import { BorderBeam } from "@/registry/ui/border-beam"
import { Button } from "@/registry/ui/button"
import { cn } from "@/registry/lib/utils"

const plans = [
  {
    name: "团队版",
    price: "49",
    description: "适合 10 人以内的小团队",
    features: ["无限项目与文档", "基础自动化 1,000 次/月", "30 天历史版本"],
    recommended: false,
  },
  {
    name: "专业版",
    price: "99",
    description: "适合多团队协作与审批流程",
    features: ["高级权限与审计日志", "自动化 20,000 次/月", "无限历史版本", "SSO 单点登录"],
    recommended: true,
  },
]

export default function BorderBeamPricing() {
  return (
    <div className="grid w-full max-w-xl gap-4 sm:grid-cols-2">
      {plans.map((plan) => (
        <div
          key={plan.name}
          className={cn(
            "relative flex flex-col gap-4 rounded-lg border p-5",
            plan.recommended && "border-primary/30"
          )}
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">{plan.name}</span>
            {plan.recommended ? (
              <span className="text-xs text-muted-foreground">推荐</span>
            ) : null}
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-semibold tracking-tight">¥{plan.price}</span>
            <span className="text-xs text-muted-foreground">/ 人 / 月</span>
          </div>
          <p className="text-xs text-muted-foreground">{plan.description}</p>
          <ul className="flex flex-1 flex-col gap-2 text-sm">
            {plan.features.map((feature) => (
              <li key={feature} className="flex items-center gap-2">
                <CheckIcon className="size-3.5 text-muted-foreground" />
                {feature}
              </li>
            ))}
          </ul>
          <Button variant={plan.recommended ? "default" : "outline"} size="sm">
            {plan.recommended ? "升级到专业版" : "选择团队版"}
          </Button>
          {plan.recommended ? (
            <>
              <BorderBeam size={100} duration={8} />
              <BorderBeam size={100} duration={8} delay={4} />
            </>
          ) : null}
        </div>
      ))}
    </div>
  )
}
