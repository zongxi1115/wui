"use client"

import * as React from "react"
import { BellIcon, CheckCheckIcon, MailIcon, PlusIcon } from "lucide-react"

import { Button } from "@/registry/ui/button"
import { NotificationBadge } from "@/registry/ui/notification-badge"

export default function NotificationBadgeDemo() {
  const [count, setCount] = React.useState(8)
  const [hasMail, setHasMail] = React.useState(true)

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="flex items-center gap-10">
        <NotificationBadge count={count} label={`${count} 条未读通知`}>
          <Button variant="outline" size="icon" aria-label="通知">
            <BellIcon />
          </Button>
        </NotificationBadge>

        <NotificationBadge dot pulse visible={hasMail} variant="info" label="有新邮件">
          <Button
            variant="outline"
            size="icon"
            aria-label="收件箱"
            onClick={() => setHasMail(false)}
          >
            <MailIcon />
          </Button>
        </NotificationBadge>

        <NotificationBadge count={count * 13} max={99}>
          <span className="bg-muted flex size-9 items-center justify-center rounded-md text-sm font-medium">
            审
          </span>
        </NotificationBadge>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={count === 0}
          onClick={() => setCount(0)}
        >
          <CheckCheckIcon />
          全部已读
        </Button>
        <Button
          size="sm"
          onClick={() => {
            setCount((value) => value + 1)
            setHasMail(true)
          }}
        >
          <PlusIcon />
          收到新消息
        </Button>
      </div>
    </div>
  )
}
