"use client"

import * as React from "react"
import { CpuIcon, QrCodeIcon, SparklesIcon } from "lucide-react"
import { TiltCard } from "@/registry/ui/tilt-card"

export default function TiltCardMemberPass() {
  return (
    <div className="flex justify-center p-4">
      <TiltCard
        maxTilt={12}
        hoverScale={1.04}
        glare
        perspective={1000}
        className="relative h-60 w-full max-w-sm overflow-hidden rounded-2xl border border-zinc-700/60 bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-950 p-6 text-white shadow-2xl"
        glareClassName="opacity-30 mix-blend-color-dodge"
      >
        {/* Decorative background grid */}
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff15_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]" />

        {/* 3D Depth Layer */}
        <div className="relative flex h-full flex-col justify-between [transform:translateZ(28px)]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex size-7 items-center justify-center rounded-lg bg-white/10 backdrop-blur-md">
                <CpuIcon className="size-4 text-emerald-400" />
              </div>
              <span className="font-mono text-xs font-semibold tracking-wider uppercase text-zinc-300">
                WUI DEV PASS
              </span>
            </div>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-300">
              <SparklesIcon className="size-3" />
              VIP ALL ACCESS
            </span>
          </div>

          <div className="space-y-1">
            <p className="font-mono text-[10px] tracking-widest text-zinc-400 uppercase">
              Member ID
            </p>
            <p className="font-mono text-lg font-bold tracking-wider text-zinc-100">
              8848 · 2048 · 9921
            </p>
          </div>

          <div className="flex items-end justify-between border-t border-white/10 pt-3 text-xs">
            <div>
              <p className="text-[10px] text-zinc-400">Cardholder</p>
              <p className="font-semibold text-zinc-200">ALEX CHEN</p>
            </div>
            <div className="flex items-center gap-1.5 text-zinc-300">
              <QrCodeIcon className="size-5" />
              <span className="font-mono text-[11px]">VALID 2026</span>
            </div>
          </div>
        </div>
      </TiltCard>
    </div>
  )
}
