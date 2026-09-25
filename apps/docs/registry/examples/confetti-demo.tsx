"use client"

import * as React from "react"
import { PartyPopperIcon } from "lucide-react"

import { Button } from "@/registry/ui/button"
import { fireConfetti } from "@/registry/ui/confetti"

function originOf(element: HTMLElement) {
  const rect = element.getBoundingClientRect()
  return {
    x: (rect.left + rect.width / 2) / window.innerWidth,
    y: (rect.top + rect.height / 2) / window.innerHeight,
  }
}

export default function ConfettiDemo() {
  const celebrate = (event: React.MouseEvent<HTMLButtonElement>) => {
    fireConfetti({
      origin: originOf(event.currentTarget),
      particleCount: 80,
      spread: 80,
      startVelocity: 32,
    })
  }

  const sideCannons = () => {
    fireConfetti({ origin: { x: 0, y: 0.7 }, angle: 60, spread: 55, particleCount: 60 })
    fireConfetti({ origin: { x: 1, y: 0.7 }, angle: 120, spread: 55, particleCount: 60 })
  }

  const ribbons = (event: React.MouseEvent<HTMLButtonElement>) => {
    fireConfetti({
      origin: originOf(event.currentTarget),
      shapes: ["strip"],
      scalar: 1.4,
      particleCount: 50,
      spread: 100,
      startVelocity: 36,
      colors: ["#2563eb", "#16a34a", "#eab308"], // wui-token-audit-allow
    })
  }

  return (
    <div className="flex w-full max-w-sm flex-col items-center gap-5 text-center">
      <span className="bg-muted flex size-11 items-center justify-center rounded-full">
        <PartyPopperIcon className="size-5" />
      </span>
      <div>
        <p className="text-base font-medium">本季度目标已全部达成</p>
        <p className="text-muted-foreground mt-1 text-sm">
          12 个关键结果完成率 100%，给团队一点庆祝吧。
        </p>
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        <Button onClick={celebrate}>从按钮处喷发</Button>
        <Button variant="outline" onClick={sideCannons}>
          两侧礼炮
        </Button>
        <Button variant="ghost" onClick={ribbons}>
          彩带
        </Button>
      </div>
    </div>
  )
}
