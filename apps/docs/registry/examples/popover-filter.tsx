"use client"

import * as React from "react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import { ListFilterIcon } from "lucide-react"

import { Button } from "@/registry/ui/button"
import { Checkbox } from "@/registry/ui/checkbox"
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTitle,
  PopoverTrigger,
} from "@/registry/ui/popover"

const statuses = [
  { id: "published", label: "已发布", count: 128 },
  { id: "scheduled", label: "定时发布", count: 6 },
  { id: "draft", label: "草稿", count: 23 },
  { id: "archived", label: "已归档", count: 41 },
]

export default function PopoverFilter() {
  const reduceMotion = useReducedMotion()
  const [selected, setSelected] = React.useState<string[]>(["published"])

  const toggle = (id: string, checked: boolean) =>
    setSelected((prev) =>
      checked ? [...prev, id] : prev.filter((item) => item !== id)
    )

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm">
          <ListFilterIcon />
          发布状态
          <AnimatePresence initial={false}>
            {selected.length > 0 ? (
              <motion.span
                key="count"
                className="bg-primary text-primary-foreground inline-flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-semibold tabular-nums"
                initial={reduceMotion ? false : { scale: 0.4, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={reduceMotion ? undefined : { scale: 0.4, opacity: 0 }}
                transition={{ type: "spring", stiffness: 520, damping: 30 }}
              >
                {selected.length}
              </motion.span>
            ) : null}
          </AnimatePresence>
        </Button>
      </PopoverTrigger>

      <PopoverContent align="start" className="w-64 p-0">
        <div className="flex items-center justify-between border-b px-3 py-2.5">
          <PopoverTitle>按发布状态筛选</PopoverTitle>
          <Button
            variant="link"
            size="sm"
            className="h-auto px-0 text-xs"
            disabled={selected.length === 0}
            onClick={() => setSelected([])}
          >
            清空
          </Button>
        </div>

        <div className="p-1.5">
          {statuses.map((item) => {
            const id = `popover-filter-${item.id}`
            return (
              <label
                key={item.id}
                htmlFor={id}
                className="hover:bg-accent flex cursor-pointer items-center gap-2.5 rounded-md px-2 py-1.5 text-sm transition-colors"
              >
                <Checkbox
                  id={id}
                  size="sm"
                  checked={selected.includes(item.id)}
                  onCheckedChange={(checked) => toggle(item.id, checked === true)}
                />
                <span className="flex-1">{item.label}</span>
                <span className="text-muted-foreground text-xs tabular-nums">
                  {item.count}
                </span>
              </label>
            )
          })}
        </div>

        <div className="flex justify-end border-t p-2">
          <PopoverClose asChild>
            <Button size="sm">应用筛选</Button>
          </PopoverClose>
        </div>
      </PopoverContent>
    </Popover>
  )
}
