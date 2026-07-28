"use client"

import { CopyIcon, MoreHorizontalIcon, RotateCcwIcon } from "lucide-react"

import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
} from "@/registry/ui/avatar"
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

export default function BubbleDemo() {
  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-6">
      <Bubble>
        <BubbleAvatar>
          <Avatar size="sm">
            <AvatarFallback>林</AvatarFallback>
            <AvatarBadge status="online" size="sm" />
          </Avatar>
        </BubbleAvatar>
        <BubbleBody>
          <BubbleHeader>
            <span className="font-medium text-foreground">林晚</span>
            <time>10:24</time>
          </BubbleHeader>
          <BubbleContent>
            我已经整理好评审意见，交互部分还需要确认一次键盘操作。
          </BubbleContent>
          <BubbleFooter>
            已编辑
            <BubbleActions>
              <Button
                variant="ghost"
                size="icon"
                className="size-7"
                aria-label="复制消息"
              >
                <CopyIcon />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="size-7"
                aria-label="更多操作"
              >
                <MoreHorizontalIcon />
              </Button>
            </BubbleActions>
          </BubbleFooter>
        </BubbleBody>
      </Bubble>

      <Bubble side="end">
        <BubbleAvatar>
          <Avatar size="sm">
            <AvatarFallback className="bg-primary text-primary-foreground">
              我
            </AvatarFallback>
          </Avatar>
        </BubbleAvatar>
        <BubbleBody>
          <BubbleHeader>
            <span className="font-medium text-foreground">你</span>
            <time>10:26</time>
          </BubbleHeader>
          <BubbleContent variant="primary">
            没问题，我会补齐焦点顺序和 Escape 关闭行为。
          </BubbleContent>
          <BubbleFooter>
            已送达
            <BubbleActions>
              <Button
                variant="ghost"
                size="icon"
                className="size-7"
                aria-label="重新发送"
              >
                <RotateCcwIcon />
              </Button>
            </BubbleActions>
          </BubbleFooter>
        </BubbleBody>
      </Bubble>
    </div>
  )
}
