"use client"

import * as React from "react"
import { Loader2Icon } from "lucide-react"
import { Switch } from "@/registry/ui/switch"

export default function SwitchAsync() {
  const [enabled, setEnabled] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const [message, setMessage] = React.useState<string | null>(null)

  async function handleCheckedChange(nextChecked: boolean) {
    setIsLoading(true)
    setMessage("正在同步服务端设置...")

    // 模拟网络请求
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setEnabled(nextChecked)
      setMessage(nextChecked ? "已成功启用双重认证" : "已停用双重认证")
    } catch {
      setMessage("同步失败，状态已回滚")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-3 max-w-sm">
      <div className="flex items-center justify-between gap-4">
        <label
          htmlFor="two-factor"
          className="flex flex-col gap-1 cursor-pointer select-none"
        >
          <span className="text-sm font-medium">双重身份验证 (2FA)</span>
          <span className="text-xs text-muted-foreground">
            登录时需要额外提供一次性动态验证码
          </span>
        </label>
        <div className="flex items-center gap-2">
          {isLoading && (
            <Loader2Icon className="size-4 animate-spin text-muted-foreground" />
          )}
          <Switch
            id="two-factor"
            checked={enabled}
            disabled={isLoading}
            onCheckedChange={handleCheckedChange}
          />
        </div>
      </div>

      {message && (
        <p className="text-xs text-muted-foreground animate-in fade-in duration-200">
          {message}
        </p>
      )}
    </div>
  )
}
