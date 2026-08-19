"use client"

import * as React from "react"
import { CreditCard, CheckCircle2 } from "lucide-react"

import { Button } from "@/registry/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/registry/ui/select"

export default function SelectForm() {
  const [currency, setCurrency] = React.useState("cny")
  const [billingCycle, setBillingCycle] = React.useState("annual")
  const [submitted, setSubmitted] = React.useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-md flex-col gap-4 rounded-xl border bg-card p-5 text-card-foreground shadow-xs">
      <div className="flex items-center gap-2 border-b pb-3">
        <CreditCard className="size-4 text-primary" />
        <h4 className="text-sm font-semibold">账单结算偏好配置</h4>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="currency-select" className="text-xs font-medium text-foreground">
            结算货币
          </label>
          <Select value={currency} onValueChange={setCurrency}>
            <SelectTrigger id="currency-select" className="w-full">
              <SelectValue placeholder="选择币种" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cny">CNY (人民币 ¥)</SelectItem>
              <SelectItem value="usd">USD (美元 $)</SelectItem>
              <SelectItem value="eur">EUR (欧元 €)</SelectItem>
              <SelectItem value="jpy">JPY (日元 ¥)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="cycle-select" className="text-xs font-medium text-foreground">
            计费周期
          </label>
          <Select value={billingCycle} onValueChange={setBillingCycle}>
            <SelectTrigger id="cycle-select" className="w-full">
              <SelectValue placeholder="选择计费周期" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="monthly">按月续费 (原价)</SelectItem>
              <SelectItem value="quarterly">按季结算 (95折)</SelectItem>
              <SelectItem value="annual">按年预付 (立省20%)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground">
        预计年付金额: <span className="font-semibold text-foreground">{currency.toUpperCase()} 1,920 / 年</span>（已享专属优惠）
      </div>

      <div className="flex items-center justify-between pt-1">
        {submitted ? (
          <span className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="size-3.5" />
            偏好已成功更新
          </span>
        ) : <span />}
        <Button type="submit" size="sm">
          保存结算方案
        </Button>
      </div>
    </form>
  )
}
