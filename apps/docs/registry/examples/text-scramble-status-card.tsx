"use client"

import * as React from "react"
import { RefreshCwIcon } from "lucide-react"

import { Button } from "@/registry/ui/button"
import { TextScramble } from "@/registry/ui/text-scramble"
import { cn } from "@/registry/lib/utils"

const checks = ["CHECKING_NODES", "VERIFYING_CONSENSUS", "SYNCING_REPLICAS"]

export default function TextScrambleStatusCard() {
  const [status, setStatus] = React.useState("ALL_SYSTEMS_OPERATIONAL")
  const [settled, setSettled] = React.useState(true)
  const timer = React.useRef<number | undefined>(undefined)

  React.useEffect(() => () => window.clearTimeout(timer.current), [])

  const refresh = () => {
    setSettled(false)
    setStatus(checks[Math.floor(Math.random() * checks.length)] ?? checks[0])
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(
      () => setStatus("ALL_SYSTEMS_OPERATIONAL"),
      1400
    )
  }

  return (
    <div className="w-full max-w-md rounded-lg border bg-background">
      <div className="flex items-center justify-between border-b px-4 py-2.5">
        <div>
          <p className="text-sm font-medium">集群健康检查</p>
          <p className="text-muted-foreground text-xs">华东 2 · 6 个节点</p>
        </div>
        <Button variant="outline" size="sm" onClick={refresh}>
          <RefreshCwIcon className={cn(!settled && "animate-spin")} />
          重新检查
        </Button>
      </div>
      <div className="flex items-center gap-3 px-4 py-4">
        <span
          className={cn(
            "size-2 shrink-0 rounded-full transition-colors",
            settled ? "bg-success" : "bg-warning"
          )}
        />
        <TextScramble
          as="p"
          duration={0.8}
          characterSet="01#$%&*_"
          onScrambleComplete={() =>
            setSettled(status === "ALL_SYSTEMS_OPERATIONAL")
          }
          className="text-sm font-medium"
        >
          {status}
        </TextScramble>
      </div>
    </div>
  )
}
