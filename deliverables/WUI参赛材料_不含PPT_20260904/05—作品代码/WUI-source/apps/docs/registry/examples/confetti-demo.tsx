"use client"

import * as React from "react"
import { PartyPopperIcon, SparklesIcon } from "lucide-react"
import { Button } from "@/registry/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/registry/ui/card"
import { Confetti, fireConfetti } from "@/registry/ui/confetti"

export default function ConfettiDemo() {
  const handleCannon = () => {
    fireConfetti({
      particleCount: 80,
      spread: 80,
      origin: { x: 0.5, y: 0.6 },
    })
  }

  const handleSides = () => {
    fireConfetti({
      particleCount: 50,
      spread: 60,
      origin: { x: 0.1, y: 0.5 },
    })
    setTimeout(() => {
      fireConfetti({
        particleCount: 50,
        spread: 60,
        origin: { x: 0.9, y: 0.5 },
      })
    }, 200)
  }

  return (
    <div className="w-full max-w-md">
      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <PartyPopperIcon className="size-6" />
          </div>
          <CardTitle>任务达成与成就解锁</CardTitle>
          <CardDescription>
            点击下方按钮触发平滑高性能的 Canvas 粒子庆祝动效。
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap items-center justify-center gap-3">
          <Button onClick={handleCannon} className="gap-2">
            <SparklesIcon className="size-4" />
            <span>中心礼花炮</span>
          </Button>
          <Button variant="outline" onClick={handleSides}>
            两侧对射
          </Button>
        </CardContent>
      </Card>
      <Confetti />
    </div>
  )
}
