"use client"

import * as React from "react"

import { Cascader, type CascaderOption } from "@/registry/ui/cascader"

const options: CascaderOption[] = [
  {
    value: "zhejiang",
    label: "浙江省",
    keywords: ["zhejiang", "zj"],
    children: [
      {
        value: "hangzhou",
        label: "杭州市",
        keywords: ["hangzhou", "hz"],
        children: [
          {
            value: "xihu",
            label: "西湖区",
            keywords: ["xihu", "xh"],
          },
          {
            value: "yuhang",
            label: "余杭区",
            keywords: ["yuhang", "yh"],
          },
        ],
      },
      {
        value: "ningbo",
        label: "宁波市",
        keywords: ["ningbo", "nb"],
        children: [
          {
            value: "haishu",
            label: "海曙区",
            keywords: ["haishu", "hs"],
          },
        ],
      },
    ],
  },
  {
    value: "jiangsu",
    label: "江苏省",
    keywords: ["jiangsu", "js"],
    children: [
      {
        value: "nanjing",
        label: "南京市",
        keywords: ["nanjing", "nj"],
        children: [
          {
            value: "xuanwu",
            label: "玄武区",
            keywords: ["xuanwu", "xw"],
          },
        ],
      },
    ],
  },
]

export default function CascaderSearch() {
  const [value, setValue] = React.useState<string[]>([])

  return (
    <Cascader
      className="max-w-sm"
      options={options}
      value={value}
      onValueChange={setValue}
      searchable
      searchPlaceholder="搜索地区、拼音或首字母"
    />
  )
}
