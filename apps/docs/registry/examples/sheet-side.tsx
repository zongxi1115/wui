"use client"

import { Button } from "@/registry/ui/button"
import {
  Sheet,
  SheetBody,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/registry/ui/sheet"

const SIDES = [
  { side: "top" as const, label: "顶部", usage: "全局搜索、公告预览" },
  { side: "right" as const, label: "右侧", usage: "记录详情、单条编辑" },
  { side: "bottom" as const, label: "底部", usage: "移动端操作菜单、筛选" },
  { side: "left" as const, label: "左侧", usage: "导航目录、文件树" },
]

export default function SheetSide() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {SIDES.map(({ side, label, usage }) => (
        <Sheet key={side}>
          <SheetTrigger asChild>
            <Button variant="outline">{label}</Button>
          </SheetTrigger>
          <SheetContent side={side}>
            <SheetHeader>
              <SheetTitle>{label}面板</SheetTitle>
              <SheetDescription>side=&quot;{side}&quot;</SheetDescription>
            </SheetHeader>
            <SheetBody className="text-muted-foreground text-sm">
              <p>常用于：{usage}。</p>
            </SheetBody>
            <SheetFooter>
              <SheetClose asChild>
                <Button variant="outline">关闭</Button>
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      ))}
    </div>
  )
}
