import { Typography, TypographyList } from "@/registry/ui/typography"

export default function TypographyElements() {
  return (
    <article className="w-full max-w-xl space-y-4">
      <Typography variant="h3">发布前检查</Typography>
      <TypographyList>
        <li>标题准确描述页面内容</li>
        <li>正文保持适合连续阅读的行高</li>
        <li>
          代码参数使用 <Typography variant="code">inline code</Typography>
        </li>
      </TypographyList>
      <Typography variant="blockquote">
        排版的目标不是展示字体，而是帮助用户理解内容。
      </Typography>
      <Typography variant="muted">最后更新于今天 14:20</Typography>
    </article>
  )
}
