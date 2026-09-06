"use client"

import * as React from "react"
import {
  BellIcon,
  ChartNoAxesCombinedIcon,
  ChevronRightIcon,
  CircleCheckIcon,
  FolderKanbanIcon,
  LayoutDashboardIcon,
  Settings2Icon,
  UsersIcon,
} from "lucide-react"

import {
  Navbar,
  NavbarBadge,
  NavbarBrand,
  NavbarBrandLabel,
  NavbarCollapseTrigger,
  NavbarContent,
  NavbarGroup,
  NavbarHeader,
  NavbarItem,
  NavbarLabel,
  NavbarLink,
  NavbarLinkAccessory,
  NavbarLinkLabel,
  NavbarList,
  NavbarSubLink,
  NavbarSubList,
  NavbarSubmenu,
  NavbarSubmenuContent,
  NavbarSubmenuTrigger,
} from "@/registry/ui/navbar"

type NavItem = {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  badge?: string
  children?: Array<{ id: string; label: string }>
}

const primary: NavItem[] = [
  { id: "overview", label: "工作台", icon: LayoutDashboardIcon },
  {
    id: "projects",
    label: "项目",
    icon: FolderKanbanIcon,
    children: [
      { id: "website", label: "网站重构" },
      { id: "mobile", label: "移动端体验" },
    ],
  },
  { id: "analytics", label: "数据分析", icon: ChartNoAxesCombinedIcon },
]

const workspace: NavItem[] = [
  { id: "team", label: "团队成员", icon: UsersIcon },
  { id: "notifications", label: "通知", icon: BellIcon, badge: "6" },
  { id: "settings", label: "设置", icon: Settings2Icon },
]

export default function NavbarVertical() {
  const [active, setActive] = React.useState("overview")
  return (
    <div className="not-prose flex h-[440px] w-full max-w-2xl border bg-muted/30">
      <Navbar
        orientation="vertical"
        aria-label="工作区导航"
        className="w-52"
      >
        <NavbarCollapseTrigger />
        <NavbarHeader>
          <NavbarBrand href="#">
            <span className="flex size-8 items-center justify-center bg-foreground text-sm font-bold text-background">
              W
            </span>
            <NavbarBrandLabel>
              <span className="block leading-4">WUI Studio</span>
              <span className="block text-[11px] font-normal text-muted-foreground">
                设计工作区
              </span>
            </NavbarBrandLabel>
          </NavbarBrand>
        </NavbarHeader>
        <NavbarContent className="gap-4">
          <NavGroup
            label="工作"
            items={primary}
            active={active}
            onChange={setActive}
          />
          <NavGroup
            label="管理"
            items={workspace}
            active={active}
            onChange={setActive}
          />
        </NavbarContent>
      </Navbar>
      <main className="min-w-0 flex-1 p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="m-0 text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
              当前页面
            </p>
            <h2 className="mb-0 mt-1.5 text-xl font-semibold tracking-tight">
              {[...primary, ...workspace]
                .flatMap((item) => [item, ...(item.children ?? [])])
                .find((item) => item.id === active)?.label}
            </h2>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <CircleCheckIcon className="size-3.5 text-success" />
            同步完成
          </div>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-px border bg-border">
          {[
            ["18", "进行中"],
            ["7", "本周完成"],
            ["92%", "完成率"],
          ].map(([value, label]) => (
            <div key={label} className="bg-background px-4 py-3.5">
              <p className="m-0 text-lg font-semibold tabular-nums">{value}</p>
              <p className="mb-0 mt-1 text-[11px] text-muted-foreground">
                {label}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-7">
          <div className="flex items-center justify-between border-b pb-2.5">
            <h3 className="m-0 text-sm font-medium">最近项目</h3>
            <span className="text-[11px] text-muted-foreground">本周更新</span>
          </div>
          <div className="divide-y">
            {[
              ["设计系统升级", "12 / 16 任务", "今天"],
              ["移动端体验", "8 / 11 任务", "昨天"],
              ["官网重构", "5 / 9 任务", "周一"],
            ].map(([name, progress, time]) => (
              <div
                key={name}
                className="grid grid-cols-[1fr_auto_auto] items-center gap-4 py-3 text-xs"
              >
                <span className="truncate font-medium">{name}</span>
                <span className="text-muted-foreground">{progress}</span>
                <span className="w-8 text-right text-muted-foreground">
                  {time}
                </span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}

function NavGroup({
  label,
  items,
  active,
  onChange,
}: {
  label: string
  items: NavItem[]
  active: string
  onChange: (id: string) => void
}) {
  return (
    <NavbarGroup>
      <NavbarLabel>{label}</NavbarLabel>
      <NavbarList>
        {items.map((item) => (
          <NavbarItem key={item.id}>
            {item.children ? (
              <NavbarSubmenu>
                <NavbarSubmenuTrigger asChild>
                  <NavbarLink
                    active={item.children.some(
                      (child) => child.id === active
                    )}
                    asChild
                  >
                    <button
                      type="button"
                      aria-label={item.label}
                      aria-haspopup="menu"
                      title={item.label}
                      onClick={() => onChange(item.children![0].id)}
                    >
                      <item.icon />
                      <NavbarLinkLabel>{item.label}</NavbarLinkLabel>
                      <NavbarLinkAccessory>
                        <ChevronRightIcon className="size-3.5" />
                      </NavbarLinkAccessory>
                    </button>
                  </NavbarLink>
                </NavbarSubmenuTrigger>
                <NavbarSubmenuContent aria-label={`${item.label}子栏目`}>
                  <NavbarSubList role="menu">
                    {item.children.map((child) => (
                      <li key={child.id} role="none">
                        <NavbarSubLink active={active === child.id} asChild>
                          <button
                            type="button"
                            onClick={() => onChange(child.id)}
                          >
                            {child.label}
                          </button>
                        </NavbarSubLink>
                      </li>
                    ))}
                  </NavbarSubList>
                </NavbarSubmenuContent>
              </NavbarSubmenu>
            ) : (
              <NavbarLink active={active === item.id} asChild>
                <button
                  type="button"
                  aria-label={item.label}
                  title={item.label}
                  onClick={() => onChange(item.id)}
                >
                  <item.icon />
                  <NavbarLinkLabel>{item.label}</NavbarLinkLabel>
                  {item.badge ? <NavbarBadge>{item.badge}</NavbarBadge> : null}
                </button>
              </NavbarLink>
            )}
          </NavbarItem>
        ))}
      </NavbarList>
    </NavbarGroup>
  )
}
