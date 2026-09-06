"use client"

import {
  BotIcon,
  CopyIcon,
  SparklesIcon,
  ThumbsDownIcon,
  ThumbsUpIcon,
  UserIcon,
} from "lucide-react"

import {
  Bubble,
  BubbleActions,
  BubbleAvatar,
  BubbleBody,
  BubbleContent,
  BubbleFooter,
  BubbleHeader,
} from "@/registry/ui/bubble"
import { Badge } from "@/registry/ui/badge"
import { Button } from "@/registry/ui/button"

export default function BubbleAiChat() {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
      {/* 用户消息 */}
      <Bubble side="end">
        <BubbleAvatar>
          <div className="flex size-8 items-center justify-center rounded-full bg-muted text-foreground">
            <UserIcon className="size-4" />
          </div>
        </BubbleAvatar>
        <BubbleBody>
          <BubbleHeader>
            <span className="font-semibold text-foreground">Alex</span>
            <time>14:30</time>
          </BubbleHeader>
          <BubbleContent variant="primary">
            如何在 Next.js 15 中正确编写带过渡动画的侧抽屉组件？
          </BubbleContent>
          <BubbleFooter>
            <span>已发送</span>
          </BubbleFooter>
        </BubbleBody>
      </Bubble>

      {/* AI 回复消息 */}
      <Bubble side="start">
        <BubbleAvatar>
          <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary">
            <BotIcon className="size-4" />
          </div>
        </BubbleAvatar>
        <BubbleBody>
          <BubbleHeader className="gap-2">
            <span className="font-semibold text-foreground">Vibe AI Assistant</span>
            <Badge variant="secondary" className="h-5 text-[10px] gap-1 px-1.5">
              <SparklesIcon className="size-3 text-primary" />
              Claude 3.5 Sonnet
            </Badge>
            <time>14:31</time>
          </BubbleHeader>
          <BubbleContent variant="outline" className="space-y-3 bg-card">
            <p>
              在 Next.js 15 中，推荐结合 <strong>Radix UI Dialog</strong> 与 <strong>Motion</strong> 实现兼顾无障碍与平滑物理弹簧动效的组件：
            </p>
            <div className="rounded-lg border bg-muted/60 p-3 font-mono text-xs text-foreground overflow-x-auto">
              <code>{`// components/ui/sheet.tsx
<AnimatePresence>
  {open && (
    <MotionContent
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "spring", stiffness: 360, damping: 38 }}
    />
  )}
</AnimatePresence>`}</code>
            </div>
            <p className="text-xs text-muted-foreground">
              别忘了通过 <code>useReducedMotion()</code> 钩子处理用户的减弱动态效果偏好。
            </p>
          </BubbleContent>
          <BubbleFooter className="justify-between">
            <span className="text-[11px] text-muted-foreground">
              耗时 1.2s · 消耗 142 Tokens
            </span>
            <BubbleActions>
              <Button variant="ghost" size="icon" className="size-7" aria-label="点赞">
                <ThumbsUpIcon className="size-3.5" />
              </Button>
              <Button variant="ghost" size="icon" className="size-7" aria-label="点踩">
                <ThumbsDownIcon className="size-3.5" />
              </Button>
              <Button variant="ghost" size="icon" className="size-7" aria-label="复制代码">
                <CopyIcon className="size-3.5" />
              </Button>
            </BubbleActions>
          </BubbleFooter>
        </BubbleBody>
      </Bubble>
    </div>
  )
}
