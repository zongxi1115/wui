"use client"

import * as React from "react"
import { ArrowRightIcon, SparklesIcon } from "lucide-react"
import { Button } from "@/registry/ui/button"
import { Magnetic } from "@/registry/ui/magnetic"

export default function MagneticHeroCta() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-6 p-8">
      {/* 柔和磁吸 (Soft strength) */}
      <Magnetic strength={0.15} maxDistance={10}>
        <Button variant="outline" size="lg" className="rounded-xl px-6">
          探索组件文档
        </Button>
      </Magnetic>

      {/* 强磁吸主行动点 (Strong magnetic CTA) */}
      <Magnetic strength={0.28} maxDistance={16}>
        <Button size="lg" className="gap-2 rounded-xl px-7 shadow-md">
          <SparklesIcon className="size-4" />
          <span>即刻接入 SDK</span>
          <ArrowRightIcon className="size-4" />
        </Button>
      </Magnetic>
    </div>
  )
}
