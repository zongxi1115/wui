"use client"

import * as React from "react"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/registry/ui/select"

export default function SelectDisabled() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-5">
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-muted-foreground">
          企业专属域名（当前套餐不可用）
        </label>
        <Select disabled defaultValue="custom">
          <SelectTrigger className="w-full">
            <SelectValue placeholder="选择域名类型" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="shared">共享二级域名 (.wui.app)</SelectItem>
            <SelectItem value="custom">独立顶级域名 (www.example.com)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-foreground">
          存储服务地域（包含售罄节点）
        </label>
        <Select defaultValue="bj">
          <SelectTrigger className="w-full">
            <SelectValue placeholder="选择存储节点" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="bj">北京机房 (可用区 A)</SelectItem>
            <SelectItem value="sh">上海机房 (可用区 B)</SelectItem>
            <SelectItem value="sz" disabled>
              深圳机房 (资源已售罄)
            </SelectItem>
            <SelectItem value="hk" disabled>
              香港机房 (维护升级中)
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
