import { DatabaseIcon } from "lucide-react"

import {
  AiCitation,
  AiSourceItem,
  AiSources,
  AiSourcesContent,
  AiSourcesHeader,
  AiSourcesList,
} from "@/registry/ui/ai-sources"

const DOCS = [
  {
    index: 1,
    title: "统一身份接入规范 v3.4",
    domain: "安全工程部 · 知识库",
    snippet:
      "所有 Web 应用须启用 PKCE 校验，禁止使用隐式授权流；刷新令牌有效期不超过 14 天。",
  },
  {
    index: 2,
    title: "多机房会话同步方案",
    domain: "架构委员会 · 设计文档",
    snippet:
      "访问令牌采用本地公钥验签，吊销列表通过 Redis 广播，跨机房下线延迟小于 1 秒。",
  },
  {
    index: 3,
    title: "审计日志埋点标准",
    domain: "合规中心 · 制度文件",
    snippet:
      "权限变更、数据导出等操作须实时写入只读审计流，冷存储保留 180 天。",
  },
]

export default function AiSourcesRag() {
  return (
    <div className="mx-auto w-full max-w-2xl space-y-3">
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <DatabaseIcon className="size-3.5" />
        已检索「内部知识库」· 命中 3 篇文档
      </div>

      <div className="space-y-2 text-sm leading-7 text-foreground">
        <p>
          新上线的后台系统需要统一走 OAuth 2.1 + PKCE，不再允许隐式授权流
          <AiCitation {...DOCS[0]} />
          。
        </p>
        <p>
          跨机房部署时，令牌校验采用「本地公钥验签 + Redis 吊销列表」
          <AiCitation {...DOCS[1]} />
          ，涉及权限变更的操作还要同步写入审计流
          <AiCitation {...DOCS[2]} />
          。
        </p>
      </div>

      <AiSources count={DOCS.length}>
        <AiSourcesHeader label={`引用了 ${DOCS.length} 篇内部文档`} />
        <AiSourcesContent>
          <AiSourcesList>
            {DOCS.map((doc) => (
              <AiSourceItem key={doc.index} {...doc} href="#" target="_self" />
            ))}
          </AiSourcesList>
        </AiSourcesContent>
      </AiSources>
    </div>
  )
}
