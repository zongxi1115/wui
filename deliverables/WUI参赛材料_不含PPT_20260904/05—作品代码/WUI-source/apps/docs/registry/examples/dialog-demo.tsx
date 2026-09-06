"use client"

import * as React from "react"

import { Button } from "@/registry/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/registry/ui/dialog"
import { Input } from "@/registry/ui/input"

export default function DialogDemo() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">编辑个人资料</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>编辑个人资料</DialogTitle>
          <DialogDescription>
            在此修改你的公开资料信息。完成后点击保存。
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-2">
          <div className="grid gap-2">
            <label htmlFor="name" className="text-sm font-medium">
              姓名
            </label>
            <Input id="name" defaultValue="林澈" placeholder="请输入你的姓名" />
          </div>
          <div className="grid gap-2">
            <label htmlFor="username" className="text-sm font-medium">
              用户名
            </label>
            <Input id="username" defaultValue="@linche" placeholder="请输入用户名" />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">取消</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button>保存更改</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
