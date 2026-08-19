"use client"

import * as React from "react"
import { MicIcon, MicOffIcon, PinIcon, PinOffIcon } from "lucide-react"

import { Toggle } from "@/registry/ui/toggle"

export default function ToggleMute() {
  const [muted, setMuted] = React.useState(false)
  const [pinned, setPinned] = React.useState(true)

  return (
    <div className="bg-background flex flex-wrap items-center gap-4 rounded-xl border p-4 shadow-xs">
      <div className="flex items-center gap-2">
        <Toggle
          variant="outline"
          pressed={muted}
          onPressedChange={setMuted}
          aria-label={muted ? "解除静音麦克风" : "静音麦克风"}
          className={muted ? "border-destructive/40 bg-destructive/10 text-destructive" : ""}
        >
          {muted ? <MicOffIcon className="size-4" /> : <MicIcon className="size-4" />}
          <span>{muted ? "已静音" : "麦克风开启"}</span>
        </Toggle>
      </div>

      <div className="flex items-center gap-2">
        <Toggle
          variant="default"
          pressed={pinned}
          onPressedChange={setPinned}
          aria-label={pinned ? "取消窗口置顶" : "置顶窗口"}
        >
          {pinned ? <PinIcon className="size-4 rotate-45 text-primary" /> : <PinOffIcon className="size-4" />}
          <span>{pinned ? "已置顶窗口" : "置顶窗口"}</span>
        </Toggle>
      </div>
    </div>
  )
}
