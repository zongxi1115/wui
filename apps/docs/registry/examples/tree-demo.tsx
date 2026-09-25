"use client"

import * as React from "react"
import {
  FileCode2Icon,
  FileJsonIcon,
  FileTextIcon,
  FolderIcon,
} from "lucide-react"

import { Tree, type TreeNode } from "@/registry/ui/tree"

const folder = <FolderIcon className="text-muted-foreground size-4" />
const code = <FileCode2Icon className="text-muted-foreground size-4" />

const files: TreeNode[] = [
  {
    value: "app",
    label: "app",
    icon: folder,
    children: [
      { value: "app/layout.tsx", label: "layout.tsx", icon: code },
      { value: "app/page.tsx", label: "page.tsx", icon: code },
    ],
  },
  {
    value: "components",
    label: "components",
    icon: folder,
    children: [
      {
        value: "components/ui",
        label: "ui",
        icon: folder,
        children: [
          { value: "components/ui/button.tsx", label: "button.tsx", icon: code },
          { value: "components/ui/tree.tsx", label: "tree.tsx", icon: code },
          { value: "components/ui/tabs.tsx", label: "tabs.tsx", icon: code },
        ],
      },
      { value: "components/site-header.tsx", label: "site-header.tsx", icon: code },
    ],
  },
  {
    value: "package.json",
    label: "package.json",
    icon: <FileJsonIcon className="text-muted-foreground size-4" />,
  },
  {
    value: "README.md",
    label: "README.md",
    icon: <FileTextIcon className="text-muted-foreground size-4" />,
  },
]

export default function TreeDemo() {
  const [value, setValue] = React.useState("components/ui/tree.tsx")

  return (
    <div className="w-full max-w-xs">
      <Tree
        items={files}
        value={value}
        defaultExpanded={["components", "components/ui"]}
        onValueChange={setValue}
        aria-label="项目文件"
      />
      <p className="text-muted-foreground mt-3 border-t pt-3 font-mono text-xs">
        {value}
      </p>
    </div>
  )
}
