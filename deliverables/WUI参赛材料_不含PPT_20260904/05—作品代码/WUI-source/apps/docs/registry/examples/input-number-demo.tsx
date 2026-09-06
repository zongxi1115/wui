"use client"

import * as React from "react"
import { ShoppingCart } from "lucide-react"

import { InputNumber } from "@/registry/ui/input-number"

export default function InputNumberDemo() {
  const [quantity, setQuantity] = React.useState<number | null>(2)

  return (
    <div className="grid w-full max-w-xs gap-2">
      <label htmlFor="quantity-input" className="text-sm font-medium text-foreground flex items-center gap-1.5">
        <ShoppingCart className="size-4 text-muted-foreground" />
        <span>选购商品数量</span>
      </label>
      <InputNumber
        id="quantity-input"
        value={quantity}
        onValueChange={setQuantity}
        min={1}
        max={10}
        step={1}
      />
      <p className="text-xs text-muted-foreground">
        单次限购 1–10 件，当前选择：<span className="font-semibold text-foreground">{quantity ?? 0}</span> 件
      </p>
    </div>
  )
}
