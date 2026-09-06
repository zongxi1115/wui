"use client"

import * as React from "react"
import { RefreshCw, Terminal } from "lucide-react"

import { Button } from "@/registry/ui/button"
import { TextScramble } from "@/registry/ui/text-scramble"

export default function TextScrambleDemo() {
  const [trigger, setTrigger] = React.useState(true)

  const replay = () => {
    setTrigger(false)
    window.setTimeout(() => setTrigger(true), 50)
  }

  return (
    <div className="flex w-full max-w-md flex-col items-center justify-center gap-5 rounded-xl border border-border bg-card p-8 text-center shadow-xs">
      <div className="flex size-9 items-center justify-center rounded-lg bg-muted text-foreground">
        <Terminal className="size-4" />
      </div>

      <div className="space-y-2">
        <TextScramble
          as="h3"
          trigger={trigger}
          duration={1.2}
          characterSet="ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*"
          className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl"
        >
          Decentralized Protocols
        </TextScramble>
        <p className="text-xs text-muted-foreground">
          随机字符快速跳变并按时序平滑收敛至目标文案。
        </p>
      </div>

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={replay}
        className="gap-1.5 text-xs font-medium"
      >
        <RefreshCw className="size-3" />
        重新解码 Re-decode
      </Button>
    </div>
  )
}
