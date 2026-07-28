"use client"

import * as React from "react"
import { RefreshCwIcon } from "lucide-react"

import { Button } from "@/registry/ui/button"
import { Spin } from "@/registry/ui/spin"

export default function SpinDemo() {
  const [loading, setLoading] = React.useState(true)

  return (
    <div className="grid w-full max-w-xl gap-5">
      <div className="flex items-end gap-8 border-b pb-5">
        <Spin size="sm" label="同步中" />
        <Spin label="加载中" />
        <Spin size="lg" />
      </div>
      <Spin spinning={loading} label="正在刷新数据…" delay={120}>
        <div className="grid grid-cols-3 border">
          {[
            ["活跃项目", "24"],
            ["本周交付", "8"],
            ["待处理", "13"],
          ].map(([label, value]) => (
            <div key={label} className="border-r p-4 last:border-r-0">
              <p className="text-muted-foreground text-xs">{label}</p>
              <p className="mt-1 text-xl font-semibold tabular-nums">{value}</p>
            </div>
          ))}
        </div>
      </Spin>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="w-fit"
        onClick={() => setLoading((value) => !value)}
      >
        <RefreshCwIcon />
        {loading ? "显示内容" : "重新加载"}
      </Button>
    </div>
  )
}
