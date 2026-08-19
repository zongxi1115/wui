"use client"

import * as React from "react"
import { Activity, CheckCircle2, RefreshCw, Server } from "lucide-react"

import { Button } from "@/registry/ui/button"
import { TextScramble } from "@/registry/ui/text-scramble"

export default function TextScrambleStatusCard() {
  const [trigger, setTrigger] = React.useState(true)
  const [status, setStatus] = React.useState("SYNCHRONIZING_CLUSTERS")
  const [isSynced, setIsSynced] = React.useState(false)

  const handleRefresh = () => {
    setIsSynced(false)
    setStatus("VERIFYING_CONSENSUS")
    setTrigger(false)
    window.setTimeout(() => {
      setStatus("ALL_SYSTEMS_OPERATIONAL")
      setTrigger(true)
    }, 100)
  }

  return (
    <div className="flex w-full max-w-lg flex-col gap-4 rounded-xl border border-border bg-card p-6 shadow-xs">
      <div className="flex items-center justify-between border-b border-border pb-3">
        <div className="flex items-center gap-2">
          <div className="flex size-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500">
            <Server className="size-4" />
          </div>
          <div>
            <h4 className="text-xs font-semibold text-foreground">集群遥测监控</h4>
            <span className="text-[10px] text-muted-foreground">Region: ap-east-1</span>
          </div>
        </div>

        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={handleRefresh}
          className="gap-1.5 text-xs"
        >
          <RefreshCw className="size-3" />
          刷新状态
        </Button>
      </div>

      <div className="flex items-center justify-between rounded-lg border border-border bg-muted/20 p-4">
        <div className="space-y-1">
          <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
            Health Check
          </span>
          <TextScramble
            as="div"
            trigger={trigger}
            duration={0.9}
            characterSet="01!#@$%&*"
            onScrambleComplete={() => setIsSynced(true)}
            className="font-mono text-sm font-semibold text-foreground"
          >
            {status}
          </TextScramble>
        </div>

        <div className="flex items-center gap-1.5 text-xs">
          {isSynced ? (
            <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
              <CheckCircle2 className="size-3.5" />
              100% Validated
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-amber-500 font-medium animate-pulse">
              <Activity className="size-3.5" />
              Decoding...
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
