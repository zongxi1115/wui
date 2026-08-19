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

const SIZES = [
  { size: "sm" as const, label: "紧凑 sm (20rem)" },
  { size: "default" as const, label: "标准 default (24rem)" },
  { size: "lg" as const, label: "大号 lg (34rem)" },
  { size: "xl" as const, label: "超大 xl (44rem)" },
]

export default function SheetSizes() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {SIZES.map(({ size, label }) => (
        <Sheet key={size}>
          <SheetTrigger asChild>
            <Button variant="outline">{label}</Button>
          </SheetTrigger>
          <SheetContent size={size}>
            <SheetHeader>
              <SheetTitle>面板尺寸：{size}</SheetTitle>
              <SheetDescription>
                当前预设宽度为 {label}，并自动具备小屏设备下的最大宽度安全边界。
              </SheetDescription>
            </SheetHeader>
            <SheetBody className="space-y-3 text-sm text-muted-foreground">
              <div className="rounded-lg border bg-muted/40 p-4">
                <h4 className="font-semibold text-foreground">适用场景推荐</h4>
                <ul className="mt-2 list-disc pl-4 text-xs space-y-1">
                  <li><strong>sm</strong>：简单的单列操作、快速筛选、轻量说明</li>
                  <li><strong>default</strong>：通用编辑表单、设置偏好、用户资料</li>
                  <li><strong>lg / xl</strong>：复杂工单详情、日志追踪、多步骤审批流</li>
                </ul>
              </div>
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
