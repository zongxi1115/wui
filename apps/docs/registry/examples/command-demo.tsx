"use client"

import * as React from "react"
import {
  BellIcon,
  FilePlus2Icon,
  GitPullRequestIcon,
  SettingsIcon,
  UserPlusIcon,
} from "lucide-react"

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/registry/ui/command"

const actions = [
  { value: "新建文档", keywords: ["new", "doc", "xjwd"], icon: FilePlus2Icon, shortcut: "⌘N" },
  { value: "发起合并请求", keywords: ["pr", "merge", "fqhbqq"], icon: GitPullRequestIcon, shortcut: "⌘⇧P" },
  { value: "邀请成员", keywords: ["invite", "member", "yqcy"], icon: UserPlusIcon },
]

const settings = [
  { value: "通知偏好", keywords: ["notification", "tzph"], icon: BellIcon },
  { value: "工作区设置", keywords: ["setting", "workspace", "gzqsz"], icon: SettingsIcon, shortcut: "⌘," },
]

export default function CommandDemo() {
  const [last, setLast] = React.useState<string | null>(null)

  return (
    <div className="grid w-full max-w-sm gap-3">
      <Command className="rounded-lg border">
        <CommandInput placeholder="搜索操作，支持拼音首字母…" />
        <CommandList>
          <CommandEmpty>没有匹配的操作</CommandEmpty>
          <CommandGroup heading="快捷操作">
            {actions.map(({ icon: Icon, ...action }) => (
              <CommandItem
                key={action.value}
                value={action.value}
                keywords={action.keywords}
                onSelect={setLast}
              >
                <Icon className="text-muted-foreground" />
                {action.value}
                {action.shortcut ? (
                  <CommandShortcut>{action.shortcut}</CommandShortcut>
                ) : null}
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="设置">
            {settings.map(({ icon: Icon, ...item }) => (
              <CommandItem
                key={item.value}
                value={item.value}
                keywords={item.keywords}
                onSelect={setLast}
              >
                <Icon className="text-muted-foreground" />
                {item.value}
                {item.shortcut ? (
                  <CommandShortcut>{item.shortcut}</CommandShortcut>
                ) : null}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
      <p className="text-muted-foreground text-xs">
        {last ? (
          <>
            已执行：<span className="text-foreground font-medium">{last}</span>
          </>
        ) : (
          "使用 ↑ ↓ 移动高亮，回车执行。"
        )}
      </p>
    </div>
  )
}
