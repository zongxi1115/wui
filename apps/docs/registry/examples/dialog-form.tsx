"use client"

import * as React from "react"
import { KeyRoundIcon, Loader2Icon } from "lucide-react"

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
import { Switch } from "@/registry/ui/switch"

export default function DialogForm() {
  const [open, setOpen] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const [tokenName, setTokenName] = React.useState("")
  const [readOnly, setReadOnly] = React.useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!tokenName.trim()) return

    setLoading(true)
    // 模拟 API 请求延迟
    await new Promise((resolve) => setTimeout(resolve, 800))
    setLoading(false)
    setOpen(false)
    setTokenName("")
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <KeyRoundIcon />
          创建 API 密钥
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[480px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>创建 API 访问密钥</DialogTitle>
            <DialogDescription>
              访问密钥将用于自动化脚本和外部服务鉴权。请妥善保存生成的密钥。
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="token-name" className="text-sm font-medium">
                密钥标识名称 <span className="text-destructive">*</span>
              </label>
              <Input
                id="token-name"
                placeholder="例如：CI/CD 自动化流水线"
                value={tokenName}
                onChange={(e) => setTokenName(e.target.value)}
                required
              />
            </div>
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div className="space-y-0.5">
                <label htmlFor="readonly-mode" className="text-sm font-medium">
                  只读权限
                </label>
                <p className="text-xs text-muted-foreground">
                  限制此密钥仅可调用查询类接口，禁止写入与删除操作。
                </p>
              </div>
              <Switch
                id="readonly-mode"
                checked={readOnly}
                onCheckedChange={setReadOnly}
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild disabled={loading}>
              <Button type="button" variant="outline" disabled={loading}>
                取消
              </Button>
            </DialogClose>
            <Button type="submit" disabled={!tokenName.trim() || loading}>
              {loading ? (
                <>
                  <Loader2Icon className="animate-spin" />
                  创建中...
                </>
              ) : (
                "确认生成"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
