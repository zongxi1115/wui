"use client"

import * as React from "react"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/registry/ui/collapsible"
import { Badge } from "@/registry/ui/badge"
import { FileCodeIcon, FileTextIcon, GitCommitIcon } from "lucide-react"

export default function CollapsibleNested() {
  return (
    <div className="w-full max-w-md space-y-2 rounded-xl border bg-card p-4">
      <div className="flex items-center justify-between pb-3 border-b">
        <div className="flex items-center gap-2">
          <GitCommitIcon className="size-4 text-primary" />
          <span className="text-sm font-semibold">变更提交记录 (3 files)</span>
        </div>
        <Badge variant="outline" className="font-mono text-xs">
          +142 / -28
        </Badge>
      </div>

      <Collapsible defaultOpen className="border rounded-md overflow-hidden">
        <CollapsibleTrigger className="bg-muted/40 py-2.5">
          <div className="flex items-center gap-2 text-xs">
            <FileCodeIcon className="size-3.5 text-info" />
            <span className="font-mono font-medium">apps/web/src/App.tsx</span>
            <span className="text-success font-mono ml-auto">+84</span>
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="bg-muted/20 p-3 font-mono text-[11px] text-muted-foreground border-t space-y-1">
            <div className="text-success">+ import &#123; Header &#125; from &quot;@/components/header&quot;</div>
            <div className="text-success">+ import &#123; Sidebar &#125; from &quot;@/components/sidebar&quot;</div>
            <div className="text-muted-foreground">&nbsp;&nbsp;export function App() &#123; ... &#125;</div>
          </div>
        </CollapsibleContent>
      </Collapsible>

      <Collapsible className="border rounded-md overflow-hidden">
        <CollapsibleTrigger className="bg-muted/40 py-2.5">
          <div className="flex items-center gap-2 text-xs">
            <FileTextIcon className="size-3.5 text-warning" />
            <span className="font-mono font-medium">docs/architecture.md</span>
            <span className="text-success font-mono ml-auto">+58</span>
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="bg-muted/20 p-3 font-mono text-[11px] text-muted-foreground border-t">
            <p>更新了微前端网关鉴权与路由分发拓扑图说明章节。</p>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}
