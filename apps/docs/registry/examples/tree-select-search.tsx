"use client"

import * as React from "react"

import { TreeSelect } from "@/registry/ui/tree-select"

const regions = [
  {
    value: "east",
    label: "华东区域",
    children: [
      { value: "hangzhou", label: "杭州" },
      { value: "shanghai", label: "上海" },
    ],
  },
  {
    value: "south",
    label: "华南区域",
    children: [
      { value: "guangzhou", label: "广州" },
      { value: "shenzhen", label: "深圳" },
    ],
  },
]

const aliases: Record<string, string[]> = {
  east: ["east"],
  hangzhou: ["hangzhou", "hz"],
  shanghai: ["shanghai", "sh"],
  south: ["south"],
  guangzhou: ["guangzhou", "gz"],
  shenzhen: ["shenzhen", "sz"],
}

export default function TreeSelectSearch() {
  const [value, setValue] = React.useState("hangzhou")

  return (
    <TreeSelect
      className="max-w-sm"
      items={regions}
      value={value}
      onValueChange={setValue}
      searchPlaceholder="搜索城市、拼音或首字母"
      filterNode={(query, node) => {
        const normalized = query.toLocaleLowerCase()
        return (
          (typeof node.label === "string" && node.label.includes(query)) ||
          (aliases[node.value] ?? []).some((alias) =>
            alias.includes(normalized)
          )
        )
      }}
    />
  )
}
