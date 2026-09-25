"use client"

import * as React from "react"
import { motion, useReducedMotion } from "motion/react"
import { BookmarkIcon, StarIcon } from "lucide-react"

import { cn } from "@/registry/lib/utils"
import { Toggle } from "@/registry/ui/toggle"

function PopIcon({ on, children }: { on: boolean; children: React.ReactNode }) {
  const reduceMotion = useReducedMotion()
  return (
    <motion.span
      className="inline-flex"
      initial={false}
      animate={reduceMotion ? undefined : { scale: on ? [1, 1.3, 1] : 1 }}
      transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.span>
  )
}

export default function ToggleBookmark() {
  const [bookmarked, setBookmarked] = React.useState(false)
  const [starred, setStarred] = React.useState(true)

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Toggle
        variant="outline"
        pressed={bookmarked}
        onPressedChange={setBookmarked}
        className="data-[state=on]:border-primary/40 data-[state=on]:bg-primary/10 data-[state=on]:text-primary"
      >
        <PopIcon on={bookmarked}>
          <BookmarkIcon
            className={cn("transition-colors", bookmarked && "fill-current")}
          />
        </PopIcon>
        {bookmarked ? "已收藏" : "收藏"}
      </Toggle>

      <Toggle
        variant="outline"
        pressed={starred}
        onPressedChange={setStarred}
        className="data-[state=on]:border-warning/40 data-[state=on]:bg-warning/10 data-[state=on]:text-warning"
      >
        <PopIcon on={starred}>
          <StarIcon
            className={cn("transition-colors", starred && "fill-current")}
          />
        </PopIcon>
        {starred ? "已标星" : "标星"}
      </Toggle>
    </div>
  )
}
