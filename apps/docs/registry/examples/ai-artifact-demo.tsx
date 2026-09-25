"use client"

import * as React from "react"

import { Badge } from "@/registry/ui/badge"
import { Button } from "@/registry/ui/button"
import {
  AiArtifact,
  AiArtifactActions,
  AiArtifactBody,
  AiArtifactCode,
  AiArtifactCopy,
  AiArtifactFullscreenToggle,
  AiArtifactHeader,
  AiArtifactPanel,
  AiArtifactPreview,
  AiArtifactTabList,
  AiArtifactTabTrigger,
  AiArtifactTitle,
} from "@/registry/ui/ai-artifact"

const SAMPLE_CODE = `import { useState } from "react"

export function Counter() {
  const [count, setCount] = useState(0)

  return (
    <div className="flex flex-col items-center gap-3">
      <span className="font-mono text-4xl tabular-nums">{count}</span>
      <div className="flex gap-2">
        <button onClick={() => setCount((c) => c - 1)}>-1</button>
        <button onClick={() => setCount((c) => c + 1)}>+1</button>
        <button onClick={() => setCount(0)}>重置</button>
      </div>
    </div>
  )
}`

export default function AiArtifactDemo() {
  const [count, setCount] = React.useState(0)

  return (
    <AiArtifact defaultTab="preview" className="mx-auto w-full max-w-xl">
      <AiArtifactHeader
        badge={
          <Badge variant="outline" size="sm">
            React 组件
          </Badge>
        }
      >
        <AiArtifactTitle>Counter.tsx</AiArtifactTitle>
        <div className="ml-auto flex items-center gap-2">
          <AiArtifactTabList>
            <AiArtifactTabTrigger value="preview">预览</AiArtifactTabTrigger>
            <AiArtifactTabTrigger value="code">代码</AiArtifactTabTrigger>
          </AiArtifactTabList>
          <AiArtifactActions>
            <AiArtifactCopy content={SAMPLE_CODE} />
            <AiArtifactFullscreenToggle />
          </AiArtifactActions>
        </div>
      </AiArtifactHeader>
      <AiArtifactBody>
        <AiArtifactPanel value="preview" className="p-0">
          <AiArtifactPreview className="min-h-56">
            <div className="flex flex-col items-center gap-3">
              <div className="font-mono text-4xl font-semibold tabular-nums tracking-tight">
                {count}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCount((c) => c - 1)}
                >
                  -1
                </Button>
                <Button size="sm" onClick={() => setCount((c) => c + 1)}>
                  +1
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setCount(0)}>
                  重置
                </Button>
              </div>
            </div>
          </AiArtifactPreview>
        </AiArtifactPanel>
        <AiArtifactPanel value="code" className="p-0">
          <AiArtifactCode code={SAMPLE_CODE} language="tsx" />
        </AiArtifactPanel>
      </AiArtifactBody>
    </AiArtifact>
  )
}
