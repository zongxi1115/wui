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

const STATS_CODE = `import React from "react";

export function MetricCard({ title, value, change }: { title: string; value: string; change: string }) {
  return (
    <div className="rounded-xl border bg-card p-4 shadow-xs">
      <div className="text-xs font-medium text-muted-foreground">{title}</div>
      <div className="mt-2 text-2xl font-bold font-mono">{value}</div>
      <div className="mt-1 text-xs text-emerald-600 font-medium">{change} 较上周</div>
    </div>
  );
}`

export default function AiArtifactMulti() {
  const [activeTab, setActiveTab] = React.useState("preview")
  const [logs, setLogs] = React.useState<string[]>([
    "[Build] Compiling TypeScript AST…",
    "[Preview] Hot Module Replacement (HMR) connected.",
    "[Console] Component mounted without warnings.",
  ])

  const addLog = () => {
    setLogs((prev) => [...prev, `[Event] User triggered interactive preview at ${new Date().toLocaleTimeString()}`])
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <AiArtifact
        activeTab={activeTab}
        onTabChange={setActiveTab}
        variant="default"
      >
        <AiArtifactHeader
          badge={
            <Badge variant="outline" className="text-[10px]">
              Dashboard Component
            </Badge>
          }
        >
          <AiArtifactTitle>MetricCard.tsx</AiArtifactTitle>
          <div className="ml-auto flex items-center gap-2">
            <AiArtifactTabList>
              <AiArtifactTabTrigger value="preview">Preview</AiArtifactTabTrigger>
              <AiArtifactTabTrigger value="code">Code</AiArtifactTabTrigger>
              <AiArtifactTabTrigger value="console">Console</AiArtifactTabTrigger>
            </AiArtifactTabList>
            <AiArtifactActions>
              <AiArtifactCopy content={STATS_CODE} />
              <AiArtifactFullscreenToggle />
            </AiArtifactActions>
          </div>
        </AiArtifactHeader>

        <AiArtifactBody>
          {/* Tab 1: Preview */}
          <AiArtifactPanel value="preview" className="p-0">
            <AiArtifactPreview className="min-h-60 flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-md">
                <div className="rounded-xl border bg-card p-4 shadow-xs">
                  <div className="text-xs font-medium text-muted-foreground">总活跃用户 (MAU)</div>
                  <div className="mt-1 text-2xl font-bold font-mono text-foreground">128,490</div>
                  <div className="mt-1 text-xs text-success font-medium">+14.2% 较上周</div>
                </div>
                <div className="rounded-xl border bg-card p-4 shadow-xs">
                  <div className="text-xs font-medium text-muted-foreground">API 平均响应耗时</div>
                  <div className="mt-1 text-2xl font-bold font-mono text-foreground">42ms</div>
                  <div className="mt-1 text-xs text-success font-medium">-8.5ms 优化</div>
                </div>
              </div>
              <Button size="sm" variant="outline" onClick={addLog} className="text-xs">
                触发预览交互事件
              </Button>
            </AiArtifactPreview>
          </AiArtifactPanel>

          {/* Tab 2: Code */}
          <AiArtifactPanel value="code" className="p-0">
            <AiArtifactCode code={STATS_CODE} language="tsx" />
          </AiArtifactPanel>

          {/* Tab 3: Console Logs */}
          <AiArtifactPanel value="console" className="p-0">
            <div className="h-full min-h-60 bg-muted/40 p-4 font-mono text-xs text-muted-foreground space-y-1.5 overflow-auto">
              {logs.map((log, i) => (
                <div key={i} className="leading-relaxed">
                  <span className="text-foreground">{log}</span>
                </div>
              ))}
            </div>
          </AiArtifactPanel>
        </AiArtifactBody>
      </AiArtifact>
    </div>
  )
}
