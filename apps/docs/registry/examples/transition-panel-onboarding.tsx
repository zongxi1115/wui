"use client"

import * as React from "react"

import { Button } from "@/registry/ui/button"
import { Input } from "@/registry/ui/input"
import { TransitionPanel } from "@/registry/ui/transition-panel"
import { cn } from "@/registry/lib/utils"

const steps = ["创建工作区", "邀请成员", "选择模板"]

const templates = [
  { id: "scrum", name: "敏捷迭代", description: "看板 + 迭代规划 + 燃尽图" },
  { id: "launch", name: "产品发布", description: "里程碑、检查清单与发布说明" },
  { id: "blank", name: "空白项目", description: "从零开始自定义字段与视图" },
]

export default function TransitionPanelOnboarding() {
  const [step, setStep] = React.useState(0)
  const [template, setTemplate] = React.useState("scrum")
  const isLast = step === steps.length - 1

  return (
    <div className="flex w-full max-w-md flex-col gap-5 rounded-lg border p-5">
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>
            第 {step + 1} 步，共 {steps.length} 步
          </span>
          <span className="text-foreground">{steps[step]}</span>
        </div>
        <div className="grid grid-cols-3 gap-1.5">
          {steps.map((label, index) => (
            <span
              key={label}
              className={cn(
                "h-1 rounded-full bg-muted transition-colors duration-300",
                index <= step && "bg-primary"
              )}
            />
          ))}
        </div>
      </div>

      <TransitionPanel activeIndex={step} className="-m-1" panelClassName="p-1">
        {[
          <div key="workspace" className="flex flex-col gap-3">
            <p className="text-sm text-muted-foreground">
              工作区是团队协作的最小单位，名称可随时修改。
            </p>
            <Input placeholder="例如：增长实验室" aria-label="工作区名称" />
          </div>,
          <div key="invite" className="flex flex-col gap-3">
            <p className="text-sm text-muted-foreground">
              输入同事的邮箱，多个邮箱用逗号分隔。也可以稍后在设置中邀请。
            </p>
            <Input placeholder="name@company.com" aria-label="成员邮箱" />
            <p className="text-xs text-muted-foreground">
              受邀成员默认获得「编辑者」角色。
            </p>
          </div>,
          <div key="template" className="flex flex-col gap-2">
            {templates.map((item) => (
              <button
                key={item.id}
                type="button"
                aria-pressed={template === item.id}
                onClick={() => setTemplate(item.id)}
                className="flex flex-col items-start gap-0.5 rounded-md border px-3 py-2 text-left outline-none transition-colors hover:bg-muted/60 focus-visible:ring-2 focus-visible:ring-ring/40 aria-pressed:border-primary"
              >
                <span className="text-sm font-medium">{item.name}</span>
                <span className="text-xs text-muted-foreground">
                  {item.description}
                </span>
              </button>
            ))}
          </div>,
        ]}
      </TransitionPanel>

      <div className="flex justify-between">
        <Button
          variant="ghost"
          size="sm"
          disabled={step === 0}
          onClick={() => setStep((current) => current - 1)}
        >
          上一步
        </Button>
        <Button
          size="sm"
          onClick={() => setStep((current) => (isLast ? 0 : current + 1))}
        >
          {isLast ? "完成并进入工作区" : "下一步"}
        </Button>
      </div>
    </div>
  )
}
