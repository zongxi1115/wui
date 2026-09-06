"use client"

import * as React from "react"
import { BellIcon, MailIcon, MinusIcon, PlusIcon } from "lucide-react"

import { Button } from "@/registry/ui/button"
import { NotificationBadge } from "@/registry/ui/notification-badge"
import { SlidingNumber } from "@/registry/ui/sliding-number"

export default function NotificationBadgeDemo() {
  const [count, setCount] = React.useState(8)

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex items-center gap-8">
        <NotificationBadge
          count={<SlidingNumber value={count} />}
          label={`${count} unread messages`}
          visible={count > 0}
        >
          <Button variant="outline" size="icon" aria-label="Messages">
            <BellIcon />
          </Button>
        </NotificationBadge>

        <NotificationBadge dot variant="info" label="New mail">
          <Button variant="ghost" size="icon" aria-label="Inbox">
            <MailIcon />
          </Button>
        </NotificationBadge>

        <NotificationBadge count={128} max={99}>
          <span className="bg-muted flex size-9 items-center justify-center rounded-md text-sm font-medium">
            W
          </span>
        </NotificationBadge>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={count === 0}
          onClick={() => setCount((value) => Math.max(0, value - 1))}
        >
          <MinusIcon /> Read one
        </Button>
        <Button size="sm" onClick={() => setCount((value) => value + 1)}>
          <PlusIcon /> New message
        </Button>
      </div>
    </div>
  )
}
