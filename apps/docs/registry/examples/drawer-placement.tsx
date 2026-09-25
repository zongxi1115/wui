"use client"

import * as React from "react"
import {
  PanelBottomIcon,
  PanelLeftIcon,
  PanelRightIcon,
  PanelTopIcon,
} from "lucide-react"

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

type Side = "top" | "right" | "bottom" | "left"

const sides: Record<
  Side,
  { label: string; icon: React.ComponentType; title: string; usage: string }
> = {
  top: {
    label: "顶部",
    icon: PanelTopIcon,
    title: "全局搜索",
    usage: "适合全局搜索、公告预览等需要横向铺满的临时面板。",
  },
  right: {
    label: "右侧",
    icon: PanelRightIcon,
    title: "工单详情",
    usage: "桌面端最常用的方向，适合查看详情或编辑单条记录，同时保留列表上下文。",
  },
  bottom: {
    label: "底部",
    icon: PanelBottomIcon,
    title: "筛选条件",
    usage: "移动端的操作浮层与筛选面板，拇指最容易触达。",
  },
  left: {
    label: "左侧",
    icon: PanelLeftIcon,
    title: "文档目录",
    usage: "适合导航目录、文件树等与页面结构相关的辅助内容。",
  },
}

export default function DrawerPlacement() {
  const [side, setSide] = React.useState<Side>("right")
  const [open, setOpen] = React.useState(false)
  const config = sides[side]

  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      {(Object.keys(sides) as Side[]).map((key) => {
        const Icon = sides[key].icon
        return (
          <Button
            key={key}
            variant="outline"
            onClick={() => {
              setSide(key)
              setOpen(true)
            }}
          >
            <Icon />
            {sides[key].label}
          </Button>
        )
      })}

      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerContent side={side}>
          <DrawerHeader>
            <DrawerTitle>{config.title}</DrawerTitle>
            <DrawerDescription>side=&quot;{side}&quot;</DrawerDescription>
          </DrawerHeader>
          <DrawerBody>
            <p className="text-muted-foreground text-sm leading-6">{config.usage}</p>
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
