"use client"

import * as React from "react"
import {
  AiCitation,
  AiSourceItem,
  AiSources,
  AiSourcesContent,
  AiSourcesHeader,
  AiSourcesList,
} from "@/registry/ui/ai-sources"

const SOURCES = [
  {
    index: 1,
    title: "React 19 Release Notes & Server Actions Architecture",
    domain: "react.dev",
    snippet: "React 19 adds support for Actions to automatically handle pending states, optimistic updates, and form submissions.",
    href: "https://react.dev",
    favicon: "https://react.dev/favicon.ico",
  },
  {
    index: 2,
    title: "Tailwind CSS v4.0 - A new high-performance engine",
    domain: "tailwindcss.com",
    snippet: "Tailwind CSS v4 is an all-new high-performance engine built for the modern web with native CSS variable support.",
    href: "https://tailwindcss.com",
    favicon: "https://tailwindcss.com/favicon.ico",
  },
  {
    index: 3,
    title: "Radix Primitives Documentation & Accessibility Guide",
    domain: "radix-ui.com",
    snippet: "Unstyled, accessible components for building high‑quality design systems and web apps in React.",
    href: "https://radix-ui.com",
    favicon: "https://radix-ui.com/favicon.ico",
  },
]

export default function AiSourcesDemo() {
  return (
    <div className="w-full max-w-2xl space-y-4 text-sm leading-relaxed text-foreground">
      <div className="rounded-xl border bg-card p-4 shadow-xs">
        <p className="mb-2">
          根据最新的官方规范，React 19 引入了原生 Actions 支持
          <AiCitation
            index={1}
            title={SOURCES[0].title}
            domain={SOURCES[0].domain}
            snippet={SOURCES[0].snippet}
            href={SOURCES[0].href}
            favicon={SOURCES[0].favicon}
          />
          ，配合 Tailwind CSS v4 的 OKLCH 色彩空间与全新编译引擎
          <AiCitation
            index={2}
            title={SOURCES[1].title}
            domain={SOURCES[1].domain}
            snippet={SOURCES[1].snippet}
            href={SOURCES[1].href}
            favicon={SOURCES[1].favicon}
          />
          ，可以大幅降低组件库的运行时体积并提升无障碍标准
          <AiCitation
            index={3}
            title={SOURCES[2].title}
            domain={SOURCES[2].domain}
            snippet={SOURCES[2].snippet}
            href={SOURCES[2].href}
            favicon={SOURCES[2].favicon}
          />
          。
        </p>

        <AiSources defaultOpen={true}>
          <AiSourcesHeader label="参考来源 (3)" />
          <AiSourcesContent>
            <AiSourcesList>
              {SOURCES.map((source) => (
                <AiSourceItem key={source.index} {...source} />
              ))}
            </AiSourcesList>
          </AiSourcesContent>
        </AiSources>
      </div>
    </div>
  )
}
