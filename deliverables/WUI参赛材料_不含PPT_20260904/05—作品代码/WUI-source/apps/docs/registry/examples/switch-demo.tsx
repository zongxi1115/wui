"use client"

import * as React from "react"
import { Switch } from "@/registry/ui/switch"

export default function SwitchDemo() {
  const [airplaneMode, setAirplaneMode] = React.useState(false)

  return (
    <div className="flex items-center space-x-3">
      <Switch
        id="airplane-mode"
        checked={airplaneMode}
        onCheckedChange={setAirplaneMode}
      />
      <label
        htmlFor="airplane-mode"
        className="text-sm font-medium leading-none select-none cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        飞行模式
      </label>
    </div>
  )
}
