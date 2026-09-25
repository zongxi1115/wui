"use client"

import * as React from "react"
import {
  CheckIcon,
  CopyIcon,
  RotateCcwIcon,
  SparklesIcon,
  ThumbsDownIcon,
  ThumbsUpIcon,
} from "lucide-react"

import { cn } from "@/registry/lib/utils"
import { Avatar, AvatarFallback } from "@/registry/ui/avatar"
import {
  Bubble,
  BubbleActions,
  BubbleAvatar,
  BubbleBody,
  BubbleContent,
  BubbleFooter,
  BubbleHeader,
} from "@/registry/ui/bubble"
import { Button } from "@/registry/ui/button"
import { Markdown } from "@/registry/ui/markdown"

const answer = `可以用 \`AnimatePresence\` 包住抽屉内容，让它在卸载前播放退出动画：

\`\`\`tsx
<AnimatePresence>
  {open && (
    <motion.aside
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
    />
  )}
</AnimatePresence>
\`\`\`

记得用 \`useReducedMotion()\` 为减弱动态效果的用户关闭位移。`

export default function BubbleAiChat() {
  const [feedback, setFeedback] = React.useState<"up" | "down" | null>(null)
  const [copied, setCopied] = React.useState(false)
  const timer = React.useRef<number | undefined>(undefined)

  React.useEffect(() => () => window.clearTimeout(timer.current), [])

  function copyAnswer() {
    void navigator.clipboard.writeText(answer).then(() => {
      setCopied(true)
      window.clearTimeout(timer.current)
      timer.current = window.setTimeout(() => setCopied(false), 1600)
    })
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
      <Bubble side="end">
        <BubbleBody>
          <BubbleContent variant="primary">
            侧边抽屉关闭时直接消失了，怎么加上滑出的退出动画？
          </BubbleContent>
        </BubbleBody>
      </Bubble>

      <Bubble>
        <BubbleAvatar>
          <Avatar size="sm">
            <AvatarFallback className="bg-primary/10 text-primary">
              <SparklesIcon className="size-4" />
            </AvatarFallback>
          </Avatar>
        </BubbleAvatar>
        <BubbleBody className="max-w-[calc(100%-2.625rem)] flex-1">
          <BubbleHeader>
            <span className="text-foreground font-medium">助手</span>
            <span>已思考 4 秒</span>
          </BubbleHeader>
          <BubbleContent variant="ghost" className="px-1">
            <Markdown>{answer}</Markdown>
          </BubbleContent>
          <BubbleFooter>
            <BubbleActions>
              <Button
                variant="ghost"
                size="icon"
                className="size-7"
                aria-label={copied ? "已复制" : "复制回答"}
                onClick={copyAnswer}
              >
                {copied ? <CheckIcon className="text-success" /> : <CopyIcon />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="size-7"
                aria-label="重新生成"
              >
                <RotateCcwIcon />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className={cn("size-7", feedback === "up" && "text-foreground")}
                aria-label="有帮助"
                aria-pressed={feedback === "up"}
                onClick={() => setFeedback(feedback === "up" ? null : "up")}
              >
                <ThumbsUpIcon
                  className={cn(feedback === "up" && "fill-current")}
                />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "size-7",
                  feedback === "down" && "text-foreground"
                )}
                aria-label="没有帮助"
                aria-pressed={feedback === "down"}
                onClick={() => setFeedback(feedback === "down" ? null : "down")}
              >
                <ThumbsDownIcon
                  className={cn(feedback === "down" && "fill-current")}
                />
              </Button>
            </BubbleActions>
            <span className="tabular-nums">1.2s · 142 tokens</span>
          </BubbleFooter>
        </BubbleBody>
      </Bubble>
    </div>
  )
}
