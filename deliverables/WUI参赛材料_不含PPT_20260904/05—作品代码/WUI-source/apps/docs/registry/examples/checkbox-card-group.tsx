"use client"

import * as React from "react"
import { Checkbox } from "@/registry/ui/checkbox"

interface Addon {
  id: string
  title: string
  price: string
  description: string
}

export default function CheckboxCardGroup() {
  const [selectedAddons, setSelectedAddons] = React.useState<string[]>(["backup"])

  const addons: Addon[] = [
    {
      id: "backup",
      title: "自动快照与异地容灾",
      price: "¥ 49/月",
      description: "每日凌晨自动备份数据库与静态资源，保留最近 30 天快照",
    },
    {
      id: "security",
      title: "企业级 WAF 高防",
      price: "¥ 129/月",
      description: "实时拦截 SQL 注入与 CC 攻击，附带专属 SSL 增强证书",
    },
    {
      id: "sla",
      title: "99.99% SLA 与专属客服",
      price: "¥ 199/月",
      description: "10 分钟内技术响应支持，支持微信 / 飞书群实时保障",
    },
  ]

  const toggleAddon = (id: string) => {
    setSelectedAddons((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  return (
    <div className="w-full max-w-lg space-y-3">
      <div className="grid gap-2.5">
        {addons.map((addon) => {
          const isSelected = selectedAddons.includes(addon.id)
          return (
            <label
              key={addon.id}
              htmlFor={`addon-${addon.id}`}
              className={`flex cursor-pointer items-start justify-between rounded-lg border p-4 transition-all ${
                isSelected
                  ? "border-primary bg-primary/5 shadow-xs"
                  : "border-border hover:border-border/80 hover:bg-muted/30"
              }`}
            >
              <div className="flex items-start gap-3">
                <Checkbox
                  id={`addon-${addon.id}`}
                  checked={isSelected}
                  onCheckedChange={() => toggleAddon(addon.id)}
                  className="mt-0.5"
                />
                <div className="grid gap-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{addon.title}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{addon.description}</p>
                </div>
              </div>
              <span className="shrink-0 text-xs font-semibold text-foreground">
                {addon.price}
              </span>
            </label>
          )
        })}
      </div>
    </div>
  )
}
