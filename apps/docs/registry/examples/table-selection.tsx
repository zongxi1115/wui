"use client"

import * as React from "react"
import { Checkbox } from "@/registry/ui/checkbox"
import { Button } from "@/registry/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/registry/ui/table"
import { DownloadIcon, Trash2Icon } from "lucide-react"

interface Member {
  id: string
  name: string
  email: string
  role: string
  status: "active" | "invited" | "suspended"
  lastActive: string
}

const members: Member[] = [
  {
    id: "usr_1",
    name: "林澈",
    email: "lin.che@example.com",
    role: "所有者",
    status: "active",
    lastActive: "刚刚",
  },
  {
    id: "usr_2",
    name: "沈言",
    email: "shen.yan@example.com",
    role: "管理员",
    status: "active",
    lastActive: "15 分钟前",
  },
  {
    id: "usr_3",
    name: "周屿",
    email: "zhou.yu@example.com",
    role: "开发人员",
    status: "active",
    lastActive: "2 小时前",
  },
  {
    id: "usr_4",
    name: "唐可",
    email: "tang.ke@example.com",
    role: "设计主管",
    status: "invited",
    lastActive: "3 天前",
  },
  {
    id: "usr_5",
    name: "陆寻",
    email: "lu.xun@example.com",
    role: "测试工程师",
    status: "suspended",
    lastActive: "2 周前",
  },
]

const statusMap = {
  active: { label: "活跃", badge: "text-success bg-success/10" },
  invited: { label: "已邀请", badge: "text-info bg-info/10" },
  suspended: { label: "已停用", badge: "text-muted-foreground bg-muted" },
}

export default function TableSelection() {
  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(
    () => new Set(["usr_1"])
  )

  const isAllSelected =
    members.length > 0 && selectedIds.size === members.length
  const isPartiallySelected =
    selectedIds.size > 0 && selectedIds.size < members.length

  const handleSelectAll = (checked: boolean | "indeterminate") => {
    if (checked === true) {
      setSelectedIds(new Set(members.map((m) => m.id)))
    } else {
      setSelectedIds(new Set())
    }
  }

  const handleToggleRow = (id: string, checked: boolean) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (checked) {
        next.add(id)
      } else {
        next.delete(id)
      }
      return next
    })
  }

  return (
    <div className="w-full space-y-3">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">团队成员</span>
          <span className="text-xs text-muted-foreground">
            共 {members.length} 人，已选中 {selectedIds.size} 项
          </span>
        </div>
        {selectedIds.size > 0 && (
          <div className="flex items-center gap-1.5 animate-in fade-in-0 duration-200">
            <Button size="sm" variant="outline">
              <DownloadIcon />
              导出已选
            </Button>
            <Button size="sm" variant="destructive">
              <Trash2Icon />
              批量移除
            </Button>
          </div>
        )}
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12 text-center">
                <Checkbox
                  checked={
                    isAllSelected
                      ? true
                      : isPartiallySelected
                        ? "indeterminate"
                        : false
                  }
                  onCheckedChange={handleSelectAll}
                  aria-label="全选表格所有行"
                />
              </TableHead>
              <TableHead>成员姓名</TableHead>
              <TableHead>电子邮箱</TableHead>
              <TableHead>权限角色</TableHead>
              <TableHead>账号状态</TableHead>
              <TableHead className="text-right">最后活跃</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.map((member) => {
              const isSelected = selectedIds.has(member.id)
              return (
                <TableRow
                  key={member.id}
                  data-state={isSelected ? "selected" : undefined}
                >
                  <TableCell className="text-center">
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={(checked) =>
                        handleToggleRow(member.id, Boolean(checked))
                      }
                      aria-label={`选择成员 ${member.name}`}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{member.name}</TableCell>
                  <TableCell className="text-muted-foreground font-mono text-xs">
                    {member.email}
                  </TableCell>
                  <TableCell>{member.role}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusMap[member.status].badge}`}
                    >
                      {statusMap[member.status].label}
                    </span>
                  </TableCell>
                  <TableCell className="text-right text-xs text-muted-foreground tabular-nums">
                    {member.lastActive}
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
