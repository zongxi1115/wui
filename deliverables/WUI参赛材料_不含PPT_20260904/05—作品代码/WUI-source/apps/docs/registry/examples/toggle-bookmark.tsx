"use client"

import * as React from "react"
import { BookmarkIcon, StarIcon } from "lucide-react"

import { Toggle } from "@/registry/ui/toggle"

export default function ToggleBookmark() {
  const [bookmarked, setBookmarked] = React.useState(false)
  const [starred, setStarred] = React.useState(true)

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Toggle
        variant="outline"
        pressed={bookmarked}
        onPressedChange={setBookmarked}
        aria-label="收藏文章"
        className="data-[state=on]:border-primary/40 data-[state=on]:bg-primary/10 data-[state=on]:text-primary"
      >
        <BookmarkIcon
          className={`size-4 transition-all ${
            bookmarked ? "fill-primary text-primary" : ""
          }`}
        />
        <span>{bookmarked ? "已收藏" : "加入收藏"}</span>
      </Toggle>

      <Toggle
        variant="outline"
        pressed={starred}
        onPressedChange={setStarred}
        aria-label="加星标"
        className="data-[state=on]:border-amber-500/40 data-[state=on]:bg-amber-500/10 data-[state=on]:text-amber-600 dark:data-[state=on]:text-amber-400"
      >
        <StarIcon
          className={`size-4 transition-all ${
            starred ? "fill-amber-500 text-amber-500" : ""
          }`}
        />
        <span>{starred ? "已标星" : "标为星标"}</span>
      </Toggle>
    </div>
  )
}
