"use client"

import * as React from "react"
import { BellIcon, CircleHelpIcon, SearchIcon } from "lucide-react"

import { Avatar, AvatarFallback } from "@/registry/ui/avatar"
import { Button } from "@/registry/ui/button"
import {
  Navbar,
  NavbarBadge,
  NavbarBrand,
  NavbarContent,
  NavbarFooter,
  NavbarHeader,
  NavbarItem,
  NavbarLink,
  NavbarList,
  NavbarSeparator,
} from "@/registry/ui/navbar"

const links = [
  { id: "console", label: "控制台" },
  { id: "agents", label: "智能体编排", badge: "新" },
  { id: "data", label: "数据服务" },
  { id: "alerts", label: "监控告警" },
]

export default function NavbarAppHeader() {
  const [active, setActive] = React.useState("console")

  return (
    <div className="bg-background w-full overflow-hidden rounded-lg border">
      <Navbar aria-label="应用全局导航" className="h-14 border-b-0 px-4">
        <NavbarHeader>
          <NavbarBrand href="#" className="gap-2.5">
            <span className="bg-primary text-primary-foreground flex size-7 items-center justify-center rounded-md text-xs font-bold">
              V
            </span>
            <span className="flex flex-col text-left">
              <span className="text-sm font-semibold leading-none">Vibe Cloud</span>
              <span className="text-muted-foreground mt-1 text-[11px] font-normal leading-none">
                企业版 · prod-01
              </span>
            </span>
          </NavbarBrand>
        </NavbarHeader>

        <NavbarContent className="hidden md:flex">
          <NavbarList>
            {links.map((link) => (
              <NavbarItem key={link.id}>
                <NavbarLink
                  href={`#${link.id}`}
                  active={active === link.id}
                  onClick={(event) => {
                    event.preventDefault()
                    setActive(link.id)
                  }}
                >
                  {link.label}
                  {link.badge ? (
                    <NavbarBadge className="bg-primary/10 text-primary ml-0">
                      {link.badge}
                    </NavbarBadge>
                  ) : null}
                </NavbarLink>
              </NavbarItem>
            ))}
          </NavbarList>
        </NavbarContent>

        <NavbarFooter className="gap-1">
          <Button
            variant="outline"
            size="sm"
            className="text-muted-foreground hidden w-52 justify-start font-normal lg:inline-flex"
          >
            <SearchIcon />
            搜索资源与文档
            <kbd className="bg-muted ml-auto rounded px-1.5 py-0.5 font-mono text-[10px]">
              ⌘K
            </kbd>
          </Button>

          <NavbarSeparator />

          <Button variant="ghost" size="icon" className="relative" aria-label="通知中心，3 条未读">
            <BellIcon />
            <span className="bg-destructive ring-background absolute right-2.5 top-2.5 size-1.5 rounded-full ring-2" />
          </Button>
          <Button variant="ghost" size="icon" aria-label="帮助文档">
            <CircleHelpIcon />
          </Button>
          <Avatar size="sm" className="ml-1">
            <AvatarFallback>林</AvatarFallback>
          </Avatar>
        </NavbarFooter>
      </Navbar>
    </div>
  )
}
