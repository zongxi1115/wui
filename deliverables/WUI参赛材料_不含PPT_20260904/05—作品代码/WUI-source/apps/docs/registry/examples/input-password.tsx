"use client"

import * as React from "react"
import { EyeIcon, EyeOffIcon, LockIcon } from "lucide-react"
import { Input } from "@/registry/ui/input"

export default function InputPassword() {
  const [showPassword, setShowPassword] = React.useState(false)
  const [password, setPassword] = React.useState("")

  return (
    <div className="w-full max-w-sm space-y-2">
      <label htmlFor="user-password" className="text-xs font-medium text-muted-foreground">
        账号密码
      </label>
      <Input
        id="user-password"
        type={showPassword ? "text" : "password"}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="请输入至少 8 位包含字母与数字的密码"
        startContent={<LockIcon className="size-4" />}
        endContent={
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="rounded p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label={showPassword ? "隐藏密码" : "显示密码"}
          >
            {showPassword ? (
              <EyeOffIcon className="size-4" />
            ) : (
              <EyeIcon className="size-4" />
            )}
          </button>
        }
      />
      {password ? (
        <div className="space-y-1 pt-1">
          <div className="flex h-1 w-full gap-1 rounded-full overflow-hidden bg-muted">
            <div className={`h-full flex-1 transition-all ${password.length >= 6 ? "bg-amber-500" : "bg-transparent"}`} />
            <div className={`h-full flex-1 transition-all ${password.length >= 10 ? "bg-emerald-500" : "bg-transparent"}`} />
            <div className={`h-full flex-1 transition-all ${password.length >= 14 ? "bg-emerald-600" : "bg-transparent"}`} />
          </div>
          <span className="text-[11px] text-muted-foreground">
            {password.length < 6 ? "密码强度：弱" : password.length < 10 ? "密码强度：中" : "密码强度：强"}
          </span>
        </div>
      ) : null}
    </div>
  )
}
