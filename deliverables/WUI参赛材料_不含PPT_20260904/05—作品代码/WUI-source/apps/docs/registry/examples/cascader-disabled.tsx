"use client"

import * as React from "react"
import { ShieldAlertIcon } from "lucide-react"

import { Cascader, type CascaderOption } from "@/registry/ui/cascader"

const clusterRegions: CascaderOption[] = [
  {
    value: "ap-east",
    label: "亚太东部（中国香港）",
    children: [
      { value: "ap-east-1a", label: "可用区 A（低延迟）" },
      { value: "ap-east-1b", label: "可用区 B（已满载）", disabled: true },
      { value: "ap-east-1c", label: "可用区 C（容灾备用）" },
    ],
  },
  {
    value: "us-west",
    label: "美西集群（俄勒冈）",
    disabled: true,
    children: [
      { value: "us-west-2a", label: "可用区 A" },
      { value: "us-west-2b", label: "可用区 B" },
    ],
  },
  {
    value: "eu-central",
    label: "欧洲中部（法兰克福）",
    children: [
      { value: "eu-central-1a", label: "可用区 A" },
      { value: "eu-central-1b", label: "可用区 B（维护中）", disabled: true },
    ],
  },
]

export default function CascaderDisabled() {
  const [value, setValue] = React.useState<string[]>(["ap-east", "ap-east-1a"])

  return (
    <div className="grid w-full max-w-md gap-5">
      <div className="grid gap-2">
        <label className="text-sm font-medium">禁用部分节点（不可选状态）</label>
        <Cascader
          options={clusterRegions}
          value={value}
          onValueChange={setValue}
          placeholder="选择服务器可用区"
        />
        <p className="text-muted-foreground text-xs">
          美西集群整区禁用，可用区 B 标记维护或满载禁用。
        </p>
      </div>

      <div className="grid gap-2">
        <label className="text-sm font-medium">完全禁用级联控件</label>
        <Cascader
          disabled
          options={clusterRegions}
          value={["ap-east", "ap-east-1c"]}
          placeholder="选择服务器可用区"
        />
        <div className="text-muted-foreground flex items-center gap-1.5 text-xs">
          <ShieldAlertIcon className="size-3.5" />
          <span>当前环境处于只读归档模式，禁止修改节点配置</span>
        </div>
      </div>
    </div>
  )
}
