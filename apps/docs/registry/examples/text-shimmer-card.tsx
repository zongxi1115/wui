import { Bot, Cpu, Database } from "lucide-react"

import { TextShimmer } from "@/registry/ui/text-shimmer"

export default function TextShimmerCard() {
  return (
    <div className="flex w-full max-w-lg flex-col gap-4 rounded-xl border border-border bg-card p-6 shadow-xs">
      <div className="flex items-center justify-between border-b border-border pb-3">
        <div className="flex items-center gap-2">
          <div className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Bot className="size-4" />
          </div>
          <div>
            <h4 className="text-xs font-semibold text-foreground">AI Agent 工作空间</h4>
            <span className="text-[10px] text-muted-foreground">Task #8942 - In Progress</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 rounded-full bg-muted/60 px-2.5 py-1 text-[11px]">
          <span className="size-1.5 rounded-full bg-primary animate-ping" />
          <TextShimmer
            as="span"
            duration={1.5}
            spread={1.5}
            className="text-[11px] font-medium"
          >
            Processing...
          </TextShimmer>
        </div>
      </div>

      <div className="space-y-2.5">
        <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/20 p-3">
          <Cpu className="size-4 shrink-0 text-muted-foreground" />
          <div className="min-w-0 flex-1">
            <TextShimmer
              as="p"
              duration={2}
              spread={2}
              className="text-xs font-medium"
            >
              Computing embedding cosine distances across 40,000 vectors...
            </TextShimmer>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/20 p-3">
          <Database className="size-4 shrink-0 text-muted-foreground" />
          <div className="min-w-0 flex-1">
            <TextShimmer
              as="p"
              duration={2.4}
              spread={2}
              className="text-xs font-medium"
            >
              Retrieving relevant context chunks from Pinecone index...
            </TextShimmer>
          </div>
        </div>
      </div>
    </div>
  )
}
