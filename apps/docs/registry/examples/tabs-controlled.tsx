"use client"

import * as React from "react"
import { CheckCheckIcon } from "lucide-react"

import { Badge } from "@/registry/ui/badge"
import { Button } from "@/registry/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/registry/ui/tabs"

type Notice = { id: number; title: string; time: string; read: boolean }
type TabKey = "mentions" | "reviews" | "system"

const initialNotices: Record<TabKey, Notice[]> = {
  mentions: [
    { id: 1, title: "周然在「Q3 设计评审」中提到了你", time: "5 分钟前", read: false },
    { id: 2, title: "许言回复了你在 PR #482 的评论", time: "32 分钟前", read: false },
  ],
  reviews: [
    { id: 3, title: "「结算页改版」等待你审批", time: "1 小时前", read: false },
    { id: 4, title: "「权限模型 v2」已通过评审", time: "昨天", read: true },
  ],
  system: [
    { id: 5, title: "生产环境 v2.14.0 部署完成", time: "今天 09:12", read: true },
  ],
}

const tabs: Array<{ value: TabKey; label: string }> = [
  { value: "mentions", label: "提及我的" },
  { value: "reviews", label: "待审批" },
  { value: "system", label: "系统通知" },
]

export default function TabsControlled() {
  const [tab, setTab] = React.useState<TabKey>("mentions")
  const [notices, setNotices] = React.useState(initialNotices)
  const unreadInTab = notices[tab].filter((notice) => !notice.read).length

  return (
    <Tabs
      value={tab}
      onValueChange={(value) => setTab(value as TabKey)}
      className="w-full max-w-lg"
    >
      <div className="flex items-end justify-between gap-3">
        <TabsList variant="underline">
          {tabs.map((item) => {
            const unread = notices[item.value].filter(
              (notice) => !notice.read
            ).length
            return (
              <TabsTrigger key={item.value} value={item.value}>
                {item.label}
                {unread ? (
                  <Badge size="sm" variant="secondary" className="tabular-nums">
                    {unread}
                  </Badge>
                ) : null}
              </TabsTrigger>
            )
          })}
        </TabsList>
        <Button
          size="sm"
          variant="ghost"
          className="mb-1"
          disabled={unreadInTab === 0}
          onClick={() =>
            setNotices((current) => ({
              ...current,
              [tab]: current[tab].map((notice) => ({ ...notice, read: true })),
            }))
          }
        >
          <CheckCheckIcon />
          全部已读
        </Button>
      </div>

      {tabs.map((item) => (
        <TabsContent key={item.value} value={item.value}>
          <ul className="divide-y">
            {notices[item.value].map((notice) => (
              <li key={notice.id} className="flex items-start gap-3 py-3">
                <span
                  aria-hidden
                  className={
                    notice.read
                      ? "mt-1.5 size-1.5 shrink-0 rounded-full"
                      : "bg-primary mt-1.5 size-1.5 shrink-0 rounded-full"
                  }
                />
                <div className="min-w-0 flex-1">
                  <p
                    className={
                      notice.read
                        ? "text-muted-foreground truncate text-sm"
                        : "truncate text-sm font-medium"
                    }
                  >
                    {notice.title}
                  </p>
                  <p className="text-muted-foreground mt-0.5 text-xs">
                    {notice.time}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </TabsContent>
      ))}
    </Tabs>
  )
}
