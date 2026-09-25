"use client"

import * as React from "react"
import { BellIcon, SearchIcon } from "lucide-react"

import {
  Navbar,
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
  { id: "overview", label: "概览" },
  { id: "projects", label: "项目" },
  { id: "reports", label: "报表" },
  { id: "team", label: "团队" },
]

export default function NavbarDemo() {
  const [active, setActive] = React.useState("overview")

  return (
    <Navbar aria-label="主导航" className="max-w-3xl">
      <NavbarHeader>
        <NavbarBrand href="#">
          <span className="bg-foreground text-background flex size-7 items-center justify-center rounded-md text-xs font-bold">
            W
          </span>
          Workspace
        </NavbarBrand>
      </NavbarHeader>
      <NavbarContent>
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
              </NavbarLink>
            </NavbarItem>
          ))}
        </NavbarList>
      </NavbarContent>
      <NavbarFooter className="gap-1">
        <NavbarSeparator />
        <NavbarLink href="#" aria-label="搜索" className="px-2.5">
          <SearchIcon />
        </NavbarLink>
        <NavbarLink href="#" aria-label="通知" className="px-2.5">
          <BellIcon />
        </NavbarLink>
      </NavbarFooter>
    </Navbar>
  )
}
