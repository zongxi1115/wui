import { Settings2Icon } from "lucide-react"

import { Button } from "@/registry/ui/button"
import { Checkbox } from "@/registry/ui/checkbox"
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

export default function DialogLayout() {
  return (
    <div className="w-full max-w-md">
      <Dialog variant="inline">
        <DialogTrigger asChild>
          <Button variant="outline">
            <Settings2Icon />
            访问权限设置
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>工作区访问权限</DialogTitle>
            <DialogDescription>
              设置成员如何发现并申请加入此工作区。
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-1.5">
            <label htmlFor="workspace-name" className="text-sm font-medium">
              工作区名称
            </label>
            <Input id="workspace-name" defaultValue="北极星设计组" />
          </div>
          <label className="text-muted-foreground flex items-center gap-2 text-sm">
            <Checkbox defaultChecked />
            允许成员申请访问
          </label>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="ghost" size="sm">
                取消
              </Button>
            </DialogClose>
            <DialogClose asChild>
              <Button size="sm">保存</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
