"use client"

import * as React from "react"

import { Button } from "@/registry/ui/button"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/registry/ui/resizable"

const logs = [
  { time: "14:02:11", level: "info", text: "编译完成，用时 842ms" },
  { time: "14:02:12", level: "info", text: "热更新已应用到 3 个模块" },
  { time: "14:02:19", level: "warn", text: "图片 hero.png 超过 500KB，建议压缩" },
]

export default function ResizableAdvanced() {
  const [size, setSize] = React.useState(64)

  return (
    <div className="w-full max-w-2xl space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-muted-foreground text-xs tabular-nums">
          预览区 {Math.round(size)}% · 控制台 {100 - Math.round(size)}%
        </span>
        <div className="flex gap-1">
          <Button variant="ghost" size="sm" onClick={() => setSize(30)}>
            展开控制台
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setSize(75)}>
            收起控制台
          </Button>
        </div>
      </div>
      <ResizablePanelGroup
        orientation="vertical"
        size={size}
        onSizeChange={setSize}
        minSize={30}
        maxSize={75}
        step={5}
        className="h-80 rounded-lg border"
      >
        <ResizablePanel className="grid place-items-center p-5">
          <div className="text-center">
            <p className="text-sm font-medium">实时预览</p>
            <p className="text-muted-foreground mt-1 text-xs">
              拖动分隔线或聚焦后使用 ↑ ↓ 调整
            </p>
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel className="bg-muted/30 space-y-1 p-4 font-mono text-xs">
          {logs.map((log) => (
            <p key={log.time} className="flex gap-3">
              <span className="text-muted-foreground">{log.time}</span>
              <span className={log.level === "warn" ? "text-warning" : "text-info"}>
                {log.level.toUpperCase()}
              </span>
              <span className="truncate">{log.text}</span>
            </p>
          ))}
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}
