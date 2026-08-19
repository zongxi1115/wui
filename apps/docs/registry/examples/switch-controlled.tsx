"use client"

import * as React from "react"
import { Switch } from "@/registry/ui/switch"
import { Button } from "@/registry/ui/button"

export default function SwitchControlled() {
  const [checked, setChecked] = React.useState(true)

  return (
    <div className="flex flex-col items-start gap-4">
      <div className="flex items-center gap-3">
        <Switch
          id="controlled-switch"
          checked={checked}
          onCheckedChange={setChecked}
        />
        <label
          htmlFor="controlled-switch"
          className="text-sm font-medium leading-none cursor-pointer"
        >
          推送通知：<span className="text-muted-foreground">{checked ? "已开启" : "已关闭"}</span>
        </label>
      </div>

      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={() => setChecked((prev) => !prev)}
        >
          外部切换状态
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => setChecked(false)}
        >
          重置为关闭
        </Button>
      </div>
    </div>
  )
}
