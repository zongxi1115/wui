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
import { Button } from "@/registry/ui/button"

export default function NavbarControlled() {
  const [collapsed, setCollapsed] = React.useState(false)

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">
          侧边栏状态：<strong className="text-foreground">{collapsed ? "已收起 (Icon-only)" : "已展开 (Full)"}</strong>
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? "展开侧边栏" : "收起侧边栏"}
        </Button>
      </div>

      <div className="h-[480px] w-full overflow-hidden rounded-xl border bg-muted/10 flex">
        <Navbar
          orientation="vertical"
          collapsed={collapsed}
          onCollapsedChange={setCollapsed}
          aria-label="管理后台主侧边栏"
        >
          <NavbarCollapseTrigger />

          <NavbarHeader>
            <NavbarBrand href="#" className="w-full">
              <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-foreground font-bold text-background text-xs">
                W
              </div>
              <NavbarBrandLabel className="truncate font-semibold">
                WUI Admin
              </NavbarBrandLabel>
            </NavbarBrand>
          </NavbarHeader>

          <NavbarContent>
            <NavbarGroup>
              <NavbarLabel>核心业务</NavbarLabel>
              <NavbarList>
                <NavbarItem>
                  <NavbarLink href="#" active title="智能助手">
                    <BotIcon />
                    <NavbarLinkLabel>智能助手</NavbarLinkLabel>
                    <NavbarBadge className="bg-primary/10 text-primary">Beta</NavbarBadge>
                  </NavbarLink>
                </NavbarItem>
                <NavbarItem>
                  <NavbarLink href="#" title="数据大屏">
                    <BarChart3Icon />
                    <NavbarLinkLabel>数据大屏</NavbarLinkLabel>
                  </NavbarLink>
                </NavbarItem>
                <NavbarItem>
                  <NavbarLink href="#" title="微服务集群">
                    <LayersIcon />
                    <NavbarLinkLabel>微服务集群</NavbarLinkLabel>
                    <NavbarBadge>12</NavbarBadge>
                  </NavbarLink>
                </NavbarItem>
              </NavbarList>
            </NavbarGroup>

            <NavbarGroup>
              <NavbarLabel>系统运维</NavbarLabel>
              <NavbarList>
                <NavbarItem>
                  <NavbarLink href="#" title="实时监控">
                    <ActivityIcon />
                    <NavbarLinkLabel>实时监控</NavbarLinkLabel>
                  </NavbarLink>
                </NavbarItem>
                <NavbarItem>
                  <NavbarLink href="#" title="向量数据库">
                    <DatabaseIcon />
                    <NavbarLinkLabel>向量数据库</NavbarLinkLabel>
                  </NavbarLink>
                </NavbarItem>
                <NavbarItem>
                  <NavbarLink href="#" title="成员与权限">
                    <UsersIcon />
                    <NavbarLinkLabel>成员与权限</NavbarLinkLabel>
                  </NavbarLink>
                </NavbarItem>
              </NavbarList>
            </NavbarGroup>
          </NavbarContent>

          <NavbarFooter>
            <NavbarList className="w-full">
              <NavbarItem>
                <NavbarLink href="#" title="系统设置">
                  <SettingsIcon />
                  <NavbarLinkLabel>系统设置</NavbarLinkLabel>
                </NavbarLink>
              </NavbarItem>
              <NavbarItem>
                <NavbarLink href="#" title="技术支持">
                  <LifeBuoyIcon />
                  <NavbarLinkLabel>技术支持</NavbarLinkLabel>
                </NavbarLink>
              </NavbarItem>
            </NavbarList>
          </NavbarFooter>
        </Navbar>

        <div className="flex-1 p-6 bg-background/50 flex flex-col items-center justify-center text-center text-muted-foreground text-sm">
          <p className="font-medium text-foreground">工作区主内容视口</p>
          <p className="text-xs text-muted-foreground mt-1">
            侧边导航栏宽度切换时具备平滑过渡动画（在开启减弱动态效果时自动跳变）。
          </p>
        </div>
      </div>
    </div>
  )
}
