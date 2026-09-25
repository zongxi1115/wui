"use client"

import * as React from "react"

import { ToggleGroup, ToggleGroupItem } from "@/registry/ui/toggle-group"
import { TransitionPanel } from "@/registry/ui/transition-panel"

const tabs = ["版本说明", "迁移指南", "已知问题"]

export default function TransitionPanelDemo() {
  const [active, setActive] = React.useState(0)

  return (
    <div className="flex w-full max-w-md flex-col gap-4">
      <ToggleGroup
        type="single"
        size="sm"
        value={String(active)}
        onValueChange={(value) => value && setActive(Number(value))}
        aria-label="发布文档"
      >
        {tabs.map((tab, index) => (
          <ToggleGroupItem key={tab} value={String(index)}>
            {tab}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>

      <TransitionPanel activeIndex={active} className="border-t pt-4">
        {[
          <div key="notes" className="flex flex-col gap-2 text-sm">
            <h3 className="font-medium text-foreground">v3.2.0 · 2026 年 9 月</h3>
            <p className="text-muted-foreground">
              新增工作区级别的审计日志，支持按成员、资源与操作类型筛选，并可导出为 CSV。
            </p>
          </div>,
          <div key="migration" className="flex flex-col gap-2 text-sm">
            <h3 className="font-medium text-foreground">从 v3.1 升级</h3>
            <ol className="list-decimal space-y-1 pl-5 text-muted-foreground">
              <li>将 SDK 升级至 3.2.0 或更高版本。</li>
              <li>把 <code className="font-mono text-foreground">auditLog</code> 配置从项目级移动到工作区级。</li>
              <li>重新生成访问令牌，旧令牌将在 30 天后失效。</li>
              <li>在测试环境验证 Webhook 签名后再发布到生产。</li>
            </ol>
          </div>,
          <div key="issues" className="flex flex-col gap-2 text-sm">
            <h3 className="font-medium text-foreground">已知问题</h3>
            <p className="text-muted-foreground">
              Safari 16 中导出超过 10 万行的日志可能超时，建议按时间范围分批导出。
            </p>
          </div>,
        ]}
      </TransitionPanel>
    </div>
  )
}
