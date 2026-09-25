"use client"

import * as React from "react"

import { Button } from "@/registry/ui/button"
import { MultiSelect } from "@/registry/ui/multi-select"

const members = [
  { value: "chen", label: "陈晨", keywords: ["chenchen", "cc", "前端"] },
  { value: "lin", label: "林晓", keywords: ["linxiao", "lx", "前端"] },
  { value: "zhou", label: "周远", keywords: ["zhouyuan", "zy", "后端"] },
  { value: "wang", label: "王涵", keywords: ["wanghan", "wh", "产品"] },
  { value: "xu", label: "许诺", keywords: ["xunuo", "xn", "设计"] },
  { value: "he", label: "何川（休假中）", keywords: ["hechuan", "hc"], disabled: true },
]

const codeOwners = ["chen", "zhou", "xu"]

export default function MultiSelectReviewers() {
  const [reviewers, setReviewers] = React.useState(["lin"])
  const missing = codeOwners.filter((owner) => !reviewers.includes(owner))

  return (
    <div className="grid w-full max-w-sm gap-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">评审人</label>
        <Button
          type="button"
          variant="link"
          size="sm"
          className="h-auto px-0 text-xs"
          disabled={!missing.length}
          onClick={() => setReviewers([...reviewers, ...missing])}
        >
          添加 Code Owners
        </Button>
      </div>
      <MultiSelect
        options={members}
        value={reviewers}
        onValueChange={setReviewers}
        placeholder="选择评审人"
        searchPlaceholder="输入姓名、拼音或职能"
        emptyText="没有找到成员"
      />
      <p className="text-muted-foreground text-xs">
        {reviewers.length >= 2
          ? `已指派 ${reviewers.length} 位评审人，满足合并要求。`
          : `至少需要 2 位评审人，还差 ${2 - reviewers.length} 位。`}
      </p>
    </div>
  )
}
