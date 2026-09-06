"use client"

import * as React from "react"
import { Spin } from "@/registry/ui/spin"
import { Button } from "@/registry/ui/button"

export default function SpinFullscreen() {
  const [fullscreenLoading, setFullscreenLoading] = React.useState(false)

  const handleStartFullscreen = () => {
    setFullscreenLoading(true)
    setTimeout(() => {
      setFullscreenLoading(false)
    }, 2500)
  }

  return (
    <div className="flex flex-col items-start gap-3">
      <p className="text-xs text-muted-foreground">
        全屏遮罩适用于阻塞性的全局关键流转操作（如数据导出、批量发布、环境初始化）。
      </p>
      <Button
        size="sm"
        onClick={handleStartFullscreen}
      >
        开启全屏加载 (2.5s 后自动关闭)
      </Button>
      <Spin
        fullscreen
        spinning={fullscreenLoading}
        label="正在准备全局导出包，请稍候…"
      />
    </div>
  )
}
