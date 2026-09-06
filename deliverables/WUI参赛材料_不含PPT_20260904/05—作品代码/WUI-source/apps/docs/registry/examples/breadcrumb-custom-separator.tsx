"use client"

import { ArrowRightIcon, SlashIcon } from "lucide-react"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/registry/ui/breadcrumb"

export default function BreadcrumbCustomSeparator() {
  return (
    <div className="flex flex-col gap-6">
      {/* 斜线分隔符 */}
      <div className="space-y-1.5">
        <p className="text-xs font-medium text-muted-foreground">斜线分隔符</p>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="#">工作台</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <SlashIcon />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbLink href="#">数据大屏</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <SlashIcon />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbPage>实时流量分析</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* 箭头分隔符 */}
      <div className="space-y-1.5">
        <p className="text-xs font-medium text-muted-foreground">箭头推进分隔符</p>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="#">订单中心</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <ArrowRightIcon />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbLink href="#">售后工单</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <ArrowRightIcon />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbPage>工单 #20260819-0941</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* 圆点字符分隔符 */}
      <div className="space-y-1.5">
        <p className="text-xs font-medium text-muted-foreground">字符点分隔符</p>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="#">开发者中心</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>•</BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbLink href="#">开放 API</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>•</BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbPage>Webhooks 订阅</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </div>
  )
}
