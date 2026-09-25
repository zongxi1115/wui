import { Typography, TypographyLink } from "@/registry/ui/typography"

export default function TypographyDemo() {
  return (
    <article className="w-full max-w-2xl">
      <Typography variant="muted">产品设计 · 阅读约 4 分钟</Typography>
      <Typography variant="h1" className="mt-2">
        为复杂产品建立清晰层级
      </Typography>
      <Typography variant="lead" className="mt-4">
        一套稳定的排版比例，比不断增加装饰更容易建立可靠的阅读体验。
      </Typography>
      <Typography variant="h3" as="h2" className="mt-10">
        先确定信息的主次
      </Typography>
      <Typography className="mt-3">
        标题说明页面主题，正文承载完整信息，辅助文字只补充必要上下文。当一个页面同时出现五种字号和三种字重时，用户往往需要额外判断“哪一段更重要”。
      </Typography>
      <Typography className="mt-4">
        建议正文保持 16px 与 1.75 倍行高，段落之间留出一行的呼吸空间。完整规则见
        <TypographyLink href="#">排版规范</TypographyLink>。
      </Typography>
    </article>
  )
}
