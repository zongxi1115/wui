"use client"

import * as React from "react"
import { CheckIcon } from "lucide-react"

import { Button } from "@/registry/ui/button"
import { ScrollProgress } from "@/registry/ui/scroll-progress"

const clauses = [
  {
    title: "1. 服务内容",
    body: "我们为团队提供文档协作、项目管理与自动化工作流服务。具体功能以你所订阅的版本为准，我们可能在不降低核心能力的前提下调整界面与交互。",
  },
  {
    title: "2. 账号与安全",
    body: "你应妥善保管账号凭证，并对账号下的全部操作负责。发现异常登录时，请立即修改密码并联系我们，我们会协助冻结可疑会话。",
  },
  {
    title: "3. 数据与隐私",
    body: "你上传的内容归你所有。我们仅在提供服务所必需的范围内处理数据，不会将其用于广告投放，也不会出售给任何第三方。",
  },
  {
    title: "4. 费用与退款",
    body: "订阅按周期预付。首次订阅 14 天内可申请全额退款；此后取消订阅将在当前计费周期结束时生效，已付费用不予退还。",
  },
  {
    title: "5. 条款变更",
    body: "条款如有重大调整，我们会提前 30 天通过站内信与邮件通知。你继续使用服务即视为接受更新后的条款。",
  },
]

export default function ScrollProgressContainer() {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const [reachedBottom, setReachedBottom] = React.useState(false)

  function handleScroll() {
    const node = containerRef.current
    if (!node || reachedBottom) return
    if (node.scrollHeight - node.scrollTop - node.clientHeight < 8) {
      setReachedBottom(true)
    }
  }

  return (
    <div className="bg-background w-full max-w-md overflow-hidden rounded-lg border">
      <div className="px-5 pt-5 pb-4">
        <h4 className="font-medium">服务条款</h4>
        <p className="text-muted-foreground mt-1 text-sm">
          请阅读至文末后继续，更新于 2026 年 9 月 1 日。
        </p>
      </div>

      <ScrollProgress
        container={containerRef}
        position="inline"
        className="h-px"
        trackClassName="bg-border"
      />

      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="h-52 space-y-4 overflow-y-auto px-5 py-4"
      >
        {clauses.map((clause) => (
          <section key={clause.title} className="space-y-1">
            <h5 className="text-sm font-medium">{clause.title}</h5>
            <p className="text-muted-foreground text-sm leading-6">
              {clause.body}
            </p>
          </section>
        ))}
      </div>

      <div className="flex items-center justify-between gap-3 border-t px-5 py-3">
        <span className="text-muted-foreground flex items-center gap-1.5 text-xs">
          {reachedBottom ? (
            <>
              <CheckIcon className="text-foreground size-3.5" />
              已阅读全部条款
            </>
          ) : (
            "滚动阅读后可继续"
          )}
        </span>
        <Button size="sm" disabled={!reachedBottom}>
          同意并继续
        </Button>
      </div>
    </div>
  )
}
