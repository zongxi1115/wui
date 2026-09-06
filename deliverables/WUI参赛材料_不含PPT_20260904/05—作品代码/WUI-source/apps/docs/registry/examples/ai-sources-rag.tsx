"use client"

import * as React from "react"
import { DatabaseIcon, ShieldCheckIcon } from "lucide-react"

import { Badge } from "@/registry/ui/badge"
import {
  AiCitation,
  AiSourceItem,
  AiSources,
  AiSourcesContent,
  AiSourcesHeader,
  AiSourcesList,
} from "@/registry/ui/ai-sources"

const RAG_SOURCES = [
  {
    index: 1,
    title: "企业安全接入规范 V3.4 - OAuth 2.1 & PKCE 落地指南",
    domain: "内部知识库 · 安全工程部",
    snippet: "所有对内与对外 Web 应用均须强制启用 PKCE Code Verifier 校验，并废弃隐式授权流（Implicit Flow）。",
    favicon: undefined,
  },
  {
    index: 2,
    title: "分布式 Session 与多数据中心 Token 同步架构",
    domain: "架构委员会 · 核心文档",
    snippet: "跨地域容灾单元采用 JWT 自包含签名与 Redis 校验黑名单机制，保证双活机房毫秒级下线通知。",
    favicon: undefined,
  },
  {
    index: 3,
    title: "统一审计日志（Audit Log）埋点标准与合规归档",
    domain: "合规与风控中心",
    snippet: "涉及权限变更、数据导出与敏感参数修改的操作，须实时投递至只读 Kafka Topic 并持久化至冷存储存储 180 天。",
    favicon: undefined,
  },
]

export default function AiSourcesRag() {
  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      <div className="rounded-xl border bg-card p-5 shadow-xs space-y-4">
        {/* Header indicator */}
        <div className="flex items-center justify-between border-b pb-3">
          <div className="flex items-center gap-2">
            <DatabaseIcon className="size-4 text-primary" />
            <span className="text-xs font-semibold text-foreground">企业 RAG 知识库检索</span>
          </div>
          <Badge variant="outline" className="text-success border-success/30 text-[10px] gap-1">
            <ShieldCheckIcon className="size-3" />
            已通过向量相似度校验 (0.94)
          </Badge>
        </div>

        {/* Answer content with inline citations */}
        <div className="text-sm leading-relaxed text-foreground space-y-2">
          <p>
            根据企业内部安全接入规范，新上线的后台系统必须统一迁移至 <strong>OAuth 2.1 规范</strong>
            <AiCitation
              index={1}
              title={RAG_SOURCES[0].title}
              domain={RAG_SOURCES[0].domain}
              snippet={RAG_SOURCES[0].snippet}
            />
            ，完全禁止使用传统的隐式授权流（Implicit Flow）。
          </p>
          <p>
            在跨机房多活架构下，Token 验证采用 <strong>JWT 本地公钥验签 + 集中式 Redis 黑名单</strong>
            <AiCitation
              index={2}
              title={RAG_SOURCES[1].title}
              domain={RAG_SOURCES[1].domain}
              snippet={RAG_SOURCES[1].snippet}
            />
            ，配合异步审计流水日志以满足风控与等保合规要求
            <AiCitation
              index={3}
              title={RAG_SOURCES[2].title}
              domain={RAG_SOURCES[2].domain}
              snippet={RAG_SOURCES[2].snippet}
            />
            。
          </p>
        </div>

        {/* Expandable sources list */}
        <AiSources defaultOpen={true}>
          <AiSourcesHeader label="知识库参考文档 (3)" />
          <AiSourcesContent>
            <AiSourcesList>
              {RAG_SOURCES.map((source) => (
                <AiSourceItem
                  key={source.index}
                  index={source.index}
                  title={source.title}
                  domain={source.domain}
                  snippet={source.snippet}
                  href="#"
                />
              ))}
            </AiSourcesList>
          </AiSourcesContent>
        </AiSources>
      </div>
    </div>
  )
}
