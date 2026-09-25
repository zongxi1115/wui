"use client"

import * as React from "react"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"

import { Button } from "@/registry/ui/button"
import { TextRotate, type TextRotateHandle } from "@/registry/ui/text-rotate"

const tips = [
  "按住 Shift 拖拽图层，可沿水平或垂直方向锁定移动。",
  "在任意输入框中键入 / 可快速插入组件与模板。",
  "评论中 @ 成员后，对方会在收件箱收到提醒。",
  "Ctrl + K 打开命令面板，搜索文件、成员与设置。",
]

export default function TextRotateControlled() {
  const rotateRef = React.useRef<TextRotateHandle>(null)
  const [index, setIndex] = React.useState(0)
  const [direction, setDirection] = React.useState<"up" | "down">("up")
  const [hovered, setHovered] = React.useState(false)

  return (
    <div
      className="flex w-full max-w-lg flex-col gap-3 rounded-lg border p-4"
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">
          使用技巧
        </span>
        <div className="flex items-center gap-1">
          <span className="mr-1 font-mono text-xs tabular-nums text-muted-foreground">
            {index + 1} / {tips.length}
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="size-7"
            aria-label="上一条"
            onClick={() => {
              setDirection("down")
              rotateRef.current?.previous()
            }}
          >
            <ChevronLeftIcon />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="size-7"
            aria-label="下一条"
            onClick={() => {
              setDirection("up")
              rotateRef.current?.next()
            }}
          >
            <ChevronRightIcon />
          </Button>
        </div>
      </div>
      <TextRotate
        ref={rotateRef}
        texts={tips}
        split="lines"
        direction={direction}
        interval={4}
        paused={hovered}
        onIndexChange={(next) => {
          setIndex(next)
          if (!hovered) setDirection("up")
        }}
        className="text-sm leading-6 text-foreground"
      />
    </div>
  )
}
