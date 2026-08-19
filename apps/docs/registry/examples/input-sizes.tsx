"use client"

import * as React from "react"
import { Input } from "@/registry/ui/input"

export default function InputSizes() {
  return (
    <div className="grid w-full max-w-sm gap-4">
      <div className="space-y-1">
        <span className="text-xs font-medium text-muted-foreground">紧凑尺寸 (visualSize="sm" - 32px)</span>
        <Input visualSize="sm" placeholder="紧凑输入框..." />
      </div>

      <div className="space-y-1">
        <span className="text-xs font-medium text-muted-foreground">默认尺寸 (visualSize="default" - 40px)</span>
        <Input visualSize="default" placeholder="标准尺寸输入框..." />
      </div>

      <div className="space-y-1">
        <span className="text-xs font-medium text-muted-foreground">大尺寸 (visualSize="lg" - 48px)</span>
        <Input visualSize="lg" placeholder="大尺寸突出输入框..." />
      </div>
    </div>
  )
}
