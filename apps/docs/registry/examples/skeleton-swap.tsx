"use client"

import * as React from "react"
import { RotateCwIcon } from "lucide-react"

import { Avatar, AvatarFallback } from "@/registry/ui/avatar"
import { Button } from "@/registry/ui/button"
import { Skeleton, SkeletonSwap, SkeletonText } from "@/registry/ui/skeleton"

const comments = [
  {
    name: "林澈",
    time: "10 分钟前",
    body: "筛选面板在窄屏下会折叠成抽屉，交互稿已经同步到 Figma 第 3 页。",
  },
  {
    name: "周以宁",
    time: "32 分钟前",
    body: "接口字段 updated_at 改成了 ISO 格式，前端列表的排序逻辑需要一起调整。",
  },
  {
    name: "陈默",
    time: "1 小时前",
    body: "已补充空状态与加载态的验收用例，今天下班前提测。",
  },
]

function CommentsFallback() {
  return (
    <div className="divide-y">
      {comments.map((comment) => (
        <div key={comment.name} className="flex gap-3 py-3">
          <Skeleton animation="shimmer" shape="circle" className="size-8" />
          <div className="flex-1 space-y-2 pt-1">
            <Skeleton animation="shimmer" shape="text" className="h-3.5 w-24" />
            <SkeletonText animation="shimmer" lines={2} lastLineWidth="64%" />
          </div>
        </div>
      ))}
    </div>
  )
}

export default function SkeletonSwapDemo() {
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    if (!loading) return
    const timer = window.setTimeout(() => setLoading(false), 1600)
    return () => window.clearTimeout(timer)
  }, [loading])

  return (
    <div className="w-full max-w-md">
      <div className="flex items-center justify-between border-b pb-3">
        <p className="text-sm font-medium">评论 · 3</p>
        <Button
          size="sm"
          variant="ghost"
          disabled={loading}
          onClick={() => setLoading(true)}
        >
          <RotateCwIcon />
          重新加载
        </Button>
      </div>

      <SkeletonSwap
        loading={loading}
        fallback={<CommentsFallback />}
        aria-label="评论列表"
      >
        <ul className="divide-y">
          {comments.map((comment) => (
            <li key={comment.name} className="flex gap-3 py-3">
              <Avatar size="sm">
                <AvatarFallback>
                  {comment.name.slice(0, 1)}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline gap-2">
                  <span className="text-sm font-medium">{comment.name}</span>
                  <span className="text-muted-foreground text-xs">
                    {comment.time}
                  </span>
                </div>
                <p className="text-muted-foreground mt-1 text-sm leading-6">
                  {comment.body}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </SkeletonSwap>
    </div>
  )
}
