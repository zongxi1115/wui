"use client"

import * as React from "react"
import { EyeIcon, EyeOffIcon, LockIcon } from "lucide-react"

import { cn } from "@/registry/lib/utils"
import { Input } from "@/registry/ui/input"

function getStrength(password: string) {
  let score = 0
  if (password.length >= 8) score += 1
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 1
  if (/\d/.test(password)) score += 1
  if (/[^A-Za-z0-9]/.test(password)) score += 1
  return score
}

const levels = [
  { label: "太短", tone: "bg-destructive", text: "text-destructive" },
  { label: "弱", tone: "bg-destructive", text: "text-destructive" },
  { label: "一般", tone: "bg-warning", text: "text-warning" },
  { label: "较强", tone: "bg-success", text: "text-success" },
  { label: "强", tone: "bg-success", text: "text-success" },
]

export default function InputPassword() {
  const [visible, setVisible] = React.useState(false)
  const [password, setPassword] = React.useState("")
  const score = getStrength(password)
  const level = levels[score]

  return (
    <div className="grid w-full max-w-sm gap-2">
      <label htmlFor="user-password" className="text-sm font-medium">
        设置登录密码
      </label>
      <Input
        id="user-password"
        type={visible ? "text" : "password"}
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        placeholder="至少 8 位，包含大小写字母与数字"
        autoComplete="new-password"
        aria-describedby="password-strength"
        startContent={<LockIcon />}
        endContent={
          <button
            type="button"
            onClick={() => setVisible((current) => !current)}
            className="hover:bg-muted hover:text-foreground rounded p-1 transition-colors"
            aria-label={visible ? "隐藏密码" : "显示密码"}
            aria-pressed={visible}
          >
            {visible ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        }
      />
      <div id="password-strength" className="grid gap-1.5" aria-live="polite">
        <div className="grid grid-cols-4 gap-1" aria-hidden="true">
          {Array.from({ length: 4 }, (_, index) => (
            <span key={index} className="bg-muted h-1 overflow-hidden rounded-full">
              <span
                className={cn(
                  "block h-full origin-left rounded-full transition-[scale,background-color] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
                  level.tone,
                  index < score ? "scale-x-100" : "scale-x-0"
                )}
              />
            </span>
          ))}
        </div>
        <span className="text-muted-foreground text-xs">
          {password ? (
            <>
              密码强度：<span className={cn("font-medium", level.text)}>{level.label}</span>
            </>
          ) : (
            "建议混合使用字母、数字与符号"
          )}
        </span>
      </div>
    </div>
  )
}
