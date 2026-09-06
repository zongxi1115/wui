"use client"

import * as React from "react"
import { CheckCircle2Icon } from "lucide-react"

import { Badge } from "@/registry/ui/badge"
import { StickyStack, StickyStackItem } from "@/registry/ui/sticky-stack"

const steps = [
  {
    step: "01",
    badge: "Ingestion",
    title: "Real-Time Document Indexing",
    desc: "Parse PDFs, Markdown, and structured JSON into vector embeddings with sub-100ms chunking.",
    bg: "bg-gradient-to-br from-blue-500/10 via-background to-card",
  },
  {
    step: "02",
    badge: "Retrieval",
    title: "Hybrid Semantic Search",
    desc: "Combine BM25 keyword matching with dense HNSW vector similarity for 99.4% top-3 retrieval recall.",
    bg: "bg-gradient-to-br from-indigo-500/10 via-background to-card",
  },
  {
    step: "03",
    badge: "Synthesis",
    title: "Context-Aware Generation",
    desc: "Stream response deltas directly with source citation grounding and hallucination guardrails.",
    bg: "bg-gradient-to-br from-purple-500/10 via-background to-card",
  },
]

export default function StickyStackFeatures() {
  const container = React.useRef<HTMLDivElement>(null)

  return (
    <div
      ref={container}
      className="relative h-96 w-full max-w-xl overflow-y-auto rounded-2xl border bg-card p-6 shadow-md [scrollbar-width:thin]"
    >
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-foreground">
          RAG Pipeline Execution
        </h3>
        <p className="text-xs text-muted-foreground">
          Scroll down to stack execution lifecycle phases.
        </p>
      </div>

      <StickyStack container={container} top={12} gap={10} scaleStep={0.04}>
        {steps.map((item) => (
          <StickyStackItem
            key={item.step}
            className={`rounded-xl border p-5 shadow-lg ${item.bg}`}
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-primary">
                PHASE {item.step}
              </span>
              <Badge variant="outline" className="text-[10px]">
                {item.badge}
              </Badge>
            </div>
            <h4 className="mt-2 text-base font-semibold text-foreground">
              {item.title}
            </h4>
            <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
              {item.desc}
            </p>
            <div className="mt-4 flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400">
              <CheckCircle2Icon className="size-3.5" />
              <span>Automated Verification Pass</span>
            </div>
          </StickyStackItem>
        ))}
      </StickyStack>
    </div>
  )
}
