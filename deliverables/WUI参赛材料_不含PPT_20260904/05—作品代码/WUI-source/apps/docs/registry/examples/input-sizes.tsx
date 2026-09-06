"use client"

import * as React from "react"
import { Input } from "@/registry/ui/input"

export default function InputSizes() {
  return (
    <div className="grid w-full max-w-sm gap-4">
      <div className="space-y-1">
        <span className="text-muted-foreground text-xs font-medium">
          紧凑尺寸 (size="sm" - 32px)
        </span>
        <Input size="sm" placeholder="紧凑输入框..." />
      </div>

      <div className="space-y-1">
        <span className="text-muted-foreground text-xs font-medium">
          默认尺寸 (size="default" - 40px)
        </span>
        <Input size="default" placeholder="标准尺寸输入框..." />
      </div>

      <div className="space-y-1">
        <span className="text-muted-foreground text-xs font-medium">
          大尺寸 (size="lg" - 48px)
        </span>
        <Input size="lg" placeholder="大尺寸突出输入框..." />
      </div>
    </div>
  )
}
