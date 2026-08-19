"use client"

import * as React from "react"
import { Cpu } from "lucide-react"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/registry/ui/select"

export default function SelectGroups() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-2">
      <label className="text-sm font-medium text-foreground flex items-center gap-1.5">
        <Cpu className="size-4 text-muted-foreground" />
        <span>计算实例规格族</span>
      </label>
      <Select defaultValue="c7.large">
        <SelectTrigger className="w-full">
          <SelectValue placeholder="选择计算规格" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>通用型 (General Purpose)</SelectLabel>
            <SelectItem value="g7.large">g7.large (2 vCPU / 8 GiB)</SelectItem>
            <SelectItem value="g7.xlarge">g7.xlarge (4 vCPU / 16 GiB)</SelectItem>
            <SelectItem value="g7.2xlarge">g7.2xlarge (8 vCPU / 32 GiB)</SelectItem>
          </SelectGroup>
          <SelectSeparator />
          <SelectGroup>
            <SelectLabel>计算型 (Compute Optimized)</SelectLabel>
            <SelectItem value="c7.large">c7.large (2 vCPU / 4 GiB)</SelectItem>
            <SelectItem value="c7.xlarge">c7.xlarge (4 vCPU / 8 GiB)</SelectItem>
            <SelectItem value="c7.2xlarge">c7.2xlarge (8 vCPU / 16 GiB)</SelectItem>
          </SelectGroup>
          <SelectSeparator />
          <SelectGroup>
            <SelectLabel>内存型 (Memory Optimized)</SelectLabel>
            <SelectItem value="r7.large">r7.large (2 vCPU / 16 GiB)</SelectItem>
            <SelectItem value="r7.xlarge">r7.xlarge (4 vCPU / 32 GiB)</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  )
}
