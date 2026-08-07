"use client"

import * as React from "react"
import { SlidersHorizontalIcon } from "lucide-react"

import { Button } from "@/registry/ui/button"
import { Input } from "@/registry/ui/input"
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverDescription,
  PopoverTitle,
  PopoverTrigger,
} from "@/registry/ui/popover"

export default function PopoverForm() {
  const [open, setOpen] = React.useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline">
          <SlidersHorizontalIcon />
          页面设置
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80">
        <div className="space-y-1.5">
          <PopoverTitle>页面尺寸</PopoverTitle>
          <PopoverDescription>调整画布的宽度和高度。</PopoverDescription>
        </div>
        <div className="mt-4 grid grid-cols-[4rem_1fr] items-center gap-3">
          <label
            htmlFor="popover-width"
            className="text-sm font-medium leading-none"
          >
            宽度
          </label>
          <Input id="popover-width" defaultValue="1280" inputMode="numeric" />
          <label
            htmlFor="popover-height"
            className="text-sm font-medium leading-none"
          >
            高度
          </label>
          <Input id="popover-height" defaultValue="720" inputMode="numeric" />
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <PopoverClose asChild>
            <Button variant="ghost" size="sm">
              取消
            </Button>
          </PopoverClose>
          <Button size="sm" onClick={() => setOpen(false)}>
            应用
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
