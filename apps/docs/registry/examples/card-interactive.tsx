"use client"

import * as React from "react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import { CheckIcon } from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/registry/ui/card"

const plans = [
  {
    id: "team",
    title: "团队版",
    price: "¥39",
    description: "20 人以内的产品团队，含 100 GB 空间与基础权限管理。",
    features: ["无限项目", "审批流 5 条"],
  },
  {
    id: "business",
    title: "企业版",
    price: "¥89",
    description: "独立部署集群、SSO 单点登录与 99.9% 可用性承诺。",
    features: ["审计日志", "专属客户成功"],
  },
  {
    id: "flagship",
    title: "旗舰版",
    price: "¥159",
    description: "私有化交付、专属运维与跨地域容灾备份。",
    features: ["私有化部署", "7×24 支持"],
  },
]

const spring = { type: "spring", stiffness: 520, damping: 38, mass: 0.7 } as const

export default function CardInteractive() {
  const [selected, setSelected] = React.useState("business")
  const layoutId = React.useId()
  const reduceMotion = useReducedMotion()
  const refs = React.useRef<Array<HTMLDivElement | null>>([])

  function select(index: number) {
    const next = (index + plans.length) % plans.length
    setSelected(plans[next].id)
    refs.current[next]?.focus()
  }

  return (
    <div
      role="radiogroup"
      aria-label="选择订阅方案"
      className="grid w-full max-w-2xl grid-cols-1 gap-3 sm:grid-cols-3"
    >
      {plans.map((plan, index) => {
        const isSelected = selected === plan.id
        return (
          <Card
            key={plan.id}
            ref={(node) => {
              refs.current[index] = node
            }}
            variant="outline"
            interactive
            role="radio"
            aria-checked={isSelected}
            tabIndex={isSelected ? 0 : -1}
            onClick={() => setSelected(plan.id)}
            onKeyDown={(event) => {
              if (event.key === " " || event.key === "Enter") {
                event.preventDefault()
                setSelected(plan.id)
              }
              if (event.key === "ArrowRight" || event.key === "ArrowDown") {
                event.preventDefault()
                select(index + 1)
              }
              if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
                event.preventDefault()
                select(index - 1)
              }
            }}
            className="gap-4"
          >
            {isSelected ? (
              <motion.span
                aria-hidden
                layoutId={layoutId}
                transition={reduceMotion ? { duration: 0 } : spring}
                className="border-primary pointer-events-none absolute -inset-px rounded-[inherit] border-2"
              />
            ) : null}
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-sm">
                {plan.title}
                <span className="border-border relative size-4 rounded-full border">
                  <AnimatePresence initial={false}>
                    {isSelected ? (
                      <motion.span
                        className="bg-primary text-primary-foreground absolute -inset-px flex items-center justify-center rounded-full"
                        initial={{ scale: 0.4, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.4, opacity: 0 }}
                        transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                      >
                        <CheckIcon className="size-3" strokeWidth={3} />
                      </motion.span>
                    ) : null}
                  </AnimatePresence>
                </span>
              </CardTitle>
              <CardDescription className="text-xs leading-5">
                {plan.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-2xl font-semibold tracking-tight">
                {plan.price}
                <span className="text-muted-foreground ml-1 text-xs font-normal">
                  / 人 / 月
                </span>
              </p>
              <ul className="text-muted-foreground space-y-1 text-xs">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-1.5">
                    <CheckIcon className="text-foreground size-3" />
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
