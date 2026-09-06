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
  { side: "top" as const, label: "顶部滑出 (Top)" },
  { side: "right" as const, label: "右侧滑出 (Right)" },
  { side: "bottom" as const, label: "底部滑出 (Bottom)" },
  { side: "left" as const, label: "左侧滑出 (Left)" },
]

export default function SheetSide() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {SIDES.map(({ side, label }) => (
        <Sheet key={side}>
          <SheetTrigger asChild>
            <Button variant="outline">{label}</Button>
          </SheetTrigger>
          <SheetContent side={side}>
            <SheetHeader>
              <SheetTitle>{label} 面板</SheetTitle>
              <SheetDescription>
                当前侧抽屉从屏幕的 {side} 边缘进入，支持手势及背景模糊遮罩。
              </SheetDescription>
            </SheetHeader>
            <SheetBody className="flex flex-col items-center justify-center text-center text-sm text-muted-foreground">
              <p>这里可放置侧边导航、长表单、审计明细或移动端操作列表。</p>
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
