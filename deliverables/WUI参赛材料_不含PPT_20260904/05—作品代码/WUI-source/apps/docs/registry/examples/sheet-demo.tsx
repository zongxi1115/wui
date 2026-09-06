"use client"

import { Button } from "@/registry/ui/button"
import { Input } from "@/registry/ui/input"
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

export default function SheetDemo() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">编辑个人资料</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>编辑个人资料</SheetTitle>
          <SheetDescription>
            在此处修改您的公开档案信息。完成后请点击保存以同步更新。
          </SheetDescription>
        </SheetHeader>
        <SheetBody className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="sheet-name" className="text-xs font-medium">
              姓名
            </label>
            <Input id="sheet-name" defaultValue="宗喜" />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="sheet-username" className="text-xs font-medium">
              用户昵称
            </label>
            <Input id="sheet-username" defaultValue="@zongxi" />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="sheet-bio" className="text-xs font-medium">
              个人简介
            </label>
            <Input id="sheet-bio" defaultValue="前端架构与设计系统工程师" />
          </div>
        </SheetBody>
        <SheetFooter>
          <SheetClose asChild>
            <Button variant="outline">取消</Button>
          </SheetClose>
          <SheetClose asChild>
            <Button>保存更改</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
