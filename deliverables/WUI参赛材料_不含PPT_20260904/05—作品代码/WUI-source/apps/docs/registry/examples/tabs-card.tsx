"use client"

import * as React from "react"
import { LockIcon, UserIcon } from "lucide-react"

import { Button } from "@/registry/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/registry/ui/card"
import { Input } from "@/registry/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/registry/ui/tabs"

export default function TabsCard() {
  return (
    <Tabs defaultValue="account" className="w-full max-w-md">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="account">
          <UserIcon />
          账户信息
        </TabsTrigger>
        <TabsTrigger value="password">
          <LockIcon />
          密码安全
        </TabsTrigger>
      </TabsList>

      <TabsContent value="account">
        <Card>
          <CardHeader>
            <CardTitle>账户设置</CardTitle>
            <CardDescription>
              更新你的个人展示信息与主邮箱地址。
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-1">
              <label htmlFor="name-input" className="text-xs font-medium">姓名</label>
              <Input id="name-input" defaultValue="林澈" />
            </div>
            <div className="space-y-1">
              <label htmlFor="email-input" className="text-xs font-medium">工作邮箱</label>
              <Input id="email-input" defaultValue="linche@wui-design.com" />
            </div>
          </CardContent>
          <CardFooter>
            <Button size="sm">保存修改</Button>
          </CardFooter>
        </Card>
      </TabsContent>

      <TabsContent value="password">
        <Card>
          <CardHeader>
            <CardTitle>密码修改</CardTitle>
            <CardDescription>
              建议使用 12 位以上包含字母和特殊符号的高强度密码。
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-1">
              <label htmlFor="current-pwd" className="text-xs font-medium">当前旧密码</label>
              <Input id="current-pwd" type="password" />
            </div>
            <div className="space-y-1">
              <label htmlFor="new-pwd" className="text-xs font-medium">新密码</label>
              <Input id="new-pwd" type="password" />
            </div>
          </CardContent>
          <CardFooter>
            <Button size="sm">更新密码</Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
