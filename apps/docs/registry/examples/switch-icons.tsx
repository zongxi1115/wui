"use client"

import * as React from "react"
import { BellIcon, BellOffIcon, CheckIcon, MoonIcon, SunIcon, XIcon } from "lucide-react"

import { Switch } from "@/registry/ui/switch"

const rows = [
  {
    id: "switch-theme",
    title: "深色外观",
    description: "跟随夜间工作时段自动切换",
    checkedIcon: <MoonIcon />,
    uncheckedIcon: <SunIcon />,
    defaultChecked: true,
  },
  {
    id: "switch-notify",
    title: "消息提醒",
    description: "新评论与审批结果即时推送",
    checkedIcon: <BellIcon />,
    uncheckedIcon: <BellOffIcon />,
    defaultChecked: false,
  },
  {
    id: "switch-public",
    title: "公开访问",
    description: "拥有链接的任何人都可以查看",
    checkedIcon: <CheckIcon />,
    uncheckedIcon: <XIcon />,
    defaultChecked: false,
  },
]

export default function SwitchIcons() {
  return (
    <div className="grid w-full max-w-sm gap-5">
      {rows.map((row) => (
        <div key={row.id} className="flex items-center justify-between gap-6">
          <label htmlFor={row.id} className="grid cursor-pointer gap-1">
            <span className="text-sm font-medium leading-none">{row.title}</span>
            <span className="text-muted-foreground text-xs">{row.description}</span>
          </label>
          <Switch
            id={row.id}
            size="lg"
            defaultChecked={row.defaultChecked}
            checkedIcon={row.checkedIcon}
            uncheckedIcon={row.uncheckedIcon}
          />
        </div>
      ))}
    </div>
  )
}
