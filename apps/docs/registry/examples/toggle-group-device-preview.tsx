"use client"

import * as React from "react"
import { motion, useReducedMotion } from "motion/react"
import { LaptopIcon, SmartphoneIcon, TabletIcon } from "lucide-react"

import { ToggleGroup, ToggleGroupItem } from "@/registry/ui/toggle-group"

const devices = {
  desktop: { label: "桌面", width: "100%", viewport: 1440, icon: LaptopIcon },
  tablet: { label: "平板", width: "62%", viewport: 768, icon: TabletIcon },
  mobile: { label: "手机", width: "34%", viewport: 375, icon: SmartphoneIcon },
} as const

type Device = keyof typeof devices

export default function ToggleGroupDevicePreview() {
  const [device, setDevice] = React.useState<Device>("desktop")
  const reduceMotion = useReducedMotion()
  const current = devices[device]

  return (
    <div className="flex w-full max-w-lg flex-col items-center gap-4">
      <ToggleGroup
        type="single"
        size="sm"
        value={device}
        onValueChange={(value) => value && setDevice(value as Device)}
        aria-label="预览设备"
        className="rounded-lg border p-1"
      >
        {(Object.keys(devices) as Device[]).map((key) => {
          const { label, icon: Icon } = devices[key]
          return (
            <ToggleGroupItem key={key} value={key} className="px-3">
              <Icon />
              {label}
            </ToggleGroupItem>
          )
        })}
      </ToggleGroup>

      <div className="bg-muted/40 flex h-44 w-full justify-center rounded-lg border p-3">
        <motion.div
          className="bg-background flex h-full flex-col overflow-hidden rounded-md border"
          initial={false}
          animate={{ width: current.width }}
          transition={
            reduceMotion
              ? { duration: 0 }
              : { type: "spring", stiffness: 320, damping: 34 }
          }
        >
          <div className="flex items-center gap-1 border-b px-2 py-1.5">
            <span className="bg-muted-foreground/30 size-1.5 rounded-full" />
            <span className="bg-muted-foreground/30 size-1.5 rounded-full" />
            <span className="bg-muted-foreground/30 size-1.5 rounded-full" />
            <span className="text-muted-foreground ml-auto font-mono text-[10px] tabular-nums">
              {current.viewport}px
            </span>
          </div>
          <div className="flex flex-1 flex-col gap-1.5 p-3">
            <span className="bg-muted h-2 w-2/3 rounded-sm" />
            <span className="bg-muted h-2 w-full rounded-sm" />
            <span className="bg-muted h-2 w-5/6 rounded-sm" />
          </div>
        </motion.div>
      </div>
    </div>
  )
}
