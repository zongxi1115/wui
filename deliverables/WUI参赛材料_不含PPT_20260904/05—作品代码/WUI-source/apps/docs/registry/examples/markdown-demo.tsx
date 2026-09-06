import { Markdown } from "@/registry/ui/markdown"

const content = `## 发布摘要

本次更新为消息内容增加了 **Markdown 解析**，并保持与现有设计变量一致。

- 支持 [链接](https://commonmark.org)、引用与行内代码
- 支持任务列表、表格和删除线等 GFM 语法
- 默认忽略原始 HTML，不直接注入页面

| 能力 | 状态 |
| --- | --- |
| CommonMark | 已支持 |
| GFM | 已支持 |

> 自定义渲染器可以继续替换任意 Markdown 元素。

\`\`\`tsx
<Markdown>{content}</Markdown>
\`\`\``

export default function MarkdownDemo() {
  return (
    <div className="mx-auto w-full max-w-2xl">
      <Markdown>{content}</Markdown>
    </div>
  )
}
