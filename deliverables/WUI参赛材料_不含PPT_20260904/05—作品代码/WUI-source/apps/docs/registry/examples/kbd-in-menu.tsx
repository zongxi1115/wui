"use client"

import * as React from "react"
import { SearchIcon, PlusIcon, Trash2Icon, CopyIcon, SettingsIcon } from "lucide-react"

import { Kbd, KbdGroup } from "@/registry/ui/kbd"

export default function KbdInMenu() {
  return (
    <div className="w-full max-w-sm rounded-xl border bg-popover p-2 text-popover-foreground shadow-md">
      {/* 模拟快捷搜索框 */}
      <div className="mb-2 flex items-center justify-between rounded-md border bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <SearchIcon className="size-3.5" />
          <span>全局搜索命令...</span>
        </div>
        <KbdGroup>
          <Kbd size="sm">⌘</Kbd>
          <Kbd size="sm">K</Kbd>
        </KbdGroup>
      </div>

      {/* 菜单项列表 */}
      <div className="space-y-0.5 text-xs">
        <button
          type="button"
          className="flex w-full items-center justify-between rounded-md px-2.5 py-1.5 hover:bg-accent hover:text-accent-foreground cursor-pointer transition-colors"
        >
          <div className="flex items-center gap-2">
            <PlusIcon className="size-3.5 text-muted-foreground" />
            <span>新建文件</span>
          </div>
          <KbdGroup>
            <Kbd size="sm">⌘</Kbd>
            <Kbd size="sm">N</Kbd>
          </KbdGroup>
        </button>

        <button
          type="button"
          className="flex w-full items-center justify-between rounded-md px-2.5 py-1.5 hover:bg-accent hover:text-accent-foreground cursor-pointer transition-colors"
        >
          <div className="flex items-center gap-2">
            <CopyIcon className="size-3.5 text-muted-foreground" />
            <span>复制路径</span>
          </div>
          <KbdGroup>
            <Kbd size="sm">⌥</Kbd>
            <Kbd size="sm">⌘</Kbd>
            <Kbd size="sm">C</Kbd>
          </KbdGroup>
        </button>

        <button
          type="button"
          className="flex w-full items-center justify-between rounded-md px-2.5 py-1.5 hover:bg-accent hover:text-accent-foreground cursor-pointer transition-colors"
        >
          <div className="flex items-center gap-2">
            <SettingsIcon className="size-3.5 text-muted-foreground" />
            <span>项目偏好设置</span>
          </div>
          <KbdGroup>
            <Kbd size="sm">⌘</Kbd>
            <Kbd size="sm">,</Kbd>
          </KbdGroup>
        </button>

        <div className="my-1 border-t" />

        <button
          type="button"
          className="flex w-full items-center justify-between rounded-md px-2.5 py-1.5 text-destructive hover:bg-destructive/10 cursor-pointer transition-colors"
        >
          <div className="flex items-center gap-2">
            <Trash2Icon className="size-3.5" />
            <span>彻底删除</span>
          </div>
          <KbdGroup>
            <Kbd size="sm">⌘</Kbd>
            <Kbd size="sm">⌫</Kbd>
          </KbdGroup>
        </button>
      </div>
    </div>
  )
}
