import { CheckIcon } from "lucide-react"

import { Button } from "@/registry/ui/button"
import { ShinyButton } from "@/registry/ui/shiny-button"

const plans = [
  {
    name: "个人版",
    desc: "适合个人项目与独立创作者",
    price: "¥0",
    unit: "永久免费",
    features: ["每月 1 万次 API 调用", "社区论坛支持", "基础数据看板"],
    featured: false,
  },
  {
    name: "专业版",
    desc: "为快速成长的团队提供完整能力",
    price: "¥199",
    unit: "/ 月",
    features: ["不限量 API 调用与优先队列", "7×24 小时技术支持", "私有化网关与模型微调"],
    featured: true,
  },
]

export default function ShinyButtonPricing() {
  return (
    <div className="grid w-full max-w-2xl divide-y rounded-lg border md:grid-cols-2 md:divide-x md:divide-y-0">
      {plans.map((plan) => (
        <div key={plan.name} className="flex flex-col p-6">
          <p className="text-sm font-medium">{plan.name}</p>
          <p className="text-muted-foreground mt-1 text-xs">{plan.desc}</p>
          <p className="mt-4 flex items-baseline gap-1">
            <span className="text-3xl font-semibold tracking-tight">{plan.price}</span>
            <span className="text-muted-foreground text-xs">{plan.unit}</span>
          </p>
          <ul className="text-muted-foreground mt-5 flex-1 space-y-2 text-sm">
            {plan.features.map((feature) => (
              <li key={feature} className="flex items-center gap-2">
                <CheckIcon className="text-foreground size-3.5" />
                {feature}
              </li>
            ))}
          </ul>
          {plan.featured ? (
            <ShinyButton speed={2.5} gap={1.4} className="mt-6 w-full">
              升级到专业版
            </ShinyButton>
          ) : (
            <Button variant="outline" className="mt-6 w-full" disabled>
              当前方案
            </Button>
          )}
        </div>
      ))}
    </div>
  )
}
