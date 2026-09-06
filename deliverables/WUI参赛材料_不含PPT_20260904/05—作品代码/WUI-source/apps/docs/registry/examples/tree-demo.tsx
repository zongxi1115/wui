"use client"

import * as React from "react"
import { FileTextIcon, FolderIcon } from "lucide-react"

import { Tree, type TreeNode } from "@/registry/ui/tree"

const files: TreeNode[] = [
  {
    value: "src",
    label: "src",
    icon: <FolderIcon className="size-4" />,
    children: [
      {
        value: "components",
        label: "components",
        icon: <FolderIcon className="size-4" />,
        children: [
          {
            value: "button",
            label: "button.tsx",
            icon: <FileTextIcon className="size-4" />,
          },
          {
            value: "tree",
            label: "tree.tsx",
            icon: <FileTextIcon className="size-4" />,
          },
        ],
      },
      {
        value: "app",
        label: "app.tsx",
        icon: <FileTextIcon className="size-4" />,
      },
    ],
  },
  {
    value: "readme",
    label: "README.md",
    icon: <FileTextIcon className="size-4" />,
  },
]

export default function TreeDemo() {
  const [value, setValue] = React.useState("tree")

  return (
    <div className="w-full max-w-sm space-y-3">
      <Tree
        items={files}
        value={value}
        defaultExpanded={["src", "components"]}
        onValueChange={setValue}
        aria-label="项目文件"
      />
      <p className="text-muted-foreground text-xs">当前节点：{value}</p>
    </div>
  )
}
