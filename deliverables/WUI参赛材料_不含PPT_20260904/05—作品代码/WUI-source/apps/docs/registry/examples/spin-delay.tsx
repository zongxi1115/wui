"use client"

import * as React from "react"
import { Spin } from "@/registry/ui/spin"
import { Button } from "@/registry/ui/button"

export default function SpinDelay() {
  const [loadingFast, setLoadingFast] = React.useState(false)
  const [loadingSlow, setLoadingSlow] = React.useState(false)

  const triggerFast = () => {
    setLoadingFast(true)
    setTimeout(() => setLoadingFast(false), 200) // 200ms quick request (less than 300ms delay)
  }

  const triggerSlow = () => {
    setLoadingSlow(true)
    setTimeout(() => setLoadingSlow(false), 1500) // 1500ms request (will show after 300ms)
  }

  return (
    <div className="w-full max-w-md space-y-4">
      <div className="rounded-lg border p-4">
        <Spin spinning={loadingFast || loadingSlow} delay={300} label="数据加载中…">
          <div className="space-y-2 p-2">
            <h4 className="text-sm font-semibold">带防闪烁延迟（delay=300ms）</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              当异步请求在 300 毫秒以内极速完成时，指示器完全不会闪现，极大提升流畅感；
              当耗时超过 300 毫秒时才会平滑渐入。
            </p>
          </div>
        </Spin>
      </div>

      <div className="flex items-center gap-3">
        <Button
          size="sm"
          variant="outline"
          disabled={loadingFast || loadingSlow}
          onClick={triggerFast}
        >
          模拟极速请求 (200ms)
        </Button>
        <Button
          size="sm"
          disabled={loadingFast || loadingSlow}
          onClick={triggerSlow}
        >
          模拟正常请求 (1.5s)
        </Button>
      </div>
    </div>
  )
}
