"use client"

import * as React from "react"
import { FileIcon, SettingsIcon, UserIcon } from "lucide-react"

import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/registry/ui/command"

export default function CommandDemo() {
  const [selected, setSelected] = React.useState("尚未选择命令")

  return (
    <div className="grid w-full max-w-sm gap-3">
      <Command className="rounded-xl border shadow-sm">
        <CommandInput placeholder="搜索命令…" />
        <CommandList>
          <CommandEmpty>没有匹配的命令</CommandEmpty>
          <CommandItem
            value="新建文档"
            keywords={["file", "document"]}
            onSelect={setSelected}
          >
            <FileIcon />
            新建文档
          </CommandItem>
          <CommandItem
            value="成员管理"
            keywords={["user", "member"]}
            onSelect={setSelected}
          >
            <UserIcon />
            成员管理
          </CommandItem>
          <CommandItem
            value="工作区设置"
            keywords={["setting"]}
            onSelect={setSelected}
          >
            <SettingsIcon />
            工作区设置
          </CommandItem>
        </CommandList>
      </Command>
      <p className="text-muted-foreground text-sm">{selected}</p>
    </div>
  )
}
