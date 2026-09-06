"use client"

import * as React from "react"
import { PlusIcon } from "lucide-react"

import { Button } from "@/registry/ui/button"
import {
  Drawer,
  DrawerBody,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/registry/ui/drawer"
import { Input } from "@/registry/ui/input"
import { Textarea } from "@/registry/ui/textarea"
import { Switch } from "@/registry/ui/switch"

export default function DrawerForm() {
  const [open, setOpen] = React.useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setOpen(false)
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button>
          <PlusIcon />
          新建业务模块
        </Button>
      </DrawerTrigger>
      <DrawerContent size="lg">
        <form onSubmit={handleSubmit} className="flex h-full flex-col">
          <DrawerHeader>
            <DrawerTitle>创建新服务模块</DrawerTitle>
            <DrawerDescription>
              填写基础信息并配置依赖项。抽屉内容支持独立滚动且底部操作栏吸底。
            </DrawerDescription>
          </DrawerHeader>

          <DrawerBody className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="service-name" className="text-sm font-medium">
                模块名称 <span className="text-destructive">*</span>
              </label>
              <Input
                id="service-name"
                placeholder="例如：auth-gateway-service"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="service-cluster" className="text-sm font-medium">
                目标部署集群
              </label>
              <Input
                id="service-cluster"
                defaultValue="k8s-prod-ap-east-1"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="service-desc" className="text-sm font-medium">
                功能描述
              </label>
              <Textarea
                id="service-desc"
                placeholder="简要描述该微服务模块的核心职责与下游依赖..."
                rows={4}
              />
            </div>

            <div className="rounded-lg border p-4 space-y-4">
              <h4 className="text-sm font-semibold">服务治理策略</h4>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <p className="text-sm font-medium">自动扩缩容 (HPA)</p>
                  <p className="text-xs text-muted-foreground">
                    当 CPU 负载持续超过 75% 时自动增加 Pod 副本
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between border-t pt-3">
                <div className="space-y-0.5">
                  <p className="text-sm font-medium">链路追踪采集</p>
                  <p className="text-xs text-muted-foreground">
                    向 OpenTelemetry 收集端上报全链路 Trace 追踪数据
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
          </DrawerBody>

          <DrawerFooter>
            <DrawerClose asChild>
              <Button type="button" variant="outline">
                取消
              </Button>
            </DrawerClose>
            <Button type="submit">立即创建</Button>
          </DrawerFooter>
        </form>
      </DrawerContent>
    </Drawer>
  )
}
