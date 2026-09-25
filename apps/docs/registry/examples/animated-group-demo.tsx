"use client"

import * as React from "react"
import {
  BarChart3Icon,
  CalendarClockIcon,
  FileTextIcon,
  GitBranchIcon,
  MessageSquareIcon,
  RotateCcwIcon,
  WorkflowIcon,
} from "lucide-react"

import {
  AnimatedGroup,
  type AnimatedGroupPreset,
} from "@/registry/ui/animated-group"
import { Button } from "@/registry/ui/button"
import { ToggleGroup, ToggleGroupItem } from "@/registry/ui/toggle-group"

const presets: AnimatedGroupPreset[] = [
  "slide",
  "blur-slide",
  "fade",
  "scale",
  "zoom",
  "flip",
  "bounce",
]

const modules = [
  { icon: FileTextIcon, name: "文档", description: "多人实时协作编辑" },
  { icon: WorkflowIcon, name: "自动化", description: "触发器与审批流" },
  { icon: GitBranchIcon, name: "代码评审", description: "关联需求与提交" },
  { icon: BarChart3Icon, name: "数据看板", description: "指标订阅与告警" },
  { icon: CalendarClockIcon, name: "迭代规划", description: "容量与排期视图" },
  { icon: MessageSquareIcon, name: "讨论区", description: "按主题沉淀决策" },
]

export default function AnimatedGroupDemo() {
  const [preset, setPreset] = React.useState<AnimatedGroupPreset>("slide")
  const [replay, setReplay] = React.useState(0)

  return (
    <div className="flex w-full max-w-xl flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <ToggleGroup
          type="single"
          size="sm"
          value={preset}
          onValueChange={(value) => {
            if (!value) return
            setPreset(value as AnimatedGroupPreset)
            setReplay((current) => current + 1)
          }}
          aria-label="入场预设"
          className="flex-wrap"
        >
          {presets.map((item) => (
            <ToggleGroupItem key={item} value={item} className="font-mono text-xs">
              {item}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setReplay((current) => current + 1)}
        >
          <RotateCcwIcon />
          重播
        </Button>
      </div>

      <AnimatedGroup
        key={replay}
        preset={preset}
        itemClassName="bg-background"
        className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border bg-border sm:grid-cols-3"
      >
        {modules.map((module) => (
          <div key={module.name} className="flex flex-col gap-2 p-4">
            <module.icon className="size-4 text-muted-foreground" />
            <div className="flex flex-col gap-0.5">
              <span className="text-sm font-medium">{module.name}</span>
              <span className="text-xs text-muted-foreground">
                {module.description}
              </span>
            </div>
          </div>
        ))}
      </AnimatedGroup>
    </div>
  )
}
