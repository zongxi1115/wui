"use client"

import * as React from "react"
import { EyeIcon, ShieldCheckIcon, ShieldIcon, UserCogIcon } from "lucide-react"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/registry/ui/select"

const roles = [
  {
    value: "owner",
    label: "所有者",
    description: "管理成员、账单与空间删除",
    icon: ShieldCheckIcon,
  },
  {
    value: "maintainer",
    label: "维护者",
    description: "管理仓库设置、成员与流水线",
    icon: UserCogIcon,
  },
  {
    value: "developer",
    label: "开发者",
    description: "推送代码并发起合并请求",
    icon: ShieldIcon,
  },
  {
    value: "reporter",
    label: "访客",
    description: "只读浏览代码与提交 Issue",
    icon: EyeIcon,
  },
]

export default function SelectCustomItem() {
  const [role, setRole] = React.useState("maintainer")

  return (
    <div className="flex w-full max-w-sm flex-col gap-2">
      <label htmlFor="member-role" className="text-sm font-medium">
        成员角色
      </label>
      <Select value={role} onValueChange={setRole}>
        <SelectTrigger id="member-role" className="w-full">
          <SelectValue placeholder="分配角色" />
        </SelectTrigger>
        <SelectContent>
          {roles.map(({ icon: Icon, ...item }) => (
            <SelectItem
              key={item.value}
              value={item.value}
              description={item.description}
            >
              <span className="flex items-center gap-2">
                <Icon className="text-muted-foreground size-4 shrink-0" />
                {item.label}
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <p className="text-muted-foreground text-xs">
        说明文字只在下拉面板中展示，触发器保持单行。
      </p>
    </div>
  )
}
