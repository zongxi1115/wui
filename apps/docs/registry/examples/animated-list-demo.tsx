"use client"

import * as React from "react"
import {
  CreditCardIcon,
  GitPullRequestIcon,
  MessageCircleIcon,
  RocketIcon,
  UserPlusIcon,
  type LucideIcon,
} from "lucide-react"

import { AnimatedList } from "@/registry/ui/animated-list"

interface Notice {
  id: number
  icon: LucideIcon
  title: string
  detail: string
}

const pool: Omit<Notice, "id">[] = [
  { icon: GitPullRequestIcon, title: "林晓 请求你评审", detail: "feat: 新增审计日志导出" },
  { icon: RocketIcon, title: "生产环境部署完成", detail: "web-console · v3.2.0" },
  { icon: MessageCircleIcon, title: "周子航 回复了你的评论", detail: "“这里的空状态文案再斟酌一下”" },
  { icon: UserPlusIcon, title: "新成员加入工作区", detail: "陈思远 · 设计组" },
  { icon: CreditCardIcon, title: "账单已生成", detail: "9 月 · ¥ 4,752.00" },
]

function createNotice(id: number): Notice {
  return { id, ...pool[id % pool.length] }
}

export default function AnimatedListDemo() {
  const [notices, setNotices] = React.useState(() =>
    [0, 1, 2].map(createNotice)
  )

  React.useEffect(() => {
    const timer = window.setInterval(() => {
      setNotices((current) => {
        const next = createNotice(current[current.length - 1].id + 1)
        return [...current.slice(-7), next]
      })
    }, 2400)
    return () => window.clearInterval(timer)
  }, [])

  return (
    <div className="flex w-full max-w-sm flex-col gap-3">
      <span className="text-xs font-medium text-muted-foreground">最新动态</span>
      <AnimatedList delay={0} max={4} aria-label="最新动态">
        {notices.map((notice) => (
          <div
            key={notice.id}
            className="flex items-start gap-3 rounded-lg border bg-background px-3 py-2.5"
          >
            <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-md bg-muted">
              <notice.icon className="size-3.5 text-muted-foreground" />
            </span>
            <span className="flex min-w-0 flex-col gap-0.5">
              <span className="truncate text-sm font-medium">{notice.title}</span>
              <span className="truncate text-xs text-muted-foreground">
                {notice.detail}
              </span>
            </span>
          </div>
        ))}
      </AnimatedList>
    </div>
  )
}
