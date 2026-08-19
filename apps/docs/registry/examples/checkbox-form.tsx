"use client"

import * as React from "react"
import { Checkbox } from "@/registry/ui/checkbox"

export default function CheckboxForm() {
  const [agreed, setAgreed] = React.useState(false)
  const [newsletter, setNewsletter] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [submitted, setSubmitted] = React.useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!agreed) {
      setError("必须同意服务协议与隐私条款方可继续注册")
      return
    }
    setError(null)
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md space-y-4 rounded-xl border border-border bg-card p-5 shadow-xs"
    >
      <div className="space-y-1">
        <h4 className="text-sm font-semibold">注册账号确认</h4>
        <p className="text-xs text-muted-foreground">请确认并阅读以下协议</p>
      </div>

      <div className="space-y-3">
        <div className="space-y-1.5">
          <label htmlFor="agree-terms" className="flex cursor-pointer items-start gap-2.5">
            <Checkbox
              id="agree-terms"
              checked={agreed}
              onCheckedChange={(val) => {
                setAgreed(val === true)
                if (val === true) setError(null)
              }}
              aria-invalid={!!error}
              className="mt-0.5"
            />
            <span className="text-xs leading-relaxed text-foreground">
              我已年满 18 周岁，并已阅读且同意遵守
              <a href="#" className="mx-1 text-primary underline underline-offset-2">《用户服务协议》</a>
              与
              <a href="#" className="mx-1 text-primary underline underline-offset-2">《隐私权政策》</a>
              <span className="text-destructive">*</span>
            </span>
          </label>
          {error ? (
            <p className="pl-6 text-xs font-medium text-destructive">{error}</p>
          ) : null}
        </div>

        <label htmlFor="subscribe-news" className="flex cursor-pointer items-start gap-2.5">
          <Checkbox
            id="subscribe-news"
            checked={newsletter}
            onCheckedChange={(val) => setNewsletter(val === true)}
            className="mt-0.5"
          />
          <span className="text-xs leading-relaxed text-muted-foreground">
            接收有关产品重大版本发布与开发者沙龙活动的邮件推荐（可选）
          </span>
        </label>
      </div>

      <div className="pt-2">
        <button
          type="submit"
          className="inline-flex h-9 w-full items-center justify-center rounded-md bg-primary px-4 text-xs font-medium text-primary-foreground shadow-xs transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {submitted ? "提交成功！" : "同意并继续"}
        </button>
      </div>
    </form>
  )
}
