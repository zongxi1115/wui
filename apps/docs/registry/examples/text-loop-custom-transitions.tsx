"use client"

import * as React from "react"
import type { Variants } from "motion/react"

import { TextLoop } from "@/registry/ui/text-loop"

const horizontalSlideVariants: Variants = {
  initial: { x: 24, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: -24, opacity: 0 },
}

const flip3DVariants: Variants = {
  initial: { rotateX: 90, opacity: 0 },
  animate: { rotateX: 0, opacity: 1 },
  exit: { rotateX: -90, opacity: 0 },
}

const scaleFadeVariants: Variants = {
  initial: { scale: 0.8, opacity: 0, filter: "blur(4px)" },
  animate: { scale: 1, opacity: 1, filter: "blur(0px)" },
  exit: { scale: 1.15, opacity: 0, filter: "blur(4px)" },
}

export default function TextLoopCustomTransitions() {
  return (
    <div className="flex w-full max-w-xl flex-col gap-6 rounded-xl border border-border bg-card p-6 shadow-xs">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {/* Horizontal Slide */}
        <div className="flex flex-col items-center justify-center rounded-lg border border-border bg-muted/20 p-4 text-center">
          <span className="text-[11px] font-semibold text-muted-foreground uppercase">
            横向推入 (Horizontal Slide)
          </span>
          <div className="mt-3 text-base font-semibold text-foreground">
            Save{" "}
            <TextLoop
              interval={2}
              variants={horizontalSlideVariants}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="text-primary font-bold"
            >
              {[
                <span key="time">Time</span>,
                <span key="money">Cost</span>,
                <span key="effort">Effort</span>,
              ]}
            </TextLoop>
          </div>
        </div>

        {/* 3D Flip */}
        <div className="flex flex-col items-center justify-center rounded-lg border border-border bg-muted/20 p-4 text-center [perspective:600px]">
          <span className="text-[11px] font-semibold text-muted-foreground uppercase">
            3D 翻转 (3D Flip)
          </span>
          <div className="mt-3 text-base font-semibold text-foreground">
            Deploy to{" "}
            <TextLoop
              interval={2.2}
              variants={flip3DVariants}
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
              className="text-emerald-500 font-bold"
            >
              {[
                <span key="aws">AWS</span>,
                <span key="vercel">Vercel</span>,
                <span key="cloudflare">Cloudflare</span>,
              ]}
            </TextLoop>
          </div>
        </div>

        {/* Scale Fade */}
        <div className="flex flex-col items-center justify-center rounded-lg border border-border bg-muted/20 p-4 text-center">
          <span className="text-[11px] font-semibold text-muted-foreground uppercase">
            缩放对焦 (Scale Fade)
          </span>
          <div className="mt-3 text-base font-semibold text-foreground">
            Mode:{" "}
            <TextLoop
              interval={2.4}
              variants={scaleFadeVariants}
              className="text-amber-500 font-bold"
            >
              {[
                <span key="dev">Developer</span>,
                <span key="team">Team</span>,
                <span key="ent">Enterprise</span>,
              ]}
            </TextLoop>
          </div>
        </div>
      </div>
    </div>
  )
}
