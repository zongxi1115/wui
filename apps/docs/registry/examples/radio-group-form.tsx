"use client"

import * as React from "react"
import { RadioGroup, RadioGroupItem } from "@/registry/ui/radio-group"

export default function RadioGroupForm() {
  const [selectedRole, setSelectedRole] = React.useState<string>("")
  const [error, setError] = React.useState<string | null>(null)
  const [status, setStatus] = React.useState<string | null>(null)

  const roles = [
    { value: "admin", label: "项目管理员", desc: "拥有全部读写权限、成员管理与计费配置权限" },
    { value: "developer", label: "核心研发者", desc: "拥有代码推送、流水线构建及测试环境部署权限" },
    { value: "viewer", label: "只读访客", desc: "仅可查看项目看板、日志及文档，不可修改任何配置" },
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedRole) {
      setError("请选择待分配的成员角色权限")
      return
    }
    setError(null)
    setStatus(`已成功分配角色: ${roles.find((r) => r.value === selectedRole)?.label}`)
    setTimeout(() => setStatus(null), 3000)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md space-y-4 rounded-xl border border-border bg-card p-5 shadow-xs"
    >
      <div className="space-y-1">
        <h4 className="text-sm font-semibold">邀请团队成员</h4>
        <p className="text-xs text-muted-foreground">请为新成员指定工作空间权限级别</p>
      </div>

      <div className="space-y-2">
        <RadioGroup
          value={selectedRole}
          onValueChange={(val) => {
            setSelectedRole(val)
            setError(null)
          }}
          className="gap-2.5"
          aria-invalid={!!error}
        >
          {roles.map((role) => (
            <label
              key={role.value}
              htmlFor={`role-${role.value}`}
              className="flex cursor-pointer items-start gap-3 rounded-lg border border-border p-3 transition-colors hover:bg-muted/40"
            >
              <RadioGroupItem value={role.value} id={`role-${role.value}`} className="mt-0.5" />
              <div className="grid gap-0.5">
                <span className="text-sm font-medium">{role.label}</span>
                <span className="text-xs text-muted-foreground">{role.desc}</span>
              </div>
            </label>
          ))}
        </RadioGroup>

        {error ? (
          <p className="text-xs font-medium text-destructive">{error}</p>
        ) : null}
      </div>

      <div className="pt-2">
        <button
          type="submit"
          className="inline-flex h-9 w-full items-center justify-center rounded-md bg-primary px-4 text-xs font-medium text-primary-foreground shadow-xs transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {status ? status : "确认并发送邀请"}
        </button>
      </div>
    </form>
  )
}
