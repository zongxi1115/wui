"use client"

import * as React from "react"
import { SendIcon } from "lucide-react"

import { Button } from "@/registry/ui/button"
import { Motion } from "@/registry/ui/motion"

export default function MotionAsChild() {
  const [key, setKey] = React.useState(0)

  return (
    <div className="flex flex-col items-center gap-3">
      <Motion key={key} asChild preset="pop" transition="bouncy">
        <Button onClick={() => setKey((k) => k + 1)}>
          <SendIcon />
          提交审批
        </Button>
      </Motion>
      <p className="text-muted-foreground text-xs">
        动效直接作用在 Button 上，DOM 中没有额外包裹层，点击重播。
      </p>
    </div>
  )
}
