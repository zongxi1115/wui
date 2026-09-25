"use client"

import * as React from "react"
import { CheckIcon, GitBranchIcon, GlobeIcon } from "lucide-react"

import { ScrollSequence } from "@/registry/ui/scroll-sequence"

function RepoVisual() {
  return (
    <div className="bg-background w-full max-w-xs rounded-lg border text-sm">
      <div className="text-muted-foreground border-b px-4 py-2.5 text-xs">
        选择仓库
      </div>
      {["acme/web", "acme/docs", "acme/mobile"].map((repo, index) => (
        <div
          key={repo}
          className="flex items-center justify-between border-b px-4 py-2.5 last:border-0"
        >
          <span className="flex items-center gap-2">
            <GitBranchIcon className="text-muted-foreground size-3.5" />
            {repo}
          </span>
          {index === 0 ? (
            <span className="bg-foreground text-background rounded px-1.5 py-0.5 text-[11px]">
              已连接
            </span>
          ) : null}
        </div>
      ))}
    </div>
  )
}

function BuildVisual() {
  const steps = [
    ["安装依赖", "4.2s"],
    ["类型检查", "6.8s"],
    ["构建产物", "12.1s"],
    ["端到端测试", "18.4s"],
  ]
  return (
    <div className="bg-background w-full max-w-xs rounded-lg border p-4 font-mono text-xs">
      {steps.map(([step, time]) => (
        <div key={step} className="flex items-center justify-between py-1.5">
          <span className="text-muted-foreground">{step}</span>
          <span className="flex items-center gap-1">
            <CheckIcon className="size-3" />
            {time}
          </span>
        </div>
      ))}
    </div>
  )
}

function DeployVisual() {
  return (
    <div className="bg-background w-full max-w-xs rounded-lg border p-4 text-sm">
      <div className="flex items-center gap-2">
        <span className="size-2 rounded-full bg-[var(--success)]" />
        <span className="font-medium">生产环境</span>
      </div>
      <p className="text-muted-foreground mt-3 flex items-center gap-2 font-mono text-xs">
        <GlobeIcon className="size-3.5" />
        acme-web.app
      </p>
      <div className="mt-4 grid grid-cols-3 gap-2 border-t pt-3 text-xs">
        {[
          ["区域", "18"],
          ["耗时", "41s"],
          ["回滚", "一键"],
        ].map(([label, value]) => (
          <div key={label}>
            <p className="text-muted-foreground">{label}</p>
            <p className="mt-0.5 font-medium">{value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

const steps = [
  {
    index: "01",
    title: "连接仓库",
    description: "授权后选择仓库，框架、构建命令与环境变量会被自动识别。",
    visual: <RepoVisual />,
  },
  {
    index: "02",
    title: "自动构建",
    description: "每次推送都会触发隔离构建，检查失败时不会影响线上版本。",
    visual: <BuildVisual />,
  },
  {
    index: "03",
    title: "全球发布",
    description: "构建产物分发到边缘节点，出现问题时一键回滚到任意历史版本。",
    visual: <DeployVisual />,
  },
]

export default function ScrollSequenceDemo() {
  const container = React.useRef<HTMLDivElement>(null)

  return (
    <div
      ref={container}
      className="h-[24rem] w-full overflow-y-auto rounded-b-lg"
    >
      <ScrollSequence container={container} stepLength={0.8}>
        {steps.map((step) => (
          <div
            key={step.index}
            className="grid h-full items-center gap-8 px-6 pb-10 sm:grid-cols-2 sm:px-10"
          >
            <div>
              <p className="text-muted-foreground font-mono text-xs">
                {step.index} / 03
              </p>
              <h3 className="mt-3 text-2xl font-semibold tracking-tight">
                {step.title}
              </h3>
              <p className="text-muted-foreground mt-2 max-w-xs text-sm leading-6">
                {step.description}
              </p>
            </div>
            <div className="bg-muted/50 hidden h-56 items-center justify-center rounded-lg sm:flex">
              {step.visual}
            </div>
          </div>
        ))}
      </ScrollSequence>
      <div className="text-muted-foreground flex h-32 items-center justify-center text-sm">
        三步完成首次部署
      </div>
    </div>
  )
}
