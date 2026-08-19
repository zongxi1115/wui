"use client"

import * as React from "react"
import { LayersIcon, SparklesIcon } from "lucide-react"

import { Cascader, type CascaderOption } from "@/registry/ui/cascader"
import { Badge } from "@/registry/ui/badge"

const productCategories: CascaderOption[] = [
  {
    value: "electronics",
    label: "数码 3C",
    children: [
      {
        value: "computers",
        label: "电脑整机",
        children: [
          { value: "laptops", label: "轻薄笔记本" },
          { value: "gaming-laptops", label: "游戏本" },
          { value: "workstations", label: "图形工作站" },
        ],
      },
      {
        value: "peripherals",
        label: "外设配件",
        children: [
          { value: "keyboards", label: "机械键盘" },
          { value: "mice", label: "无线鼠标" },
          { value: "monitors", label: "4K 显示器" },
        ],
      },
    ],
  },
  {
    value: "appliances",
    label: "智能家电",
    children: [
      {
        value: "living-room",
        label: "客厅电器",
        children: [
          { value: "tvs", label: "OLED 电视" },
          { value: "air-purifiers", label: "空气净化器" },
        ],
      },
      {
        value: "kitchen",
        label: "厨房家电",
        children: [
          { value: "coffee-makers", label: "意式咖啡机" },
          { value: "ovens", label: "智能蒸烤箱" },
        ],
      },
    ],
  },
]

export default function CascaderCustomRender() {
  const [value, setValue] = React.useState<string[]>([
    "electronics",
    "computers",
    "gaming-laptops",
  ])

  return (
    <div className="grid w-full max-w-md gap-3">
      <div className="flex items-center gap-2">
        <LayersIcon className="text-primary size-4" />
        <span className="text-sm font-medium">商品品类分类</span>
      </div>
      <Cascader
        options={productCategories}
        value={value}
        onValueChange={setValue}
        placeholder="请选择商品类目"
        renderValue={(selected) => (
          <div className="flex flex-wrap items-center gap-1.5 py-0.5">
            {selected.map((item, index) => (
              <Badge
                key={item.value}
                variant={index === selected.length - 1 ? "default" : "secondary"}
                className="text-xs font-normal"
              >
                {item.label}
              </Badge>
            ))}
          </div>
        )}
      />
      <div className="text-muted-foreground flex items-center gap-1 text-xs">
        <SparklesIcon className="size-3.5" />
        <span>自定义标签渲染与层级路径高亮</span>
      </div>
    </div>
  )
}
