"use client"

import * as React from "react"
import { LaptopIcon, SmartphoneIcon, TabletIcon } from "lucide-react"

import { ToggleGroup, ToggleGroupItem } from "@/registry/ui/toggle-group"

export default function ToggleGroupDevicePreview() {
  const [device, setDevice] = React.useState("desktop")

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-md">
      <ToggleGroup
        type="single"
        value={device}
        onValueChange={(val) => val && setDevice(val)}
        variant="outline"
        aria-label="切换画布预览设备"
        className="bg-background rounded-lg border p-1 shadow-xs"
      >
        <ToggleGroupItem value="desktop" className="gap-2 px-3">
          <LaptopIcon className="size-4" />
          <span className="text-xs">桌面端 (1440px)</span>
        </ToggleGroupItem>

        <ToggleGroupItem value="tablet" className="gap-2 px-3">
          <TabletIcon className="size-4" />
          <span className="text-xs">平板 (768px)</span>
        </ToggleGroupItem>

        <ToggleGroupItem value="mobile" className="gap-2 px-3">
          <SmartphoneIcon className="size-4" />
          <span className="text-xs">移动端 (375px)</span>
        </ToggleGroupItem>
      </ToggleGroup>

      <div className="bg-muted/40 text-muted-foreground w-full rounded-xl border border-dashed py-8 text-center text-xs">
        当前画布视图已适配为：<span className="font-semibold text-foreground">{device}</span> 视口宽度
      </div>
    </div>
  )
}
