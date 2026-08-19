"use client"

import * as React from "react"
import { BuildingIcon, KeyIcon, UsersIcon } from "lucide-react"

import { Button } from "@/registry/ui/button"
import { Input } from "@/registry/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/registry/ui/tabs"

export default function TabsUnderline() {
  return (
    <Tabs defaultValue="general" className="w-full max-w-lg">
      <TabsList variant="underline" className="w-full justify-start">
        <TabsTrigger value="general">
          <BuildingIcon />
          基本信息
        </TabsTrigger>
        <TabsTrigger value="members">
          <UsersIcon />
          成员权限
        </TabsTrigger>
        <TabsTrigger value="apikeys">
          <KeyIcon />
          API 密钥
        </TabsTrigger>
      </TabsList>

      <TabsContent value="general" className="space-y-4 pt-2">
        <div className="space-y-2">
          <label htmlFor="team-name" className="text-sm font-medium">
            团队组织名称
          </label>
          <Input id="team-name" defaultValue="WUI Design Systems" />
        </div>
        <div className="space-y-2">
          <label htmlFor="team-slug" className="text-sm font-medium">
            域名 Slug
          </label>
          <Input id="team-slug" defaultValue="wui-design" />
        </div>
        <Button size="sm">保存修改</Button>
      </TabsContent>

      <TabsContent value="members" className="space-y-3 pt-2">
        <p className="text-sm font-medium">活跃成员 (3)</p>
        <div className="divide-y rounded-md border text-xs">
          <div className="flex items-center justify-between p-2.5">
            <div>
              <p className="font-semibold text-foreground">林澈 (你)</p>
              <p className="text-muted-foreground">linche@wui-design.com</p>
            </div>
            <span className="rounded bg-primary/10 px-2 py-0.5 font-medium text-primary">拥有者</span>
          </div>
          <div className="flex items-center justify-between p-2.5">
            <div>
              <p className="font-semibold text-foreground">张晓峰</p>
              <p className="text-muted-foreground">zhang@wui-design.com</p>
            </div>
            <span className="text-muted-foreground">管理员</span>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="apikeys" className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">生产环境密钥</p>
            <p className="text-xs text-muted-foreground">最后更新于 2 天前</p>
          </div>
          <Button size="sm" variant="outline">重新生成</Button>
        </div>
      </TabsContent>
    </Tabs>
  )
}
