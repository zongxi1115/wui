"use client"

import {
  BellIcon,
  HelpCircleIcon,
  SearchIcon,
  SparklesIcon,
} from "lucide-react"

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
import { Button } from "@/registry/ui/button"

export default function NavbarAppHeader() {
  return (
    <div className="w-full rounded-xl border bg-background shadow-xs">
      <Navbar aria-label="应用全局导航" className="h-16 px-4">
        {/* 左侧品牌与工作区 */}
        <NavbarHeader>
          <NavbarBrand href="#" className="gap-2.5">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary font-bold text-primary-foreground">
              <SparklesIcon className="size-4" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-sm font-semibold leading-none">Vibe Cloud</span>
              <span className="text-[11px] text-muted-foreground">企业版 · Prod-01</span>
            </div>
          </NavbarBrand>
        </NavbarHeader>

        {/* 中间核心导航条 */}
        <NavbarContent>
          <NavbarList className="gap-1">
            <NavbarItem>
              <NavbarLink href="#" active>
                控制台
              </NavbarLink>
            </NavbarItem>
            <NavbarItem>
              <NavbarLink href="#">
                AI Agent 编排
                <NavbarBadge className="bg-primary/10 text-primary">新功能</NavbarBadge>
              </NavbarLink>
            </NavbarItem>
            <NavbarItem>
              <NavbarLink href="#">数据服务</NavbarLink>
            </NavbarItem>
            <NavbarItem>
              <NavbarLink href="#">监控告警</NavbarLink>
            </NavbarItem>
          </NavbarList>
        </NavbarContent>

        {/* 右侧搜索、通知与操作区 */}
        <NavbarFooter className="gap-2">
          <div className="hidden sm:flex items-center gap-2 rounded-md border bg-muted/40 px-2.5 py-1 text-xs text-muted-foreground">
            <SearchIcon className="size-3.5" />
            <span>快速检索文档与资源...</span>
            <kbd className="ml-2 rounded border bg-background px-1.5 py-0.5 font-mono text-[10px] text-foreground">
              ⌘K
            </kbd>
          </div>

          <NavbarSeparator />

          <Button variant="ghost" size="icon" className="relative size-9" aria-label="通知中心">
            <BellIcon className="size-4" />
            <span className="absolute right-2 top-2 size-2 rounded-full bg-destructive" />
          </Button>

          <Button variant="ghost" size="icon" className="size-9 text-muted-foreground" aria-label="帮助文档">
            <HelpCircleIcon className="size-4" />
          </Button>

          <div className="ml-1 flex size-8 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-500 to-violet-500 text-xs font-semibold text-white">
            JD
          </div>
        </NavbarFooter>
      </Navbar>
    </div>
  )
}
