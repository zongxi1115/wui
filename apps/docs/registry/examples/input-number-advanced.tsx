"use client"

import * as React from "react"

import { InputNumber } from "@/registry/ui/input-number"

export default function InputNumberAdvanced() {
  const [price, setPrice] = React.useState<number | null>(19.9)

  return (
    <div className="grid w-full max-w-sm gap-5 sm:grid-cols-2">
      <div className="grid gap-2">
        <label htmlFor="price" className="text-sm font-medium">
          单价
        </label>
        <InputNumber
          id="price"
          value={price}
          onValueChange={setPrice}
          min={0}
          max={99.9}
          step={0.1}
          aria-describedby="price-help"
        />
        <p id="price-help" className="text-muted-foreground text-xs">
          每次调整 0.1，范围 0–99.9
        </p>
      </div>
      <div className="grid content-start gap-2">
        <label htmlFor="stock" className="text-sm font-medium">
          库存上限
        </label>
        <InputNumber id="stock" defaultValue={100} min={0} step={10} />
        <p className="text-muted-foreground text-xs">可用 ↑ / ↓ 快速调整</p>
      </div>
    </div>
  )
}
