"use client"

import * as React from "react"

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
} from "@/registry/ui/drawer"

type DrawerSize = "sm" | "default" | "lg" | "full"

export default function DrawerSizes() {
  const [size, setSize] = React.useState<DrawerSize>("default")
  const [open, setOpen] = React.useState(false)

  const sizeConfigs: Record<DrawerSize, { label: string; width: string; desc: string }> = {
    sm: { label: "小尺寸 (sm)", width: "20rem (320px)", desc: "紧凑快捷面板、简单通知或单列快速操作" },
    default: { label: "标准尺寸 (default)", width: "26rem (416px)", desc: "标准详情页、常规单列表单与配置项" },
    lg: { label: "大尺寸 (lg)", width: "38rem (608px)", desc: "多列配置表单、数据看板及代码查看器" },
    full: { label: "全屏尺寸 (full)", width: "100vw 全屏", desc: "完整的工作流、独立子系统或复杂可视化" },
  }

  const handleOpen = (s: DrawerSize) => {
    setSize(s)
    setOpen(true)
  }

  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      {(Object.keys(sizeConfigs) as DrawerSize[]).map((key) => (
        <Button
          key={key}
          variant="outline"
          onClick={() => handleOpen(key)}
        >
          {sizeConfigs[key].label}
        </Button>
      ))}

      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerContent size={size}>
          <DrawerHeader>
            <DrawerTitle>抽屉尺寸：{sizeConfigs[size].label}</DrawerTitle>
            <DrawerDescription>
              当前预设宽度：{sizeConfigs[size].width}
            </DrawerDescription>
          </DrawerHeader>
          <DrawerBody>
            <div className="space-y-3 text-sm text-muted-foreground">
              <p className="font-medium text-foreground">适用场景说明：</p>
              <p>{sizeConfigs[size].desc}</p>
              <div className="mt-4 rounded-md border p-3 text-xs">
                在移动端（小屏幕）视口下，所有尺寸均会自动约束并自适应屏幕最大宽度，防止内容溢出。
              </div>
            </div>
          </DrawerBody>
          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="outline">关闭</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  )
}
