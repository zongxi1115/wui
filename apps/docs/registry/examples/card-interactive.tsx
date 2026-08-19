"use client"

import * as React from "react"
import { CheckCircle2Icon, CloudLightningIcon, ShieldCheckIcon } from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/registry/ui/card"

const plans = [
  {
    id: "standard",
    title: "Standard Plan",
    icon: CloudLightningIcon,
    price: "$19/mo",
    description: "Perfect for small teams and fast prototyping.",
  },
  {
    id: "enterprise",
    title: "Enterprise Shield",
    icon: ShieldCheckIcon,
    price: "$99/mo",
    description: "Dedicated cluster, SLA guarantee, and 24/7 priority support.",
  },
]

export default function CardInteractive() {
  const [selected, setSelected] = React.useState("standard")

  return (
    <div className="grid w-full max-w-xl grid-cols-1 sm:grid-cols-2 gap-4">
      {plans.map((plan) => {
        const Icon = plan.icon
        const isSelected = selected === plan.id

        return (
          <Card
            key={plan.id}
            interactive
            tabIndex={0}
            role="radio"
            aria-checked={isSelected}
            onClick={() => setSelected(plan.id)}
            onKeyDown={(e) => {
              if (e.key === " " || e.key === "Enter") {
                e.preventDefault()
                setSelected(plan.id)
              }
            }}
            className={`cursor-pointer transition-all ${
              isSelected
                ? "border-primary ring-2 ring-primary/20 bg-primary/5"
                : "hover:border-border/90"
            }`}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="size-5" />
                </div>
                {isSelected && (
                  <CheckCircle2Icon className="size-5 text-primary" />
                )}
              </div>
              <CardTitle className="mt-2">{plan.title}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <span className="text-xl font-bold tracking-tight">{plan.price}</span>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
