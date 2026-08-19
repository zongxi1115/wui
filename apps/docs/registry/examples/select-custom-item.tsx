"use client"

import * as React from "react"
import { Shield, ShieldAlert, ShieldCheck, User } from "lucide-react"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/registry/ui/select"

export default function SelectCustomItem() {
  const [role, setRole] = React.useState("maintainer")

  return (
    <div className="flex w-full max-w-sm flex-col gap-2">
      <label className="text-sm font-medium text-foreground">
        团队成员权限角色
      </label>
      <Select value={role} onValueChange={setRole}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="分配权限角色" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="owner">
            <div className="flex items-center gap-2.5">
              <ShieldAlert className="size-4 text-red-500 shrink-0" />
              <div className="flex flex-col text-left">
                <span className="font-medium text-foreground">所有者 (Owner)</span>
                <span className="text-xs text-muted-foreground">拥有空间全部管理权限与财务控制权</span>
              </div>
            </div>
          </SelectItem>
          <SelectItem value="maintainer">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="size-4 text-emerald-500 shrink-0" />
              <div className="flex flex-col text-left">
                <span className="font-medium text-foreground">维护者 (Maintainer)</span>
                <span className="text-xs text-muted-foreground">可管理仓库设置、成员与流水线部署</span>
              </div>
            </div>
          </SelectItem>
          <SelectItem value="developer">
            <div className="flex items-center gap-2.5">
              <Shield className="size-4 text-blue-500 shrink-0" />
              <div className="flex flex-col text-left">
                <span className="font-medium text-foreground">开发者 (Developer)</span>
                <span className="text-xs text-muted-foreground">拥有代码推送与合并请求审批权限</span>
              </div>
            </div>
          </SelectItem>
          <SelectItem value="reporter">
            <div className="flex items-center gap-2.5">
              <User className="size-4 text-muted-foreground shrink-0" />
              <div className="flex flex-col text-left">
                <span className="font-medium text-foreground">只读访客 (Reporter)</span>
                <span className="text-xs text-muted-foreground">仅具备浏览代码与提交 Issue 权限</span>
              </div>
            </div>
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
