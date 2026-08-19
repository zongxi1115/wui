"use client"

import * as React from "react"
import { Typography, TypographyLink, TypographyList } from "@/registry/ui/typography"

export default function TypographyCustomTag() {
  return (
    <div className="w-full max-w-xl space-y-6 rounded-xl border bg-card p-6 shadow-xs">
      <div className="space-y-2 border-b pb-4">
        {/* 使用 as 覆盖底层渲染标签 */}
        <Typography variant="h2" as="h3">
          多态元素渲染 (Polymorphic Elements)
        </Typography>
        <Typography variant="muted">
          通过 <Typography variant="code">as="span"</Typography> 或{" "}
          <Typography variant="code">asChild</Typography> 实现灵活标签映射。
        </Typography>
      </div>

      <div className="space-y-4">
        {/* asChild 组合自定义按钮/链接 */}
        <Typography variant="small" className="text-primary font-semibold uppercase tracking-wider">
          使用案例
        </Typography>

        <Typography variant="body">
          当 SEO 要求特定标题标签（如 <Typography variant="code">&lt;h1&gt;</Typography>）但在设计视觉上需要匹配{" "}
          <Typography variant="code">h3</Typography> 的适中字号时，你可以轻松指定：
        </Typography>

        <Typography variant="h3" as="h1" className="text-primary">
          视觉是 h3，语义是 h1 页面主标题
        </Typography>

        <TypographyList ordered>
          <li>
            视觉表现与语义结构解耦，兼顾 <strong>视觉设计规范</strong> 与 <strong>无障碍/SEO 权重</strong>。
          </li>
          <li>
            内置 <TypographyLink href="#">TypographyLink</TypographyLink> 拥有高对比度下划线与焦点指示环。
          </li>
          <li>
            支持 <Typography variant="code">text-balance</Typography> 与 <Typography variant="code">text-pretty</Typography>，告别难看的孤字换行。
          </li>
        </TypographyList>
      </div>
    </div>
  )
}
