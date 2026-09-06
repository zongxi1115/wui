"use client"

import * as React from "react"
import { MapPinIcon } from "lucide-react"

import { Cascader, type CascaderOption } from "@/registry/ui/cascader"

const locations: CascaderOption[] = [
  {
    value: "china",
    label: "中国",
    children: [
      {
        value: "zhejiang",
        label: "浙江省",
        children: [
          { value: "hangzhou", label: "杭州市" },
          { value: "ningbo", label: "宁波市" },
          { value: "wenzhou", label: "温州市" },
        ],
      },
      {
        value: "jiangsu",
        label: "江苏省",
        children: [
          { value: "nanjing", label: "南京市" },
          { value: "suzhou", label: "苏州市" },
        ],
      },
    ],
  },
  {
    value: "japan",
    label: "日本",
    children: [
      {
        value: "kanto",
        label: "关东地区",
        children: [
          { value: "tokyo", label: "东京" },
          { value: "yokohama", label: "横滨" },
        ],
      },
      {
        value: "kansai",
        label: "关西地区",
        children: [
          { value: "osaka", label: "大阪" },
          { value: "kyoto", label: "京都" },
        ],
      },
    ],
  },
]

export default function CascaderDemo() {
  const [value, setValue] = React.useState(["china", "zhejiang", "hangzhou"])

  return (
    <div className="grid w-full max-w-md gap-3">
      <div className="flex items-center gap-2.5">
        <span className="bg-accent flex size-8 items-center justify-center rounded-lg">
          <MapPinIcon className="size-4" />
        </span>
        <div>
          <p className="text-sm font-semibold">配送区域</p>
          <p className="text-muted-foreground text-xs">
            请选择国家、省份与城市
          </p>
        </div>
      </div>
      <Cascader
        options={locations}
        value={value}
        onValueChange={setValue}
        placeholder="请选择配送区域"
      />
    </div>
  )
}
