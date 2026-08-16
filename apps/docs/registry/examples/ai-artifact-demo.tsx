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

const SAMPLE_CODE = `import React, { useState } from "react";

export function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div className="flex flex-col items-center gap-3 p-4">
      <span className="text-3xl font-bold font-mono">{count}</span>
      <div className="flex gap-2">
        <button
          onClick={() => setCount(c => c - 1)}
          className="px-3 py-1.5 rounded-md border bg-muted"
        >
          -1
        </button>
        <button
          onClick={() => setCount(c => c + 1)}
          className="px-3 py-1.5 rounded-md bg-primary text-primary-foreground"
        >
          +1
        </button>
      </div>
    </div>
  );
}`

export default function AiArtifactDemo() {
  const [count, setCount] = React.useState(0)

  return (
    <div className="w-full max-w-xl">
      <AiArtifact defaultTab="preview">
        <AiArtifactHeader
          badge={
            <Badge variant="outline" className="text-[11px] font-normal">
              React Component
            </Badge>
          }
        >
          <AiArtifactTitle>Counter.tsx</AiArtifactTitle>
          <div className="ml-auto flex items-center gap-2">
            <AiArtifactTabList>
              <AiArtifactTabTrigger value="preview">Preview</AiArtifactTabTrigger>
              <AiArtifactTabTrigger value="code">Code</AiArtifactTabTrigger>
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
                <div className="font-mono text-4xl font-bold tracking-tight">
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
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => setCount((c) => c + 1)}
                  >
                    +1
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCount(0)}
                  >
                    Reset
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
    </div>
  )
}
