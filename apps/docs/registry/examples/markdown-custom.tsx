import { ArrowUpRightIcon } from "lucide-react"

import { Alert } from "@/registry/ui/alert"
import { Markdown } from "@/registry/ui/markdown"

const content = `### 开放平台 API v3 迁移说明

自 **2026 年 10 月 15 日** 起，\`/v2/orders\` 接口将停止写入，请在此之前完成迁移。完整的字段对照见 [迁移指南](https://example.com/docs/migrate-v3)。

> 旧版 Token 在迁移期间仍然有效，但刷新后只会签发 v3 Token。

1. 在控制台创建 v3 应用，并替换 \`client_id\`
2. 将分页参数 \`page\` 改为游标参数 \`cursor\`
3. 灰度 10% 流量验证后再全量切换

\`\`\`ts
const res = await client.orders.list({
  cursor: next,
  limit: 50,
})
\`\`\`
`

export default function MarkdownCustom() {
  return (
    <div className="mx-auto w-full max-w-2xl">
      <Markdown
        components={{
          blockquote: ({ children }) => (
            <Alert variant="info" title="迁移期间" className="my-5 [&_p]:my-0">
              {children}
            </Alert>
          ),
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noreferrer"
              className="text-primary decoration-primary/40 hover:decoration-primary inline-flex items-center gap-0.5 font-medium underline underline-offset-4 transition-colors"
            >
              {children}
              <ArrowUpRightIcon aria-hidden className="size-3.5" />
            </a>
          ),
        }}
      >
        {content}
      </Markdown>
    </div>
  )
}
