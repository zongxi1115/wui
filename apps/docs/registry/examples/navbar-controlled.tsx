"use client"

import * as React from "react"
import {
  ActivityIcon,
  BarChart3Icon,
  BotIcon,
  DatabaseIcon,
  LayersIcon,
  LifeBuoyIcon,
  SettingsIcon,
  UsersIcon,
} from "lucide-react"

import { Button } from "@/registry/ui/button"
import {
  Navbar,
  NavbarBadge,
  NavbarBrand,
  NavbarBrandLabel,
  NavbarCollapseTrigger,
  NavbarContent,
  NavbarFooter,
  NavbarGroup,
  NavbarHeader,
  NavbarItem,
  NavbarLabel,
  NavbarLink,
  NavbarLinkLabel,
  NavbarList,
} from "@/registry/ui/navbar"

type Link = {
  id: string
  label: string
  icon: React.ComponentType
  badge?: string
}

const groups: Array<{ label: string; links: Link[] }> = [
  {
    label: "核心业务",
    links: [
      { id: "assistant", label: "智能助手", icon: BotIcon, badge: "Beta" },
      { id: "dashboard", label: "数据大屏", icon: BarChart3Icon },
      { id: "services", label: "微服务集群", icon: LayersIcon, badge: "12" },
    ],
  },
  {
    label: "系统运维",
    links: [
      { id: "monitor", label: "实时监控", icon: ActivityIcon },
      { id: "vector", label: "向量数据库", icon: DatabaseIcon },
      { id: "members", label: "成员与权限", icon: UsersIcon },
    ],
  },
]

const footerLinks: Link[] = [
  { id: "settings", label: "系统设置", icon: SettingsIcon },
  { id: "support", label: "技术支持", icon: LifeBuoyIcon },
]

const allLinks = [...groups.flatMap((group) => group.links), ...footerLinks]

export default function NavbarControlled() {
  const [collapsed, setCollapsed] = React.useState(false)
  const [active, setActive] = React.useState("assistant")

  function renderLink(link: Link) {
    return (
      <NavbarItem key={link.id}>
        <NavbarLink
          href={`#${link.id}`}
          title={collapsed ? link.label : undefined}
          active={active === link.id}
          onClick={(event) => {
            event.preventDefault()
            setActive(link.id)
          }}
        >
          <link.icon />
          <NavbarLinkLabel>{link.label}</NavbarLinkLabel>
          {link.badge ? <NavbarBadge>{link.badge}</NavbarBadge> : null}
        </NavbarLink>
      </NavbarItem>
    )
  }

  return (
    <div className="flex h-[460px] w-full overflow-hidden rounded-lg border">
      <Navbar
        orientation="vertical"
        collapsed={collapsed}
        onCollapsedChange={setCollapsed}
        aria-label="管理后台主侧边栏"
        className="w-56"
      >
        <NavbarCollapseTrigger />

        <NavbarHeader>
          <NavbarBrand href="#" className="w-full">
            <span className="bg-foreground text-background flex size-7 shrink-0 items-center justify-center rounded-md text-xs font-bold">
              W
            </span>
            <NavbarBrandLabel className="truncate">WUI Admin</NavbarBrandLabel>
          </NavbarBrand>
        </NavbarHeader>

        <NavbarContent>
          {groups.map((group) => (
            <NavbarGroup key={group.label}>
              <NavbarLabel>{group.label}</NavbarLabel>
              <NavbarList>{group.links.map(renderLink)}</NavbarList>
            </NavbarGroup>
          ))}
        </NavbarContent>

        <NavbarFooter>
          <NavbarList>{footerLinks.map(renderLink)}</NavbarList>
        </NavbarFooter>
      </Navbar>

      <main className="bg-muted/30 flex min-w-0 flex-1 flex-col p-6">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-lg font-semibold">
            {allLinks.find((link) => link.id === active)?.label}
          </h2>
          <Button variant="outline" size="sm" onClick={() => setCollapsed(!collapsed)}>
            {collapsed ? "展开侧边栏" : "收起侧边栏"}
          </Button>
        </div>
        <p className="text-muted-foreground mt-2 text-sm">
          选中态底块会在分组之间滑动；收起后仅保留图标，悬停可查看名称。
        </p>
      </main>
    </div>
  )
}
