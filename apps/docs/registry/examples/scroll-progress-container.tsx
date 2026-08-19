"use client"

import * as React from "react"
import { CheckCircle2, FileText, Lock } from "lucide-react"

import { Button } from "@/registry/ui/button"
import { ScrollProgress } from "@/registry/ui/scroll-progress"

export default function ScrollProgressContainer() {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const [reachedBottom, setReachedBottom] = React.useState(false)

  const handleScroll = () => {
    if (!containerRef.current) return
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current
    if (scrollHeight - scrollTop - clientHeight < 15) {
      setReachedBottom(true)
    }
  }

  return (
    <div className="flex w-full max-w-lg flex-col rounded-xl border border-border bg-card shadow-xs">
      <div className="flex items-center justify-between border-b border-border p-4">
        <div className="flex items-center gap-2">
          <FileText className="size-4 text-primary" />
          <span className="text-xs font-semibold text-foreground">
            服务条款与隐私政策 (ToS)
          </span>
        </div>
        <span className="text-[11px] text-muted-foreground">请阅读至文末解锁签署</span>
      </div>

      {/* Progress Bar inside Container */}
      <ScrollProgress
        container={containerRef}
        position="inline"
        className="h-1 bg-muted"
        indicatorClassName="bg-primary"
      />

      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="h-44 overflow-y-auto p-4 text-xs leading-relaxed text-muted-foreground space-y-3 [scrollbar-width:thin]"
      >
        <p>
          欢迎使用 WUI 开发者云平台服务。在您开始使用我们的 SDK 与 API 之前，请仔细阅读本协议的所有条款与条件。
        </p>
        <p className="font-semibold text-foreground">1. 授权与使用范围</p>
        <p>
          我们授予您非独占、不可转让、可撤销的全球使用许可，允许您将本系统组件集成至您的商业或开源软件制品中。
        </p>
        <p className="font-semibold text-foreground">2. 遥测与数据隐私</p>
        <p>
          平台严格遵循 GDPR 与 CCPA 隐私合规标准。所有遥测指标均进行硬件级 Enclave 匿名化脱敏处理，绝不收集用户私钥及个人身份信息。
        </p>
        <p className="font-semibold text-foreground">3. 服务等级可用性 (SLA)</p>
        <p>
          企业版订阅用户享有 99.99% 的核心 API 可用性保证。若因我方基础设施故障导致服务中断，将按照服务抵扣标准进行额度补偿。
        </p>
        <p className="text-foreground font-medium pt-2">
          ✓ 您已完整浏览本协议的全部条款。
        </p>
      </div>

      <div className="flex items-center justify-between border-t border-border p-4">
        <div className="flex items-center gap-1.5 text-xs">
          {reachedBottom ? (
            <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
              <CheckCircle2 className="size-3.5" />
              已完成条款通读
            </span>
          ) : (
            <span className="flex items-center gap-1 text-muted-foreground">
              <Lock className="size-3.5" />
              未读完不可提交
            </span>
          )}
        </div>

        <Button
          type="button"
          size="sm"
          disabled={!reachedBottom}
          className="text-xs"
        >
          同意并继续
        </Button>
      </div>
    </div>
  )
}
