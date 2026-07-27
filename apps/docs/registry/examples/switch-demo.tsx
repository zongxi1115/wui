"use client"

import * as React from "react"
import { BellIcon, MoonIcon } from "lucide-react"

import { Switch } from "@/registry/ui/switch"

export default function SwitchDemo() {
  const [notifications, setNotifications] = React.useState(true)
  const [darkMode, setDarkMode] = React.useState(false)

  return (
    <div className="w-full max-w-sm divide-y border-y">
      <Setting icon={<BellIcon />} title="Notifications" description="Important updates and mentions">
        <Switch checked={notifications} onCheckedChange={setNotifications} aria-label="Toggle notifications" />
      </Setting>
      <Setting icon={<MoonIcon />} title="Dark appearance" description="Follow your evening focus">
        <Switch checked={darkMode} onCheckedChange={setDarkMode} aria-label="Toggle dark appearance" />
      </Setting>
    </div>
  )
}

function Setting({ icon, title, description, children }: { icon: React.ReactNode; title: string; description: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 px-1 py-3.5 transition-colors hover:bg-accent/40">
      <span className="flex size-8 items-center justify-center rounded-md bg-muted text-foreground [&_svg]:size-4">{icon}</span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-medium">{title}</span>
        <span className="block truncate text-xs text-muted-foreground">{description}</span>
      </span>
      {children}
    </div>
  )
}
