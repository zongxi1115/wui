import { Typography, TypographyLink } from "@/registry/ui/typography"

export default function TypographyDemo() {
  return (
    <article className="w-full max-w-2xl space-y-5">
      <Typography variant="h1">为复杂产品建立清晰层级</Typography>
      <Typography variant="lead">
        一套稳定的排版比例，比不断增加装饰更容易建立可靠的阅读体验。
      </Typography>
      <Typography>
        标题说明页面主题，正文承载完整信息，辅助文字只补充必要上下文。查看
        <TypographyLink href="#">排版规范</TypographyLink>了解更多。
      </Typography>
    </article>
  )
}
