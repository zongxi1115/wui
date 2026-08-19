"use client"

import * as React from "react"
import {
  ArrowDownIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowUpIcon,
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

export default function DrawerPlacement() {
  const [side, setSide] = React.useState<Side>("right")
  const [open, setOpen] = React.useState(false)

  const sideLabels: Record<Side, { label: string; icon: React.ReactNode }> = {
    top: { label: "顶部滑出 (Top)", icon: <ArrowDownIcon /> },
    right: { label: "右侧滑出 (Right)", icon: <ArrowLeftIcon /> },
    bottom: { label: "底部滑出 (Bottom)", icon: <ArrowUpIcon /> },
    left: { label: "左侧滑出 (Left)", icon: <ArrowRightIcon /> },
  }

  const handleOpen = (s: Side) => {
    setSide(s)
    setOpen(true)
  }

  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      {(Object.keys(sideLabels) as Side[]).map((key) => (
        <Button
          key={key}
          variant="outline"
          onClick={() => handleOpen(key)}
        >
          {sideLabels[key].icon}
          {sideLabels[key].label}
        </Button>
      ))}

      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerContent side={side} size="default">
          <DrawerHeader>
            <DrawerTitle>从 {side.toUpperCase()} 边缘滑出的抽屉</DrawerTitle>
            <DrawerDescription>
              当前抽屉方向设置为 side=&quot;{side}&quot;。动效与尺寸将自动适配所选边缘。
            </DrawerDescription>
          </DrawerHeader>
          <DrawerBody>
            <div className="rounded-lg border bg-muted/40 p-4 text-sm leading-relaxed text-muted-foreground">
              <p className="font-medium text-foreground">方向适用场景：</p>
              <ul className="mt-2 list-disc space-y-1 pl-4 text-xs">
                <li><strong className="text-foreground">Right</strong>: 桌面端最常用的详情卡片、编辑抽屉。</li>
                <li><strong className="text-foreground">Bottom</strong>: 移动端操作浮层、筛选面板（Bottom Sheet）。</li>
                <li><strong className="text-foreground">Left</strong>: 侧边导航折叠栏、快速文档目录。</li>
                <li><strong className="text-foreground">Top</strong>: 全局通知预览栏、顶部快速搜索控制台。</li>
              </ul>
            </div>
          </DrawerBody>
          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="outline">关闭</Button>
            </DrawerClose>
            <Button onClick={() => setOpen(false)}>知道了</Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  )
}
