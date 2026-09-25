"use client"

import * as React from "react"
import { SlidersHorizontalIcon } from "lucide-react"

import { Button } from "@/registry/ui/button"
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/registry/ui/drawer"

const filters = [
  { id: "status", label: "订单状态", options: ["待付款", "待发货", "已发货", "已完成"] },
  { id: "channel", label: "下单渠道", options: ["小程序", "App", "网页端"] },
  { id: "period", label: "下单时间", options: ["今天", "近 7 天", "近 30 天"] },
]

export default function DrawerSwipe() {
  const [open, setOpen] = React.useState(false)
  const [selected, setSelected] = React.useState<Record<string, string[]>>({
    status: ["待发货"],
    period: ["近 7 天"],
  })
  const count = Object.values(selected).flat().length

  function toggle(group: string, option: string) {
    setSelected((current) => {
      const values = current[group] ?? []
      return {
        ...current,
        [group]: values.includes(option)
          ? values.filter((value) => value !== option)
          : [...values, option],
      }
    })
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline">
          <SlidersHorizontalIcon />
          筛选订单
          {count ? (
            <span className="bg-primary text-primary-foreground rounded-full px-1.5 text-xs tabular-nums">
              {count}
            </span>
          ) : null}
        </Button>
      </DrawerTrigger>
      <DrawerContent side="bottom" size="lg" swipeToClose className="rounded-t-lg">
        <DrawerHeader>
          <DrawerTitle>筛选订单</DrawerTitle>
          <DrawerDescription>按住顶部把手向下拖动即可关闭。</DrawerDescription>
        </DrawerHeader>
        <DrawerBody className="space-y-5">
          {filters.map((filter) => (
            <fieldset key={filter.id}>
              <legend className="mb-2 text-sm font-medium">{filter.label}</legend>
              <div className="flex flex-wrap gap-2">
                {filter.options.map((option) => {
                  const active = selected[filter.id]?.includes(option) ?? false
                  return (
                    <Button
                      key={option}
                      type="button"
                      size="sm"
                      variant={active ? "secondary" : "outline"}
                      aria-pressed={active}
                      className={active ? "border-primary/40 text-primary border" : undefined}
                      onClick={() => toggle(filter.id, option)}
                    >
                      {option}
                    </Button>
                  )
                })}
              </div>
            </fieldset>
          ))}
        </DrawerBody>
        <DrawerFooter>
          <Button variant="ghost" onClick={() => setSelected({})}>
            重置
          </Button>
          <Button onClick={() => setOpen(false)}>
            查看结果{count ? `（${count} 项条件）` : ""}
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
