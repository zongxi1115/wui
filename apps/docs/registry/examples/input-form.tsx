"use client"

import * as React from "react"
import { UserIcon, MailIcon, KeyRoundIcon, ArrowRightIcon } from "lucide-react"
import { Input } from "@/registry/ui/input"

export default function InputForm() {
  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    inviteCode: "",
  })
  const [errors, setErrors] = React.useState<Record<string, string>>({})
  const [loading, setLoading] = React.useState(false)
  const [success, setSuccess] = React.useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "用户名不能为空"
    }
    if (!formData.email.trim() || !formData.email.includes("@")) {
      newErrors.email = "请输入有效的电子邮箱"
    }
    if (!formData.inviteCode.trim()) {
      newErrors.inviteCode = "请输入内测邀请码"
    }

    setErrors(newErrors)

    if (Object.keys(newErrors).length === 0) {
      setLoading(true)
      setTimeout(() => {
        setLoading(false)
        setSuccess(true)
      }, 1000)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md space-y-4 rounded-xl border border-border bg-card p-5 shadow-xs"
    >
      <div className="space-y-1">
        <h4 className="text-sm font-semibold text-foreground">申请加入开发者预览计划</h4>
        <p className="text-xs text-muted-foreground">填写基本信息以获取抢先体验资格</p>
      </div>

      <div className="space-y-3.5">
        <div className="space-y-1">
          <label htmlFor="form-username" className="text-xs font-medium text-muted-foreground">
            用户名 / 开发者昵称 <span className="text-destructive">*</span>
          </label>
          <Input
            id="form-username"
            placeholder="例如: alex_dev"
            value={formData.name}
            onChange={(e) => {
              setFormData({ ...formData, name: e.target.value })
              if (errors.name) setErrors({ ...errors, name: "" })
            }}
            aria-invalid={!!errors.name}
            startContent={<UserIcon className="size-4" />}
          />
          {errors.name ? (
            <p className="text-[11px] font-medium text-destructive">{errors.name}</p>
          ) : null}
        </div>

        <div className="space-y-1">
          <label htmlFor="form-email" className="text-xs font-medium text-muted-foreground">
            工作邮箱 <span className="text-destructive">*</span>
          </label>
          <Input
            id="form-email"
            type="email"
            placeholder="alex@company.com"
            value={formData.email}
            onChange={(e) => {
              setFormData({ ...formData, email: e.target.value })
              if (errors.email) setErrors({ ...errors, email: "" })
            }}
            aria-invalid={!!errors.email}
            startContent={<MailIcon className="size-4" />}
          />
          {errors.email ? (
            <p className="text-[11px] font-medium text-destructive">{errors.email}</p>
          ) : null}
        </div>

        <div className="space-y-1">
          <label htmlFor="form-code" className="text-xs font-medium text-muted-foreground">
            专属邀请码 <span className="text-destructive">*</span>
          </label>
          <Input
            id="form-code"
            placeholder="WUI-PRO-XXXX"
            value={formData.inviteCode}
            onChange={(e) => {
              setFormData({ ...formData, inviteCode: e.target.value.toUpperCase() })
              if (errors.inviteCode) setErrors({ ...errors, inviteCode: "" })
            }}
            aria-invalid={!!errors.inviteCode}
            startContent={<KeyRoundIcon className="size-4" />}
          />
          {errors.inviteCode ? (
            <p className="text-[11px] font-medium text-destructive">{errors.inviteCode}</p>
          ) : null}
        </div>
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={loading || success}
          className="inline-flex h-9 w-full items-center justify-center gap-2 rounded-md bg-primary px-4 text-xs font-medium text-primary-foreground shadow-xs transition-colors hover:bg-primary/90 disabled:opacity-50"
        >
          {loading ? "正在验证..." : success ? "申请成功！请查收邮件" : "提交申请"}
          {!loading && !success ? <ArrowRightIcon className="size-3.5" /> : null}
        </button>
      </div>
    </form>
  )
}
