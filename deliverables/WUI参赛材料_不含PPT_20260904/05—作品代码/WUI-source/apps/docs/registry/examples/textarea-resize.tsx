"use client"

import { Textarea } from "@/registry/ui/textarea"

export default function TextareaResize() {
  return (
    <div className="grid w-full max-w-2xl gap-5 sm:grid-cols-2">
      <div className="space-y-2">
        <label htmlFor="fixed-feedback" className="text-xs font-medium text-muted-foreground">
          禁止缩放 (resize="none")
        </label>
        <Textarea
          id="fixed-feedback"
          resize="none"
          rows={4}
          placeholder="该输入区域尺寸固定，适合紧凑弹窗与排版严格的表单。"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="vertical-feedback" className="text-xs font-medium text-muted-foreground">
          仅垂直缩放 (resize="vertical")
        </label>
        <Textarea
          id="vertical-feedback"
          resize="vertical"
          rows={4}
          className="min-h-24 max-h-48"
          placeholder="用户可根据内容多少自由上下拉伸，但不会破坏横向容器布局。"
        />
      </div>
    </div>
  )
}
