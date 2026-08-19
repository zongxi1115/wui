"use client"

import * as React from "react"
import {
  CalculatorIcon,
  CalendarIcon,
  CreditCardIcon,
  FileTextIcon,
  FolderGit2Icon,
  LaptopIcon,
  MoonIcon,
  SunIcon,
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
  CommandShortcut,
} from "@/registry/ui/command"
import { Dialog, DialogContent } from "@/registry/ui/dialog"
import { Button } from "@/registry/ui/button"

export default function CommandPalette() {
  const [open, setOpen] = React.useState(false)
  const [feedback, setFeedback] = React.useState<string | null>(null)

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  const handleSelect = (actionName: string) => {
    setFeedback(`已执行命令：${actionName}`)
    setOpen(false)
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          onClick={() => setOpen(true)}
          className="relative h-10 w-64 justify-start text-xs text-muted-foreground"
        >
          <span>快速唤起命令菜单...</span>
          <kbd className="pointer-events-none absolute right-2 top-2.5 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
            <span className="text-xs">⌘</span>K
          </kbd>
        </Button>
      </div>

      {feedback ? (
        <div className="rounded-md bg-muted px-3 py-1.5 text-xs text-muted-foreground">
          {feedback}
        </div>
      ) : null}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="overflow-hidden p-0 max-w-xl">
          <Command className="[&_[data-slot=command-input-wrapper]]:h-12">
            <CommandInput placeholder="输入指令或搜索全局资源..." />
            <CommandList className="max-h-[340px]">
              <CommandEmpty>未找到相关指令或资源</CommandEmpty>

              <CommandGroup heading="建议操作">
                <CommandItem
                  value="创建新文档"
                  keywords={["create", "doc", "new", "file"]}
                  onSelect={() => handleSelect("创建新文档")}
                >
                  <FileTextIcon />
                  <span>创建新文档</span>
                  <CommandShortcut>⌘N</CommandShortcut>
                </CommandItem>
                <CommandItem
                  value="新建代码仓库"
                  keywords={["git", "repo", "repository", "new"]}
                  onSelect={() => handleSelect("新建代码仓库")}
                >
                  <FolderGit2Icon />
                  <span>新建代码仓库</span>
                  <CommandShortcut>⌥⌘N</CommandShortcut>
                </CommandItem>
                <CommandItem
                  value="邀请团队成员"
                  keywords={["invite", "user", "team", "member"]}
                  onSelect={() => handleSelect("邀请团队成员")}
                >
                  <UserIcon />
                  <span>邀请团队成员</span>
                </CommandItem>
              </CommandGroup>

              <CommandSeparator />

              <CommandGroup heading="常用工具">
                <CommandItem
                  value="日程与会议"
                  keywords={["calendar", "meeting", "schedule"]}
                  onSelect={() => handleSelect("打开日程")}
                >
                  <CalendarIcon />
                  <span>日程与会议</span>
                </CommandItem>
                <CommandItem
                  value="费用中心与发票"
                  keywords={["billing", "invoice", "payment", "card"]}
                  onSelect={() => handleSelect("查看账单")}
                >
                  <CreditCardIcon />
                  <span>费用中心与发票</span>
                  <CommandShortcut>⌘B</CommandShortcut>
                </CommandItem>
                <CommandItem
                  value="计算器"
                  keywords={["calc", "calculator", "math"]}
                  onSelect={() => handleSelect("启动计算器")}
                >
                  <CalculatorIcon />
                  <span>计算器</span>
                </CommandItem>
              </CommandGroup>

              <CommandSeparator />

              <CommandGroup heading="外观设置">
                <CommandItem
                  value="切换浅色模式"
                  keywords={["light", "theme"]}
                  onSelect={() => handleSelect("浅色模式")}
                >
                  <SunIcon />
                  <span>浅色模式 (Light)</span>
                </CommandItem>
                <CommandItem
                  value="切换深色模式"
                  keywords={["dark", "theme"]}
                  onSelect={() => handleSelect("深色模式")}
                >
                  <MoonIcon />
                  <span>深色模式 (Dark)</span>
                </CommandItem>
                <CommandItem
                  value="跟随系统外观"
                  keywords={["system", "theme"]}
                  onSelect={() => handleSelect("系统偏好")}
                >
                  <LaptopIcon />
                  <span>跟随系统偏好</span>
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </DialogContent>
      </Dialog>
    </div>
  )
}
