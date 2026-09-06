"use client"

import * as React from "react"
import { TreeSelect } from "@/registry/ui/tree-select"
import { type TreeNode } from "@/registry/ui/tree"

const permissionTree: TreeNode[] = [
  {
    value: "admin",
    label: "超级管理员角色（锁定）",
    disabled: true,
    children: [
      { value: "root", label: "Root 超级用户", disabled: true },
      { value: "sec-auditor", label: "安全合规审计员", disabled: true },
    ],
  },
  {
    value: "editor-group",
    label: "内容运营组",
    children: [
      { value: "editor-lead", label: "主编（拥有发布权）" },
      { value: "editor-intern", label: "实习编辑（草稿权）" },
    ],
  },
]

export default function TreeSelectDisabled() {
  const [value, setValue] = React.useState("editor-lead")

  return (
    <div className="grid w-full max-w-sm gap-5">
      <div className="grid gap-2">
        <label className="text-sm font-medium">禁用指定树节点</label>
        <TreeSelect
          items={permissionTree}
          value={value}
          onValueChange={setValue}
          placeholder="选择角色权限"
          clearable={false}
        />
        <p className="text-muted-foreground text-xs">
          超级管理员分支节点被设为 `disabled: true`，不可被选择。
        </p>
      </div>

      <div className="grid gap-2">
        <label className="text-sm font-medium">完全禁用组件</label>
        <TreeSelect
          disabled
          items={permissionTree}
          value="editor-lead"
          placeholder="选择角色权限"
        />
      </div>
    </div>
  )
}
