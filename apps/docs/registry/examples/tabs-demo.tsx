"use client"

import { ActivityIcon, Layers3Icon, SlidersHorizontalIcon } from "lucide-react"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/registry/ui/tabs"

export default function TabsDemo() {
  return (
    <Tabs defaultValue="overview" className="w-full max-w-lg">
      <TabsList>
        <TabsTrigger value="overview">
          <Layers3Icon />
          概览
        </TabsTrigger>
        <TabsTrigger value="activity">
          <ActivityIcon />
          动态
        </TabsTrigger>
        <TabsTrigger value="automation">
          <SlidersHorizontalIcon />
          自动化
        </TabsTrigger>
      </TabsList>
      <TabsContent value="overview">
        <Panel
          value="68%"
          label="本周迭代完成率"
          detail="较上周提升 12%，剩余 9 项任务"
        />
      </TabsContent>
      <TabsContent value="activity">
        <Panel
          value="1,284"
          label="今日处理事件"
          detail="来自 18 条运行中的工作流"
        />
      </TabsContent>
      <TabsContent value="automation">
        <Panel
          value="3"
          label="已启用的自动化规则"
          detail="全部运行正常，最近一次触发于 5 分钟前"
        />
      </TabsContent>
    </Tabs>
  )
}

function Panel({
  value,
  label,
  detail,
}: {
  value: string
  label: string
  detail: string
}) {
  return (
    <div className="border-t px-1 py-5">
      <p className="text-4xl font-semibold tabular-nums tracking-tight">
        {value}
      </p>
      <p className="mt-2 text-sm font-medium">{label}</p>
      <p className="text-muted-foreground mt-1 text-xs">{detail}</p>
    </div>
  )
}
