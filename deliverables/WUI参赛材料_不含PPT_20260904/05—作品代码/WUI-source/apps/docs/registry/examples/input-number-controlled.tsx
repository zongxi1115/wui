"use client"

import * as React from "react"
import { RotateCcw } from "lucide-react"

import { Button } from "@/registry/ui/button"
import { InputNumber } from "@/registry/ui/input-number"

export default function InputNumberControlled() {
  const unitPrice = 299
  const [count, setCount] = React.useState<number | null>(3)

  const total = (count ?? 0) * unitPrice

  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      <div className="flex flex-col gap-2">
        <label htmlFor="instances-count" className="text-sm font-medium text-foreground">
          订阅计算节点数 (受控模式)
        </label>
        <InputNumber
          id="instances-count"
          value={count}
          onValueChange={setCount}
          min={1}
          max={50}
          step={1}
          suffix="台"
        />
      </div>

      <div className="flex items-center justify-between rounded-lg border bg-muted/40 p-3 text-xs">
        <div className="flex flex-col">
          <span className="text-muted-foreground">单价: ¥{unitPrice}/月</span>
          <span className="text-foreground font-medium">总计: ¥{total.toLocaleString()} / 月</span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-7 text-xs"
            onClick={() => setCount(10)}
          >
            设为10台
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-7 text-xs"
            onClick={() => setCount(1)}
          >
            <RotateCcw className="mr-1 size-3" />
            重置
          </Button>
        </div>
      </div>
    </div>
  )
}
