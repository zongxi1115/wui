"use client"

import * as React from "react"
import { Building2Icon, Users2Icon, BriefcaseIcon, ShieldCheckIcon } from "lucide-react"

import { TreeSelect } from "@/registry/ui/tree-select"
import { type TreeNode } from "@/registry/ui/tree"

const departmentTree: TreeNode[] = [
  {
    value: "corp",
    label: "总经办与战略委员会",
    icon: <Building2Icon className="size-4 text-primary" />,
    children: [
      {
        value: "ceo-office",
        label: "CEO 办公室",
        icon: <ShieldCheckIcon className="size-4 text-muted-foreground" />,
      },
      {
        value: "strategy",
        label: "战略投资部",
        icon: <BriefcaseIcon className="size-4 text-muted-foreground" />,
      },
    ],
  },
  {
    value: "r-and-d",
    label: "研发与数字化中心",
    icon: <Users2Icon className="size-4 text-primary" />,
    children: [
      {
        value: "frontend-arch",
        label: "体验技术部（Web/App）",
        icon: <BriefcaseIcon className="size-4 text-muted-foreground" />,
      },
      {
        value: "backend-platform",
        label: "微服务基础设施部",
        icon: <BriefcaseIcon className="size-4 text-muted-foreground" />,
      },
      {
        value: "data-ai",
        label: "算法与智能数据部",
        icon: <BriefcaseIcon className="size-4 text-muted-foreground" />,
      },
    ],
  },
]

export default function TreeSelectDepartment() {
  const [value, setValue] = React.useState("frontend-arch")

  return (
    <div className="grid w-full max-w-sm gap-2">
      <label className="text-sm font-medium">审批指派部门</label>
      <TreeSelect
        items={departmentTree}
        value={value}
        onValueChange={(val) => setValue(val)}
        placeholder="请选择目标部门"
        searchPlaceholder="搜索部门名称或关键字"
      />
      <div className="text-muted-foreground flex items-center justify-between text-xs">
        <span>当前节点标识：</span>
        <code className="bg-muted rounded px-1.5 py-0.5 font-mono">{value || "未选择"}</code>
      </div>
    </div>
  )
}
