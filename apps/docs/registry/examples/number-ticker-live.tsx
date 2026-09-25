"use client"

import * as React from "react"
import { RefreshCwIcon } from "lucide-react"

import { Button } from "@/registry/ui/button"
import { NumberTicker } from "@/registry/ui/number-ticker"

const snapshots = [
  { balance: 48210.36, usage: 62.4 },
  { balance: 45977.12, usage: 71.8 },
  { balance: 52030.5, usage: 54.2 },
  { balance: 49315.08, usage: 66.9 },
]

export default function NumberTickerLive() {
  const [index, setIndex] = React.useState(0)
  const snapshot = snapshots[index]

  return (
    <div className="flex w-full max-w-sm flex-col gap-5 rounded-lg border p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <span className="text-xs text-muted-foreground">云资源账户余额</span>
          <NumberTicker
            value={snapshot.balance}
            from={0}
            decimalPlaces={2}
            formatOptions={{ style: "currency", currency: "CNY" }}
            className="text-3xl font-semibold tracking-tight"
          />
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIndex((current) => (current + 1) % snapshots.length)}
        >
          <RefreshCwIcon />
          刷新
        </Button>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">本月配额使用</span>
          <NumberTicker
            value={snapshot.usage}
            decimalPlaces={1}
            suffix="%"
            className="font-medium"
          />
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-[width] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{ width: `${snapshot.usage}%` }}
          />
        </div>
      </div>
    </div>
  )
}
