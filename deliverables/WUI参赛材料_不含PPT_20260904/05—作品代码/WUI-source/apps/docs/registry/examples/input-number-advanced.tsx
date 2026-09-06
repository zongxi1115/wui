"use client"

import * as React from "react"

import { InputNumber } from "@/registry/ui/input-number"

export default function InputNumberAdvanced() {
  const [discountRate, setDiscountRate] = React.useState<number | null>(0.85)
  const [maxLatency, setMaxLatency] = React.useState<number | null>(250)

  return (
    <div className="grid w-full max-w-sm gap-5 sm:grid-cols-2">
      <div className="grid gap-2">
        <label htmlFor="discount-input" className="text-sm font-medium text-foreground">
          折扣系数 (浮点精度)
        </label>
        <InputNumber
          id="discount-input"
          value={discountRate}
          onValueChange={setDiscountRate}
          min={0.01}
          max={1.0}
          step={0.05}
        />
        <p className="text-xs text-muted-foreground">
          步长 0.05，范围 0.01–1.00
        </p>
      </div>

      <div className="grid gap-2">
        <label htmlFor="latency-input" className="text-sm font-medium text-foreground">
          超时阈值 (大步长)
        </label>
        <InputNumber
          id="latency-input"
          value={maxLatency}
          onValueChange={setMaxLatency}
          min={50}
          max={5000}
          step={50}
          suffix="ms"
        />
        <p className="text-xs text-muted-foreground">
          按 Shift + ↑/↓ 步进 500ms
        </p>
      </div>
    </div>
  )
}
