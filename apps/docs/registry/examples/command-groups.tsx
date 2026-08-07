"use client"

import {
  CalculatorIcon,
  CalendarIcon,
  SearchIcon,
  UserIcon,
} from "lucide-react"

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/registry/ui/command"

export default function CommandGroups() {
  return (
    <Command className="w-full max-w-sm rounded-xl border shadow-sm">
      <CommandInput placeholder="输入名称、拼音或功能…" />
      <CommandList>
        <CommandEmpty>没有找到结果</CommandEmpty>
        <CommandGroup heading="建议">
          <CommandItem value="搜索文档" keywords={["search", "sswd"]}>
            <SearchIcon />
            搜索文档
          </CommandItem>
          <CommandItem value="日程安排" keywords={["calendar", "rcap"]}>
            <CalendarIcon />
            日程安排
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="工具">
          <CommandItem value="计算器" keywords={["calculator", "jsq"]}>
            <CalculatorIcon />
            计算器
          </CommandItem>
          <CommandItem value="邀请成员" keywords={["member", "yqcy"]} disabled>
            <UserIcon />
            邀请成员（无权限）
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  )
}
