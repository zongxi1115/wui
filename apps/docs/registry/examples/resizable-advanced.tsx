"use client"

import * as React from "react"

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/registry/ui/resizable"

export default function ResizableAdvanced() {
  const [size, setSize] = React.useState(58)

  return (
    <div className="w-full max-w-2xl space-y-3">
      <div className="text-muted-foreground flex justify-between text-xs">
        <span>预览区域</span>
        <span>{Math.round(size)}%</span>
      </div>
      <ResizablePanelGroup
        orientation="vertical"
        size={size}
        onSizeChange={setSize}
        minSize={30}
        maxSize={75}
        step={5}
        className="border-border h-80 border"
      >
        <ResizablePanel className="grid place-items-center p-5">
          <div className="text-center">
            <p className="font-medium">实时预览</p>
            <p className="text-muted-foreground mt-1 text-sm">
              纵向面板同样支持键盘调整
            </p>
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel className="bg-muted/30 p-5">
          <p className="font-medium">控制台</p>
          <p className="text-muted-foreground mt-1 font-mono text-xs">
            等待下一次更新…
          </p>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}
