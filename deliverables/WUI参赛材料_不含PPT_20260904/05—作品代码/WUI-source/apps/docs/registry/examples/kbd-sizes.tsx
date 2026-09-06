"use client"

import * as React from "react"
import { Kbd, KbdGroup } from "@/registry/ui/kbd"

export default function KbdSizes() {
  return (
    <div className="flex w-full max-w-md flex-col gap-6 rounded-xl border bg-card p-6 shadow-xs">
      <div className="space-y-3">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          标准尺寸 (Default - 24px 高度)
        </span>
        <div className="flex flex-wrap items-center gap-3">
          <KbdGroup>
            <Kbd>⌘</Kbd>
            <Kbd>K</Kbd>
          </KbdGroup>
          <KbdGroup>
            <Kbd>Ctrl</Kbd>
            <Kbd>Shift</Kbd>
            <Kbd>P</Kbd>
          </KbdGroup>
          <Kbd>Enter ↵</Kbd>
          <Kbd>Esc</Kbd>
        </div>
      </div>

      <div className="space-y-3 border-t pt-4">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          紧凑尺寸 (Small - 20px 高度)
        </span>
        <div className="flex flex-wrap items-center gap-3">
          <KbdGroup>
            <Kbd size="sm">⌘</Kbd>
            <Kbd size="sm">C</Kbd>
          </KbdGroup>
          <KbdGroup>
            <Kbd size="sm">Alt</Kbd>
            <Kbd size="sm">F4</Kbd>
          </KbdGroup>
          <Kbd size="sm">Tab ⇥</Kbd>
          <Kbd size="sm">Space</Kbd>
        </div>
      </div>
    </div>
  )
}
