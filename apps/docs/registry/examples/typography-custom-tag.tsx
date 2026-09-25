import { Typography, TypographyLink } from "@/registry/ui/typography"

export default function TypographyCustomTag() {
  return (
    <div className="w-full max-w-xl">
      <nav aria-label="面包屑">
        <Typography variant="muted" as="span">
          帮助中心 / 账号与安全
        </Typography>
      </nav>

      {/* 页面唯一的 h1，但在详情页中使用 h3 的视觉尺寸 */}
      <Typography variant="h3" as="h1" className="mt-2">
        如何开启两步验证
      </Typography>
      <Typography variant="muted" className="mt-1">
        更新于 2026 年 9 月 12 日
      </Typography>

      {/* 语义上是 h2，视觉上作为小节标签 */}
      <Typography
        variant="small"
        as="h2"
        className="text-muted-foreground mt-8"
      >
        操作步骤
      </Typography>
      <Typography className="mt-2">
        在 <strong className="font-medium">设置 → 账号安全</strong>{" "}
        中选择“两步验证”，使用身份验证器应用扫描二维码，再输入 6
        位动态码完成绑定。
      </Typography>

      <Typography variant="small" as="h2" className="text-muted-foreground mt-8">
        相关文章
      </Typography>
      <Typography asChild className="mt-2">
        <div>
          <TypographyLink href="#">更换绑定手机号</TypographyLink>
          <span className="text-muted-foreground mx-2">·</span>
          <TypographyLink href="#">找回无法登录的账号</TypographyLink>
        </div>
      </Typography>
    </div>
  )
}
