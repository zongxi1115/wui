"use client"

import * as React from "react"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/registry/ui/select"

export default function SelectSizes() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <span className="text-xs font-medium text-muted-foreground">紧凑尺寸 (sm - 32px)</span>
        <Select defaultValue="monthly">
          <SelectTrigger size="sm" className="w-full">
            <SelectValue placeholder="选择周期" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="daily">按日计费</SelectItem>
            <SelectItem value="monthly">按月订阅</SelectItem>
            <SelectItem value="yearly">年度预付</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1.5">
        <span className="text-xs font-medium text-muted-foreground">默认尺寸 (default - 40px)</span>
        <Select defaultValue="monthly">
          <SelectTrigger size="default" className="w-full">
            <SelectValue placeholder="选择周期" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="daily">按日计费</SelectItem>
            <SelectItem value="monthly">按月订阅</SelectItem>
            <SelectItem value="yearly">年度预付</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1.5">
        <span className="text-xs font-medium text-muted-foreground">大尺寸 (lg - 48px)</span>
        <Select defaultValue="monthly">
          <SelectTrigger size="lg" className="w-full">
            <SelectValue placeholder="选择周期" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="daily">按日计费</SelectItem>
            <SelectItem value="monthly">按月订阅</SelectItem>
            <SelectItem value="yearly">年度预付</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
