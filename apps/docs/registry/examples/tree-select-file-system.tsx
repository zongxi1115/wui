"use client"

import * as React from "react"
import { FolderIcon, FileCodeIcon, FileTextIcon, ImageIcon } from "lucide-react"

import { TreeSelect } from "@/registry/ui/tree-select"
import { type TreeNode } from "@/registry/ui/tree"

const projectFiles: TreeNode[] = [
  {
    value: "src",
    label: "src",
    icon: <FolderIcon className="size-4 text-amber-500" />,
    children: [
      {
        value: "components",
        label: "components",
        icon: <FolderIcon className="size-4 text-amber-500" />,
        children: [
          {
            value: "button.tsx",
            label: "button.tsx",
            icon: <FileCodeIcon className="size-4 text-blue-500" />,
          },
          {
            value: "dialog.tsx",
            label: "dialog.tsx",
            icon: <FileCodeIcon className="size-4 text-blue-500" />,
          },
        ],
      },
      {
        value: "assets",
        label: "assets",
        icon: <FolderIcon className="size-4 text-amber-500" />,
        children: [
          {
            value: "logo.svg",
            label: "logo.svg",
            icon: <ImageIcon className="size-4 text-emerald-500" />,
          },
        ],
      },
      {
        value: "index.ts",
        label: "index.ts",
        icon: <FileCodeIcon className="size-4 text-blue-500" />,
      },
    ],
  },
  {
    value: "readme.md",
    label: "README.md",
    icon: <FileTextIcon className="size-4 text-muted-foreground" />,
  },
]

export default function TreeSelectFileSystem() {
  const [value, setValue] = React.useState("button.tsx")

  return (
    <div className="grid w-full max-w-sm gap-2">
      <label className="text-sm font-medium">绑定代码源文件</label>
      <TreeSelect
        items={projectFiles}
        value={value}
        onValueChange={setValue}
        placeholder="选择关联文件"
        clearable
        searchPlaceholder="检索代码文件路径..."
      />
      <p className="text-muted-foreground text-xs">
        点击右侧清除按钮可将绑定目标重置为空。
      </p>
    </div>
  )
}
