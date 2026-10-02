"use client"

import * as React from "react"
import { FolderIcon } from "lucide-react"

import { Tree, type TreeNode } from "@/registry/ui/tree"

// Material Icon Theme (MIT): https://github.com/material-extensions/vscode-material-icon-theme
const extensionIcons: Record<string, string> = {
  tsx: "react",
  jsx: "react",
  ts: "typescript",
  js: "javascript",
  css: "css",
  json: "json",
  md: "markdown",
  svg: "image",
  png: "image",
  yaml: "yaml",
  yml: "yaml",
}

interface FileEntry {
  name: string
  children?: FileEntry[]
}

function toTreeNodes(entries: FileEntry[], parent = ""): TreeNode[] {
  return entries.map(({ name, children }) => {
    const value = parent ? `${parent}/${name}` : name
    const extension = name.split(".").at(-1)?.toLowerCase()
    const icon = extension ? extensionIcons[extension] : undefined

    return {
      value,
      label: name,
      icon: children ? (
        <FolderIcon
          aria-hidden="true"
          className="text-muted-foreground size-4"
        />
      ) : icon ? (
        <img
          src={`/wui/tree/${icon}.svg`}
          alt=""
          width={16}
          height={16}
          className="size-4"
        />
      ) : undefined,
      children: children ? toTreeNodes(children, value) : undefined,
    }
  })
}

const files = toTreeNodes([
  {
    name: "src",
    children: [
      {
        name: "components",
        children: [{ name: "file-tree.tsx" }, { name: "search.jsx" }],
      },
      { name: "utils.ts" },
      { name: "index.js" },
      { name: "styles.css" },
    ],
  },
  {
    name: "public",
    children: [{ name: "logo.svg" }, { name: "cover.png" }],
  },
  { name: "package.json" },
  { name: "pnpm-workspace.yaml" },
  { name: "README.md" },
])

export default function TreeFileIcons() {
  const [value, setValue] = React.useState("src/components/file-tree.tsx")

  return (
    <div className="w-full max-w-sm">
      <Tree
        items={files}
        value={value}
        onValueChange={setValue}
        defaultExpanded={["src", "src/components", "public"]}
        aria-label="按文件类型显示图标的项目目录"
      />
      <p className="text-muted-foreground mt-3 border-t pt-3 font-mono text-xs">
        {value}
      </p>
    </div>
  )
}
