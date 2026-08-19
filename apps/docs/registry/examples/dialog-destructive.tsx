"use client"

import * as React from "react"
import { AlertTriangleIcon, Trash2Icon } from "lucide-react"

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

export default function DialogDestructive() {
  const [open, setOpen] = React.useState(false)
  const [confirmText, setConfirmText] = React.useState("")
  const targetRepo = "wui-design/production-app"
  const isValid = confirmText === targetRepo

  const handleDelete = () => {
    if (!isValid) return
    setOpen(false)
    setConfirmText("")
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive">
          <Trash2Icon />
          删除代码仓库
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[460px]">
        <DialogHeader>
          <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive sm:mx-0">
            <AlertTriangleIcon className="size-6" />
          </div>
          <DialogTitle>确定要删除该仓库吗？</DialogTitle>
          <DialogDescription>
            此操作具有不可逆的破坏性。项目的所有分支、Pull Request、Issue 及部署记录将被永久删除。
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3 py-2">
          <p className="text-xs text-muted-foreground">
            请输入 <span className="font-semibold text-foreground">{targetRepo}</span> 进行安全确认：
          </p>
          <Input
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder={targetRepo}
          />
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">取消</Button>
          </DialogClose>
          <Button
            variant="destructive"
            disabled={!isValid}
            onClick={handleDelete}
          >
            我明白后果，永久删除
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
