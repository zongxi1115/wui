"use client"

import * as React from "react"
import {
  HomeIcon,
  SearchIcon,
  FolderIcon,
  MessageSquareIcon,
  SettingsIcon,
  SparklesIcon,
  TerminalIcon,
} from "lucide-react"
import { Dock, DockItem, DockSeparator } from "@/registry/ui/dock"

export default function DockDemo() {
  return (
    <div className="flex w-full max-w-lg flex-col items-center justify-center p-8">
      <Dock magnification={56} distance={120}>
        <DockItem label="首页 (Home)">
          <HomeIcon className="size-4 text-foreground/80" />
        </DockItem>
        <DockItem label="全局搜索 (Search)">
          <SearchIcon className="size-4 text-foreground/80" />
        </DockItem>
        <DockItem label="项目文件 (Files)">
          <FolderIcon className="size-4 text-foreground/80" />
        </DockItem>
        <DockSeparator />
        <DockItem label="AI 智能助手 (AI Assistant)">
          <SparklesIcon className="size-4 text-primary" />
        </DockItem>
        <DockItem label="终端会话 (Terminal)">
          <TerminalIcon className="size-4 text-foreground/80" />
        </DockItem>
        <DockItem label="实时消息 (Chat)">
          <MessageSquareIcon className="size-4 text-foreground/80" />
        </DockItem>
        <DockSeparator />
        <DockItem label="偏好设置 (Settings)">
          <SettingsIcon className="size-4 text-foreground/80" />
        </DockItem>
      </Dock>
    </div>
  )
}
