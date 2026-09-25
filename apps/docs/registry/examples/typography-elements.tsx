import { Typography, TypographyList } from "@/registry/ui/typography"

export default function TypographyElements() {
  return (
    <article className="w-full max-w-xl">
      <Typography variant="h4">发布前检查</Typography>
      <TypographyList>
        <li>标题准确描述页面内容，不超过一行半</li>
        <li>正文保持适合连续阅读的行高与行宽</li>
        <li>
          接口参数使用行内代码，例如 <Typography variant="code">timeout</Typography>
        </li>
      </TypographyList>

      <Typography variant="h4" className="mt-8">
        发布流程
      </Typography>
      <TypographyList ordered>
        <li>在预发环境完成冒烟测试</li>
        <li>由负责人确认变更说明</li>
        <li>按 10%、50%、100% 分批放量</li>
      </TypographyList>

      <Typography variant="blockquote" className="mt-6">
        排版的目标不是展示字体，而是帮助用户理解内容。
      </Typography>
      <Typography variant="muted" className="mt-6">
        最后更新于今天 14:20
      </Typography>
    </article>
  )
}
