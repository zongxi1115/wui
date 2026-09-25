"use client"

import * as React from "react"
import { GiftIcon } from "lucide-react"

import { Button } from "@/registry/ui/button"
import { TextScramble } from "@/registry/ui/text-scramble"

export default function TextScrambleDemo() {
  const [revealed, setRevealed] = React.useState(false)
  const [round, setRound] = React.useState(0)

  return (
    <div className="flex w-full max-w-xs flex-col items-center gap-4 text-center">
      <GiftIcon className="text-muted-foreground size-6" />
      <div>
        <p className="text-muted-foreground text-xs">会员兑换码</p>
        <TextScramble
          key={round}
          as="p"
          trigger={revealed}
          duration={1.1}
          characterSet="ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
          className="mt-2 text-2xl font-semibold tracking-widest"
        >
          {revealed ? "WUI8-F3KQ-7ZPM" : "••••-••••-••••"}
        </TextScramble>
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={() => {
          setRevealed(true)
          setRound((value) => value + 1)
        }}
      >
        {revealed ? "再解码一次" : "刮开兑换码"}
      </Button>
    </div>
  )
}
