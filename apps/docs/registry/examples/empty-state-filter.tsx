"use client"

import * as React from "react"
import { FileTextIcon, RotateCcwIcon, SearchIcon } from "lucide-react"

import { Button } from "@/registry/ui/button"
import {
  EmptyState,
  EmptyStateActions,
  EmptyStateDescription,
  EmptyStateHint,
  EmptyStateIllustration,
  EmptyStateMedia,
  EmptyStateTitle,
} from "@/registry/ui/empty-state"
import { Input } from "@/registry/ui/input"

const docs = [
  { title: "REST API 鉴权与签名", updated: "3 天前" },
  { title: "Webhook 事件订阅指南", updated: "1 周前" },
  { title: "前端组件库接入规范", updated: "2 周前" },
  { title: "灰度发布与回滚流程", updated: "1 个月前" },
]

export default function EmptyStateFilter() {
  const [query, setQuery] = React.useState("GraphQL 架构")
  const keyword = query.trim().toLowerCase()
  const results = docs.filter((doc) => doc.title.toLowerCase().includes(keyword))

  return (
    <div className="w-full max-w-lg space-y-3">
      <Input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        allowClear
        onClear={() => setQuery("")}
        placeholder="搜索知识库文档…"
        aria-label="搜索知识库文档"
        startContent={<SearchIcon />}
      />

      <div aria-live="polite" className="rounded-lg border">
        {results.length > 0 ? (
          <ul className="divide-y">
            {results.map((doc) => (
              <li key={doc.title} className="flex items-center gap-3 px-4 py-3">
                <FileTextIcon className="text-muted-foreground size-4 shrink-0" />
                <span className="flex-1 truncate text-sm">{doc.title}</span>
                <span className="text-muted-foreground text-xs">{doc.updated}</span>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState size="sm">
            <EmptyStateMedia className="mb-4">
              <EmptyStateIllustration variant="flat" name="search" className="w-24" />
            </EmptyStateMedia>
            <EmptyStateTitle>未找到相关文档</EmptyStateTitle>
            <EmptyStateDescription>
              没有与“<span className="text-foreground font-medium">{query}</span>
              ”匹配的内容，换个关键词或清空搜索后再试。
            </EmptyStateDescription>
            <EmptyStateActions>
              <Button size="sm" variant="outline" onClick={() => setQuery("")}>
                <RotateCcwIcon />
                清空搜索
              </Button>
            </EmptyStateActions>
            <EmptyStateHint>
              支持 <code className="font-mono">tag:api</code> 等标签语法精确过滤
            </EmptyStateHint>
          </EmptyState>
        )}
      </div>
    </div>
  )
}
