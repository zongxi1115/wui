"use client"

import * as React from "react"
import { BellIcon, KeyRoundIcon, ShieldCheckIcon } from "lucide-react"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/registry/ui/accordion"
import { Button } from "@/registry/ui/button"

const sections = [
  {
    value: "security",
    icon: ShieldCheckIcon,
    title: "登录安全",
    summary: "已开启两步验证",
    content:
      "登录新设备时需要输入动态验证码。连续 5 次密码错误后，账号将被锁定 15 分钟，并向绑定邮箱发送安全提醒。",
  },
  {
    value: "tokens",
    icon: KeyRoundIcon,
    title: "API 访问令牌",
    summary: "2 个有效令牌",
    content:
      "令牌默认 90 天后过期，过期前 7 天会发送续期提醒。建议为 CI 与生产服务分别创建令牌，并仅授予所需的最小权限。",
  },
  {
    value: "notify",
    icon: BellIcon,
    title: "通知偏好",
    summary: "邮件 · 站内信",
    content:
      "部署失败、账单异常与权限变更会同时通过邮件与站内信通知；日常周报仅通过邮件发送，可随时退订。",
  },
]

export default function AccordionMultiple() {
  const [open, setOpen] = React.useState<string[]>(["security"])
  const allOpen = open.length === sections.length

  return (
    <div className="flex w-full max-w-xl flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-muted-foreground text-xs">
          已展开 {open.length} / {sections.length} 项
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setOpen(allOpen ? [] : sections.map((s) => s.value))}
        >
          {allOpen ? "全部收起" : "全部展开"}
        </Button>
      </div>

      <Accordion type="multiple" variant="separated" value={open} onValueChange={setOpen}>
        {sections.map(({ value, icon: Icon, title, summary, content }) => (
          <AccordionItem key={value} value={value}>
            <AccordionTrigger>
              <span className="flex items-center gap-3">
                <Icon className="text-muted-foreground size-4 shrink-0" />
                <span className="flex-1">{title}</span>
                <span className="text-muted-foreground text-xs font-normal">
                  {summary}
                </span>
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <p className="pl-7">{content}</p>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}
