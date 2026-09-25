import {
  BellIcon,
  KeyRoundIcon,
  PlugIcon,
  ShieldCheckIcon,
  UsersIcon,
} from "lucide-react"

import { AnimatedBackground } from "@/registry/ui/animated-background"

const items = [
  {
    id: "members",
    icon: UsersIcon,
    title: "成员与角色",
    description: "邀请成员，按项目分配编辑、评审与只读权限。",
  },
  {
    id: "security",
    icon: ShieldCheckIcon,
    title: "安全策略",
    description: "强制双因素认证，限制登录 IP 与会话时长。",
  },
  {
    id: "tokens",
    icon: KeyRoundIcon,
    title: "访问令牌",
    description: "为 CI 与脚本创建带有效期的最小权限令牌。",
  },
  {
    id: "integrations",
    icon: PlugIcon,
    title: "第三方集成",
    description: "连接飞书、GitHub 与 Sentry，同步事件与告警。",
  },
  {
    id: "notifications",
    icon: BellIcon,
    title: "通知偏好",
    description: "选择在哪些渠道接收评论、部署与账单提醒。",
  },
]

export default function AnimatedBackgroundList() {
  return (
    <ul className="flex w-full max-w-md flex-col">
      <AnimatedBackground
        mode="hover"
        highlightClassName="rounded-md bg-muted"
      >
        {items.map((item) => (
          <li key={item.id} data-id={item.id}>
            <a
              href={`#${item.id}`}
              className="flex items-start gap-3 rounded-md px-3 py-2.5 outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
            >
              <item.icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
              <span className="flex flex-col gap-0.5">
                <span className="text-sm font-medium text-foreground">
                  {item.title}
                </span>
                <span className="text-xs text-muted-foreground">
                  {item.description}
                </span>
              </span>
            </a>
          </li>
        ))}
      </AnimatedBackground>
    </ul>
  )
}
