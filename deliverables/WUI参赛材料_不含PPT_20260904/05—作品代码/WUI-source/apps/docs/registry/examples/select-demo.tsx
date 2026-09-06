"use client"

import * as React from "react"
import { Globe2Icon } from "lucide-react"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/registry/ui/select"

export default function SelectDemo() {
  const [region, setRegion] = React.useState("ap-shanghai")

  return (
    <div className="flex w-full max-w-sm flex-col gap-2">
      <label htmlFor="region-select" className="text-sm font-medium text-foreground flex items-center gap-1.5">
        <Globe2Icon className="size-4 text-muted-foreground" />
        <span>服务部署区域</span>
      </label>
      <Select value={region} onValueChange={setRegion}>
        <SelectTrigger id="region-select" className="w-full">
          <SelectValue placeholder="请选择就近的数据中心" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>中国大陆</SelectLabel>
            <SelectItem value="cn-hangzhou">华东 1 (杭州)</SelectItem>
            <SelectItem value="ap-shanghai">华东 2 (上海)</SelectItem>
            <SelectItem value="cn-beijing">华北 2 (北京)</SelectItem>
            <SelectItem value="cn-shenzhen">华南 1 (深圳)</SelectItem>
          </SelectGroup>
          <SelectGroup>
            <SelectLabel>亚太地区</SelectLabel>
            <SelectItem value="ap-hongkong">中国香港</SelectItem>
            <SelectItem value="ap-singapore">新加坡</SelectItem>
            <SelectItem value="ap-tokyo">日本 (东京)</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      <p className="text-xs text-muted-foreground">
        当前选定节点: <span className="font-mono font-medium text-foreground">{region}</span>
      </p>
    </div>
  )
}
