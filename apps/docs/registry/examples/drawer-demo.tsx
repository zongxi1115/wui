"use client"

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
import { Descriptions, DescriptionsItem } from "@/registry/ui/descriptions"

export default function DrawerDemo() {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button motion>查看发布详情</Button>
      </DrawerTrigger>
      <DrawerContent size="default">
        <DrawerHeader>
          <DrawerTitle>版本 2.8.0</DrawerTitle>
          <DrawerDescription>检查变更后再发布到生产环境。</DrawerDescription>
        </DrawerHeader>
        <DrawerBody>
          <Descriptions columns={1} size="sm">
            <DescriptionsItem label="分支">release/2.8</DescriptionsItem>
            <DescriptionsItem label="提交">7f2ac91</DescriptionsItem>
            <DescriptionsItem label="负责人">林澈</DescriptionsItem>
            <DescriptionsItem label="变更">
              12 个文件 · +428 / -96
            </DescriptionsItem>
          </Descriptions>
          <div className="border-primary mt-6 border-l-2 pl-3">
            <p className="text-sm font-medium">部署检查已通过</p>
            <p className="text-muted-foreground mt-1 text-sm leading-6">
              类型检查、依赖审计与预览环境均已完成。
            </p>
          </div>
        </DrawerBody>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline">取消</Button>
          </DrawerClose>
          <Button>确认发布</Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
