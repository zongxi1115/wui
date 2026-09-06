"use client"

import * as React from "react"
import { Textarea } from "@/registry/ui/textarea"

export default function TextareaForm() {
  const [feedback, setFeedback] = React.useState("")
  const [error, setError] = React.useState<string | null>(null)
  const [submitted, setSubmitted] = React.useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (feedback.trim().length < 15) {
      setError("反馈详情不能少于 15 个字符，请详细描述遇到的问题或建议")
      return
    }
    setError(null)
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      setFeedback("")
    }, 2500)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md space-y-4 rounded-xl border border-border bg-card p-5 shadow-xs"
    >
      <div className="space-y-1">
        <h4 className="text-sm font-semibold text-foreground">提交产品改进建议</h4>
        <p className="text-xs text-muted-foreground">您的反馈将直接送达 WUI 核心设计研发团队</p>
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label htmlFor="user-feedback" className="text-xs font-medium text-muted-foreground">
            建议或问题描述 <span className="text-destructive">*</span>
          </label>
        </div>

        <Textarea
          id="user-feedback"
          value={feedback}
          onChange={(e) => {
            setFeedback(e.target.value)
            if (error) setError(null)
          }}
          rows={5}
          maxLength={300}
          showCount
          resize="vertical"
          aria-invalid={!!error}
          placeholder="请详细描述您在何种场景下遇到了什么困难，或者您希望新增什么功能特性..."
        />

        {error ? (
          <p className="text-[11px] font-medium text-destructive">{error}</p>
        ) : (
          <p className="text-[11px] text-muted-foreground">
            支持使用快捷键 <kbd className="rounded border bg-muted px-1 py-0.5 font-mono text-[10px]">Ctrl</kbd> + <kbd className="rounded border bg-muted px-1 py-0.5 font-mono text-[10px]">Enter</kbd> 快速提交
          </p>
        )}
      </div>

      <div className="pt-1">
        <button
          type="submit"
          disabled={submitted}
          className="inline-flex h-9 w-full items-center justify-center rounded-md bg-primary px-4 text-xs font-medium text-primary-foreground shadow-xs transition-colors hover:bg-primary/90 disabled:opacity-50"
        >
          {submitted ? "感谢您的反馈！已成功提交" : "提交反馈"}
        </button>
      </div>
    </form>
  )
}
