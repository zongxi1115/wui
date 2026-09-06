import { BellIcon, BoxesIcon, SearchIcon } from "lucide-react"

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

export default function NavbarDemo() {
  return (
    <Navbar aria-label="主导航" className="max-w-3xl">
      <NavbarHeader>
        <NavbarBrand href="#">
          <span className="flex size-7 items-center justify-center bg-foreground text-xs font-bold text-background">
            W
          </span>
          Workspace
        </NavbarBrand>
      </NavbarHeader>
      <NavbarContent>
        <NavbarList>
          <NavbarItem>
            <NavbarLink href="#" active>
              概览
            </NavbarLink>
          </NavbarItem>
          <NavbarItem>
            <NavbarLink href="#">项目</NavbarLink>
          </NavbarItem>
          <NavbarItem>
            <NavbarLink href="#">团队</NavbarLink>
          </NavbarItem>
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
        <NavbarLink href="#" aria-label="资源" className="px-2.5">
          <BoxesIcon />
        </NavbarLink>
      </NavbarFooter>
    </Navbar>
  )
}
