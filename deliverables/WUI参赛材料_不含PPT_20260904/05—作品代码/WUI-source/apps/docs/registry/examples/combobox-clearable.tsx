"use client"

import * as React from "react"

import { Combobox } from "@/registry/ui/combobox"

const departments = [
  { value: "eng", label: "研发工程部", keywords: ["engineering", "rd"] },
  { value: "prod", label: "产品体验部", keywords: ["product", "design"] },
  { value: "sales", label: "商业化销售中心", keywords: ["sales", "bd"] },
  { value: "hr", label: "人力行政部", keywords: ["hr", "admin"] },
]

export default function ComboboxClearable() {
  const [dept1, setDept1] = React.useState("eng")
  const [dept2, setDept2] = React.useState("sales")

  return (
    <div className="flex w-full max-w-sm flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-foreground">
          可清空 (clearable=true, 默认)
        </label>
        <Combobox
          options={departments}
          value={dept1}
          onValueChange={setDept1}
          clearable={true}
          placeholder="选择部门（非必选）"
          searchPlaceholder="搜索部门…"
        />
        <p className="text-xs text-muted-foreground">
          支持一键清空选中值，适合非必填过滤项。
        </p>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-foreground">
          禁止清空 (clearable=false)
        </label>
        <Combobox
          options={departments}
          value={dept2}
          onValueChange={setDept2}
          clearable={false}
          placeholder="必须指定归属部门"
          searchPlaceholder="搜索部门…"
          emptyText="未找到相关部门"
        />
        <p className="text-xs text-muted-foreground">
          不显示清空图标，保证必选字段始终有值。
        </p>
      </div>
    </div>
  )
}
