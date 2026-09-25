"use client"

import { ChevronDownIcon, SlashIcon } from "lucide-react"

import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/registry/ui/breadcrumb"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/registry/ui/dropdown-menu"

export default function BreadcrumbDropdown() {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="#">控制台</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator>
          <SlashIcon />
        </BreadcrumbSeparator>
        <BreadcrumbItem>
          <DropdownMenu>
            <DropdownMenuTrigger
              aria-label="展开折叠路径"
              className="hover:text-foreground focus-visible:ring-ring/40 data-[state=open]:text-foreground flex items-center gap-0.5 rounded-sm outline-none transition-colors focus-visible:ring-[3px]"
            >
              <BreadcrumbEllipsis className="size-6" />
              <ChevronDownIcon className="size-3.5 opacity-60 transition-transform duration-200 [[data-state=open]>&]:rotate-180" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem asChild>
                <a href="#teams">团队与权限</a>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <a href="#infra">基础设施配置</a>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <a href="#clusters">Kubernetes 集群</a>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </BreadcrumbItem>
        <BreadcrumbSeparator>
          <SlashIcon />
        </BreadcrumbSeparator>
        <BreadcrumbItem>
          <BreadcrumbLink href="#nodes">节点池 (prod-hk-01)</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator>
          <SlashIcon />
        </BreadcrumbSeparator>
        <BreadcrumbItem>
          <BreadcrumbPage>Pod 监控告警</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  )
}
