"use client"

import * as React from "react"
import { RadioGroup, RadioGroupItem } from "@/registry/ui/radio-group"

export default function RadioGroupWithDescription() {
  return (
    <div className="w-full max-w-md rounded-lg border border-border p-4">
      <RadioGroup defaultValue="standard" className="gap-3">
        <label htmlFor="shipping-standard" className="flex cursor-pointer items-start gap-3">
          <RadioGroupItem value="standard" id="shipping-standard" className="mt-0.5" />
          <div className="grid gap-0.5">
            <span className="text-sm font-medium">标准快递（免费）</span>
            <span className="text-xs text-muted-foreground">预计 3-5 个工作日内送达，由普通陆运承运。</span>
          </div>
        </label>

        <label htmlFor="shipping-express" className="flex cursor-pointer items-start gap-3">
          <RadioGroupItem value="express" id="shipping-express" className="mt-0.5" />
          <div className="grid gap-0.5">
            <span className="text-sm font-medium">顺丰次日达（+ ¥ 18）</span>
            <span className="text-xs text-muted-foreground">今天 18:00 前下单，次日上午 12:00 前送达。</span>
          </div>
        </label>

        <label htmlFor="shipping-same-day" className="flex cursor-pointer items-start gap-3">
          <RadioGroupItem value="sameday" id="shipping-same-day" className="mt-0.5" />
          <div className="grid gap-0.5">
            <span className="text-sm font-medium">同城即时达（+ ¥ 35）</span>
            <span className="text-xs text-muted-foreground">专人专送，下单后 2 小时内极速送达上门。</span>
          </div>
        </label>
      </RadioGroup>
    </div>
  )
}
