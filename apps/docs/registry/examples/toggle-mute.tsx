"use client"

import * as React from "react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import {
  MicIcon,
  MicOffIcon,
  VideoIcon,
  VideoOffIcon,
  type LucideIcon,
} from "lucide-react"

import { Toggle } from "@/registry/ui/toggle"

function SwapIcon({ on, onIcon, offIcon }: { on: boolean; onIcon: LucideIcon; offIcon: LucideIcon }) {
  const reduceMotion = useReducedMotion()
  const Icon = on ? onIcon : offIcon
  return (
    <span className="relative inline-flex size-4">
      <AnimatePresence initial={false} mode="popLayout">
        <motion.span
          key={on ? "on" : "off"}
          className="absolute inset-0 inline-flex"
          initial={reduceMotion ? false : { opacity: 0, scale: 0.5, rotate: -30 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          exit={reduceMotion ? undefined : { opacity: 0, scale: 0.5, rotate: 30 }}
          transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <Icon />
        </motion.span>
      </AnimatePresence>
    </span>
  )
}

export default function ToggleMute() {
  const [muted, setMuted] = React.useState(false)
  const [cameraOff, setCameraOff] = React.useState(true)

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Toggle
        variant="outline"
        pressed={muted}
        onPressedChange={setMuted}
        aria-label="静音麦克风"
        className="data-[state=on]:border-destructive/40 data-[state=on]:bg-destructive/10 data-[state=on]:text-destructive"
      >
        <SwapIcon on={muted} onIcon={MicOffIcon} offIcon={MicIcon} />
      </Toggle>
      <Toggle
        variant="outline"
        pressed={cameraOff}
        onPressedChange={setCameraOff}
        aria-label="关闭摄像头"
        className="data-[state=on]:border-destructive/40 data-[state=on]:bg-destructive/10 data-[state=on]:text-destructive"
      >
        <SwapIcon on={cameraOff} onIcon={VideoOffIcon} offIcon={VideoIcon} />
      </Toggle>
      <span className="text-muted-foreground ml-1 text-xs">
        {muted ? "麦克风已静音" : "麦克风开启"} · {cameraOff ? "摄像头已关闭" : "摄像头开启"}
      </span>
    </div>
  )
}
