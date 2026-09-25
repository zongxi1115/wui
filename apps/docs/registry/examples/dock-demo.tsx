"use client"

import * as React from "react"
import {
  CalendarIcon,
  FolderIcon,
  HouseIcon,
  MailIcon,
  SearchIcon,
  SettingsIcon,
  SparklesIcon,
} from "lucide-react"

import { Dock, DockItem, DockSeparator } from "@/registry/ui/dock"

const apps = [
  { id: "home", label: "首页", icon: HouseIcon },
  { id: "search", label: "搜索", icon: SearchIcon },
  { id: "files", label: "文件", icon: FolderIcon },
  { id: "mail", label: "邮件", icon: MailIcon },
  { id: "calendar", label: "日程", icon: CalendarIcon },
]

export default function DockDemo() {
  const [active, setActive] = React.useState("home")

  return (
    <div className="flex h-40 w-full items-end justify-center">
      <Dock magnification={60} distance={140}>
        {apps.map(({ id, label, icon: Icon }) => (
          <DockItem
            key={id}
            label={label}
            active={active === id}
            onClick={() => setActive(id)}
          >
            <Icon />
          </DockItem>
        ))}
        <DockSeparator />
        <DockItem label="AI 助手" onClick={() => setActive("ai")} active={active === "ai"}>
          <SparklesIcon />
        </DockItem>
        <DockItem label="设置" onClick={() => setActive("settings")} active={active === "settings"}>
          <SettingsIcon />
        </DockItem>
      </Dock>
    </div>
  )
}
