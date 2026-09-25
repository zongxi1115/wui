"use client"

import * as React from "react"
import { ArrowUpIcon, PaperclipIcon } from "lucide-react"

import { Button } from "@/registry/ui/button"
import { Textarea } from "@/registry/ui/textarea"

export default function TextareaAutosize() {
  const [value, setValue] = React.useState("")

  return (
    <div className="grid w-full max-w-md gap-2">
      <label htmlFor="release-comment" className="text-sm font-medium">
        评论
      </label>
      <Textarea
        id="release-comment"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        autoSize={{ minRows: 1, maxRows: 6 }}
        placeholder="输入评论，换行时高度会平滑增长，超过 6 行后滚动"
      />
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="icon" className="size-8" aria-label="添加附件">
          <PaperclipIcon />
        </Button>
        <Button size="sm" disabled={!value.trim()}>
          <ArrowUpIcon />
          发送
        </Button>
      </div>
    </div>
  )
}
