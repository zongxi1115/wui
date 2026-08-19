"use client"

import * as React from "react"
import { SearchIcon, RotateCcwIcon } from "lucide-react"
import { Button } from "@/registry/ui/button"
import { Input } from "@/registry/ui/input"
import {
  EmptyState,
  EmptyStateActions,
  EmptyStateDescription,
  EmptyStateHint,
  EmptyStateIllustration,
  EmptyStateMedia,
  EmptyStateTitle,
} from "@/registry/ui/empty-state"

export default function EmptyStateFilter() {
  const [searchTerm, setSearchTerm] = React.useState("GraphQL API 架构指南")

  return (
    <div className="w-full max-w-lg space-y-4 rounded-xl border bg-card p-6">
      <div className="flex items-center gap-2">
        <Input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="搜索知识库文档…"
          startContent={<SearchIcon className="size-4 text-muted-foreground" />}
        />
        {searchTerm && (
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setSearchTerm("")}
          >
            清空
          </Button>
        )}
      </div>

      <EmptyState className="py-6">
        <EmptyStateMedia>
          <EmptyStateIllustration variant="flat" name="search" className="w-28" />
        </EmptyStateMedia>
        <EmptyStateTitle>未找到相关文档</EmptyStateTitle>
        <EmptyStateDescription>
          没有找到与“<span className="text-foreground font-medium">{searchTerm}</span>”匹配的内容。请尝试更换关键词或缩减检索条件。
        </EmptyStateDescription>
        <EmptyStateActions>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setSearchTerm("")}
          >
            <RotateCcwIcon className="size-3.5" />
            重置搜索条件
          </Button>
        </EmptyStateActions>
        <EmptyStateHint>
          支持使用空格连接多个关键词，或使用标签语法如 <code>tag:api</code> 进行精确过滤
        </EmptyStateHint>
      </EmptyState>
    </div>
  )
}
