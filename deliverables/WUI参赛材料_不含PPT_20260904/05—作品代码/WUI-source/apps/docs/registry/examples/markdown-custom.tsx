"use client"

import * as React from "react"
import { CheckIcon, CopyIcon, ExternalLinkIcon, InfoIcon } from "lucide-react"

import { Markdown } from "@/registry/ui/markdown"
import { cn } from "@/registry/lib/utils"

const customContent = `### 自定义组件重载示例

通过 \`components\` 属性，你可以灵活重载任意 Markdown 标签。

> **提示**：这里通过自定义 \`blockquote\` 渲染为带图标的警示卡片！

访问我们的 [官方文档库](https://github.com) 获取更多组件规范。

\`\`\`typescript
interface UserProfile {
  id: string
  name: string
  roles: ("admin" | "editor" | "viewer")[]
}

export function hasPermission(user: UserProfile, role: string): boolean {
  return user.roles.includes(role as any)
}
\`\`\`
`

function CustomCodeBlock({ children, className }: { children: React.ReactNode; className?: string }) {
  const [copied, setCopied] = React.useState(false)
  const codeString = String(children).replace(/\n$/, "")

  const handleCopy = async () => {
    await navigator.clipboard.writeText(codeString)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className={cn("relative my-4 overflow-hidden rounded-lg border bg-muted/60", className)}>
      <div className="flex items-center justify-between border-b bg-muted/80 px-3.5 py-2 text-xs text-muted-foreground font-mono">
        <span>Code Snippet</span>
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
        >
          {copied ? (
            <>
              <CheckIcon className="size-3.5 text-emerald-500" />
              <span className="text-emerald-500">已复制</span>
            </>
          ) : (
            <>
              <CopyIcon className="size-3.5" />
              <span>复制代码</span>
            </>
          )}
        </button>
      </div>
      <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-foreground">
        <code>{children}</code>
      </pre>
    </div>
  )
}

export default function MarkdownCustom() {
  return (
    <div className="w-full max-w-2xl">
      <Markdown
        components={{
          pre: ({ children }) => <>{children}</>,
          code: ({ className, children }) => {
            const isInline = !className && typeof children === "string" && !children.includes("\n")
            if (isInline) {
              return (
                <code className="rounded bg-primary/10 px-1.5 py-0.5 font-mono text-xs font-semibold text-primary">
                  {children}
                </code>
              )
            }
            return <CustomCodeBlock className={className}>{children}</CustomCodeBlock>
          },
          blockquote: ({ children }) => (
            <div className="my-4 flex items-start gap-3 rounded-lg border border-info/30 bg-info/10 p-3.5 text-xs text-foreground">
              <InfoIcon className="size-4 shrink-0 text-info mt-0.5" />
              <div className="space-y-1">{children}</div>
            </div>
          ),
          a: ({ href, children, ...props }) => (
            <a
              href={href}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-0.5 font-medium text-primary underline underline-offset-4 hover:opacity-80"
              {...props}
            >
              <span>{children}</span>
              <ExternalLinkIcon className="size-3" />
            </a>
          ),
        }}
      >
        {customContent}
      </Markdown>
    </div>
  )
}
