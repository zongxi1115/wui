"use client"

import * as React from "react"
import { MessageSquareIcon } from "lucide-react"

import { Button } from "@/registry/ui/button"
import {
  MorphingPopover,
  MorphingPopoverClose,
  MorphingPopoverContent,
  MorphingPopoverTrigger,
} from "@/registry/ui/morphing-popover"
import { Textarea } from "@/registry/ui/textarea"

const moods = ["😞", "😐", "🙂", "😍"]

export default function MorphingPopoverForm() {
  const [feedback, setFeedback] = React.useState("")
  const [mood, setMood] = React.useState<string | null>(null)

  return (
    <MorphingPopover
      onOpenChange={(open) => {
        if (!open) {
          setFeedback("")
          setMood(null)
        }
      }}
    >
      <MorphingPopoverTrigger>
        <MessageSquareIcon className="mr-2 size-4" />
        意见反馈
      </MorphingPopoverTrigger>
      <MorphingPopoverContent className="w-80">
        <p className="text-sm font-medium">这个页面好用吗？</p>
        <p className="text-muted-foreground mt-1 text-xs">
          反馈会直接发送给负责该模块的产品同学。
        </p>

        <div className="mt-3 flex gap-1.5" role="radiogroup" aria-label="满意度">
          {moods.map((item) => (
            <button
              key={item}
              type="button"
              role="radio"
              aria-checked={mood === item}
              onClick={() => setMood(item)}
              className="hover:bg-muted aria-checked:bg-muted aria-checked:border-foreground/20 focus-visible:ring-ring/50 flex size-9 items-center justify-center rounded-md border border-transparent text-lg outline-none transition-colors focus-visible:ring-[3px]"
            >
              {item}
            </button>
          ))}
        </div>

        <Textarea
          rows={3}
          resize="none"
          value={feedback}
          onChange={(event) => setFeedback(event.target.value)}
          placeholder="哪里好用，哪里让你困惑？"
          aria-label="反馈内容"
          className="mt-3"
        />

        <div className="mt-3 flex justify-end gap-2">
          <MorphingPopoverClose asChild>
            <Button variant="ghost" size="sm">
              取消
            </Button>
          </MorphingPopoverClose>
          <MorphingPopoverClose asChild>
            <Button size="sm" disabled={!feedback.trim() && !mood}>
              发送
            </Button>
          </MorphingPopoverClose>
        </div>
      </MorphingPopoverContent>
    </MorphingPopover>
  )
}
