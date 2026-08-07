"use client"

import * as React from "react"

import { Button } from "@/registry/ui/button"
import { Combobox } from "@/registry/ui/combobox"

const members = [
  { value: "chen", label: "陈晨", keywords: ["chenchen", "cc"] },
  { value: "lin", label: "林晓", keywords: ["linxiao", "lx"] },
  { value: "zhou", label: "周远", keywords: ["zhouyuan", "zy"] },
  { value: "guest", label: "访客账号", disabled: true },
]

export default function ComboboxControlled() {
  const [owner, setOwner] = React.useState("chen")

  return (
    <div className="flex w-full max-w-sm items-center gap-2">
      <Combobox
        options={members}
        value={owner}
        onValueChange={setOwner}
        placeholder="选择负责人"
        searchPlaceholder="搜索姓名或拼音…"
      />
      <Button variant="outline" onClick={() => setOwner("zhou")}>
        指派给周远
      </Button>
    </div>
  )
}
