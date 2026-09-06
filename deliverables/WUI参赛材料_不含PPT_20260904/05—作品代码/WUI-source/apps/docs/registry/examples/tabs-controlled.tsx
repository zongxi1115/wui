"use client"

import * as React from "react"
import { CheckCircle2Icon, InboxIcon, ShieldAlertIcon } from "lucide-react"

import { Badge } from "@/registry/ui/badge"
import { Button } from "@/registry/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/registry/ui/tabs"

export default function TabsControlled() {
  const [tab, setTab] = React.useState("unread")

  return (
    <div className="w-full max-w-lg space-y-4">
      <div className="flex items-center justify-between">
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList>
            <TabsTrigger value="unread" className="gap-2">
              <InboxIcon />
              未读通知
              <Badge variant="secondary" className="px-1.5 py-0 text-xs">
                3
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="alerts" className="gap-2">
              <ShieldAlertIcon />
              安全告警
              <Badge variant="destructive" className="px-1.5 py-0 text-xs">
                1
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="archived" className="gap-2">
              <CheckCircle2Icon />
              已处理
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <Button
          size="sm"
          variant="outline"
          onClick={() => setTab("unread")}
          disabled={tab === "unread"}
        >
          查看未读
        </Button>
      </div>

      <div className="rounded-lg border bg-card p-4">
        {tab === "unread" && (
          <div className="space-y-2">
            <h4 className="text-sm font-semibold">未读通知 (3 条)</h4>
            <p className="text-xs text-muted-foreground">
              最新部署已在集群 prod-node-03 成功完成上线。
            </p>
          </div>
        )}
        {tab === "alerts" && (
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-destructive">安全告警 (1 条)</h4>
            <p className="text-xs text-muted-foreground">
              检测到未授权的 SSH 登录尝试（来自 IP 198.51.100.24）。
            </p>
          </div>
        )}
        {tab === "archived" && (
          <div className="space-y-2">
            <h4 className="text-sm font-semibold">已归档</h4>
            <p className="text-xs text-muted-foreground">
              过去 7 天已完成 42 项自动化巡检任务。
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
