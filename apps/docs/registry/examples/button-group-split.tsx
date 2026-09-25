"use client"

import * as React from "react"
import { ChevronDownIcon, GitMergeIcon } from "lucide-react"

import { Button } from "@/registry/ui/button"
import { ButtonGroup } from "@/registry/ui/button-group"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/registry/ui/dropdown-menu"

const strategies = [
  { value: "merge", label: "创建合并提交", hint: "保留分支上的全部提交记录" },
  { value: "squash", label: "压缩后合并", hint: "将所有提交压缩为一个" },
  { value: "rebase", label: "变基后合并", hint: "逐个重放提交，保持线性历史" },
]

export default function ButtonGroupSplit() {
  const [strategy, setStrategy] = React.useState("merge")
  const current = strategies.find((item) => item.value === strategy)!

  return (
    <ButtonGroup aria-label="合并拉取请求">
      <Button>
        <GitMergeIcon />
        {current.label}
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="icon" aria-label="选择合并策略">
            <ChevronDownIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64">
          <DropdownMenuLabel>合并策略</DropdownMenuLabel>
          <DropdownMenuRadioGroup value={strategy} onValueChange={setStrategy}>
            {strategies.map((item) => (
              <DropdownMenuRadioItem
                key={item.value}
                value={item.value}
                className="items-start"
              >
                <span className="flex flex-col gap-0.5">
                  <span>{item.label}</span>
                  <span className="text-muted-foreground text-xs">
                    {item.hint}
                  </span>
                </span>
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </ButtonGroup>
  )
}
