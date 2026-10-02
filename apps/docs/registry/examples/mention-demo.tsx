"use client"

import * as React from "react"
import { BotIcon, SendIcon, SparklesIcon } from "lucide-react"

import { Avatar, AvatarBadge, AvatarFallback } from "@/registry/ui/avatar"
import { Badge } from "@/registry/ui/badge"
import { Button } from "@/registry/ui/button"
import { Mention, type MentionOption } from "@/registry/ui/mention"

const options: MentionOption[] = [
  {
    id: "lin-wei",
    label: "林薇",
    description: "设计系统负责人",
    group: "成员",
    icon: (
      <Avatar size="sm">
        <AvatarFallback>林</AvatarFallback>
      </Avatar>
    ),
  },
  {
    id: "zhou-hang",
    label: "周航",
    description: "前端架构 · 在线",
    group: "成员",
    icon: (
      <Avatar size="sm">
        <AvatarFallback>周</AvatarFallback>
        <AvatarBadge size="sm" status="online" />
      </Avatar>
    ),
  },
  {
    id: "assistant",
    label: "写作助手",
    description: "润色、总结与翻译",
    group: "助手",
    icon: (
      <Avatar size="sm" className="rounded-md">
        <AvatarFallback>
          <SparklesIcon className="size-4" />
        </AvatarFallback>
      </Avatar>
    ),
    badge: (
      <Badge
        size="sm"
        variant="secondary"
        className="text-muted-foreground rounded-sm"
      >
        AI
      </Badge>
    ),
  },
  {
    id: "review-bot",
    label: "评审机器人",
    description: "自动检查类型与无障碍问题",
    group: "助手",
    icon: (
      <Avatar size="sm" className="rounded-md">
        <AvatarFallback>
          <BotIcon className="size-4" />
        </AvatarFallback>
      </Avatar>
    ),
    badge: (
      <Badge
        size="sm"
        variant="outline"
        className="text-muted-foreground rounded-sm"
      >
        Bot
      </Badge>
    ),
  },
]

export default function MentionDemo() {
  const [value, setValue] = React.useState(
    "@林薇 新版表单规范已更新，辛苦确认一下校验提示的动效，"
  )
  const [sent, setSent] = React.useState<string[]>([])

  return (
    <div className="grid w-full max-w-md gap-2">
      <span className="text-sm font-medium">评论</span>
      <Mention
        value={value}
        onValueChange={setValue}
        options={options}
        placeholder="输入 @ 提及成员或助手"
      />
      <div className="flex items-center justify-between">
        <span className="text-muted-foreground text-xs">
          ↑↓ 选择，Enter 插入，Esc 关闭
        </span>
        <Button
          size="sm"
          disabled={!value.trim()}
          onClick={() => {
            setSent((current) => [...current, value.trim()])
            setValue("")
          }}
        >
          <SendIcon />
          发送
        </Button>
      </div>
      {sent.length ? (
        <p className="text-muted-foreground text-xs" aria-live="polite">
          已发送 {sent.length} 条评论
        </p>
      ) : null}
    </div>
  )
}
