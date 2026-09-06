"use client"

import * as React from "react"
import { Building2Icon } from "lucide-react"

import { Cascader, type CascaderOption } from "@/registry/ui/cascader"

const orgStructure: CascaderOption[] = [
  {
    value: "tech",
    label: "技术研发中心",
    children: [
      {
        value: "frontend",
        label: "前端体验架构部",
        children: [
          { value: "core-web", label: "核心 Web 组" },
          { value: "mobile-infra", label: "移动基建组" },
          { value: "design-system", label: "设计系统与工具组" },
        ],
      },
      {
        value: "backend",
        label: "后端平台工程部",
        children: [
          { value: "cloud-native", label: "云原生运行时组" },
          { value: "data-infra", label: "大数据引擎组" },
          { value: "security", label: "安全风控组" },
        ],
      },
      {
        value: "ai-lab",
        label: "人工智能实验室",
        children: [
          { value: "nlp-model", label: "大语言模型组" },
          { value: "vision", label: "多模态视觉组" },
        ],
      },
    ],
  },
  {
    value: "product",
    label: "全球产品部",
    children: [
      {
        value: "growth",
        label: "用户增长与转化",
        children: [
          { value: "onboarding", label: "新客启航组" },
          { value: "retention", label: "活跃留存组" },
        ],
      },
      {
        value: "enterprise",
        label: "企业级 SaaS 产品",
        children: [
          { value: "billing", label: "计费与结算组" },
          { value: "admin-console", label: "企业控制台组" },
        ],
      },
    ],
  },
]

export default function CascaderDepartment() {
  const [value, setValue] = React.useState<string[]>([
    "tech",
    "frontend",
    "design-system",
  ])

  return (
    <div className="grid w-full max-w-md gap-3">
      <div className="flex items-center gap-2">
        <Building2Icon className="text-primary size-4" />
        <span className="text-sm font-medium">归属部门与小组</span>
      </div>
      <Cascader
        options={orgStructure}
        value={value}
        onValueChange={setValue}
        placeholder="请选择组织架构"
        searchable
        searchPlaceholder="搜索部门、小组或关键词"
        separator=" → "
      />
      <p className="text-muted-foreground text-xs">
        当前选定架构：{value.join(" / ") || "未选择"}
      </p>
    </div>
  )
}
