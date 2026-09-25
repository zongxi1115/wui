"use client"

import * as React from "react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import { DownloadIcon, RotateCcwIcon, Trash2Icon } from "lucide-react"

import { Badge } from "@/registry/ui/badge"
import { Button } from "@/registry/ui/button"
import { Checkbox } from "@/registry/ui/checkbox"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/registry/ui/table"

interface Member {
  id: string
  name: string
  email: string
  role: string
  status: "active" | "invited" | "suspended"
  lastActive: string
}

const members: Member[] = [
  { id: "usr_1", name: "林澈", email: "lin.che@example.com", role: "所有者", status: "active", lastActive: "刚刚" },
  { id: "usr_2", name: "沈言", email: "shen.yan@example.com", role: "管理员", status: "active", lastActive: "15 分钟前" },
  { id: "usr_3", name: "周屿", email: "zhou.yu@example.com", role: "开发人员", status: "active", lastActive: "2 小时前" },
  { id: "usr_4", name: "唐可", email: "tang.ke@example.com", role: "设计主管", status: "invited", lastActive: "3 天前" },
  { id: "usr_5", name: "陆寻", email: "lu.xun@example.com", role: "测试工程师", status: "suspended", lastActive: "2 周前" },
]

const statusMap = {
  active: { label: "活跃", variant: "success" },
  invited: { label: "已邀请", variant: "info" },
  suspended: { label: "已停用", variant: "secondary" },
} as const

const MotionTableRow = motion.create(TableRow)
const ease = [0.22, 1, 0.36, 1] as const

export default function TableSelection() {
  const reduceMotion = useReducedMotion()
  const [rows, setRows] = React.useState(members)
  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(
    () => new Set(["usr_2", "usr_3"])
  )

  const selectedCount = selectedIds.size
  const allSelected = rows.length > 0 && selectedCount === rows.length

  const toggleRow = (id: string, checked: boolean) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (checked) next.add(id)
      else next.delete(id)
      return next
    })
  }

  const removeSelected = () => {
    setRows((current) => current.filter((row) => !selectedIds.has(row.id)))
    setSelectedIds(new Set())
  }

  const swap = reduceMotion
    ? { initial: false, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        initial: { opacity: 0, y: 6 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -6 },
      }

  return (
    <div className="w-full space-y-3">
      <div className="flex h-8 items-center justify-between gap-3">
        <AnimatePresence mode="wait" initial={false}>
          {selectedCount > 0 ? (
            <motion.div
              key="selected"
              {...swap}
              transition={{ duration: 0.18, ease }}
              className="flex w-full items-center justify-between gap-3"
            >
              <span className="text-sm">
                已选择 <span className="font-medium tabular-nums">{selectedCount}</span> 名成员
              </span>
              <div className="flex items-center gap-1.5">
                <Button size="sm" variant="ghost" onClick={() => setSelectedIds(new Set())}>
                  取消选择
                </Button>
                <Button size="sm" variant="outline">
                  <DownloadIcon />
                  导出
                </Button>
                <Button size="sm" variant="destructive" onClick={removeSelected}>
                  <Trash2Icon />
                  移除
                </Button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="idle"
              {...swap}
              transition={{ duration: 0.18, ease }}
              className="flex w-full items-center justify-between gap-3"
            >
              <div className="flex items-baseline gap-2">
                <span className="text-sm font-medium">团队成员</span>
                <span className="text-muted-foreground text-xs">共 {rows.length} 人</span>
              </div>
              {rows.length < members.length ? (
                <Button size="sm" variant="ghost" onClick={() => setRows(members)}>
                  <RotateCcwIcon />
                  恢复示例数据
                </Button>
              ) : null}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="rounded-md border">
        <Table className="min-w-[640px]">
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-12 text-center">
                <Checkbox
                  size="sm"
                  checked={allSelected ? true : selectedCount > 0 ? "indeterminate" : false}
                  onCheckedChange={(checked) =>
                    setSelectedIds(checked === true ? new Set(rows.map((m) => m.id)) : new Set())
                  }
                  aria-label="选择全部成员"
                />
              </TableHead>
              <TableHead>成员</TableHead>
              <TableHead>角色</TableHead>
              <TableHead>状态</TableHead>
              <TableHead className="text-right">最后活跃</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <AnimatePresence initial={false}>
              {rows.map((member) => {
                const selected = selectedIds.has(member.id)
                return (
                  <MotionTableRow
                    key={member.id}
                    layout={reduceMotion ? false : "position"}
                    exit={reduceMotion ? { opacity: 0 } : { opacity: 0, x: -12 }}
                    transition={{ duration: 0.22, ease }}
                    data-state={selected ? "selected" : undefined}
                    onClick={() => toggleRow(member.id, !selected)}
                    className="cursor-pointer"
                  >
                    <TableCell className="text-center" onClick={(event) => event.stopPropagation()}>
                      <Checkbox
                        size="sm"
                        checked={selected}
                        onCheckedChange={(checked) => toggleRow(member.id, checked === true)}
                        aria-label={`选择${member.name}`}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{member.name}</div>
                      <div className="text-muted-foreground text-xs">{member.email}</div>
                    </TableCell>
                    <TableCell>{member.role}</TableCell>
                    <TableCell>
                      <Badge size="sm" variant={statusMap[member.status].variant}>
                        {statusMap[member.status].label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-right text-xs tabular-nums">
                      {member.lastActive}
                    </TableCell>
                  </MotionTableRow>
                )
              })}
            </AnimatePresence>
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
