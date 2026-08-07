"use client"

import * as React from "react"
import { Grid2X2Icon, ListIcon, Rows3Icon } from "lucide-react"

import { ToggleGroup, ToggleGroupItem } from "@/registry/ui/toggle-group"

export default function ToggleGroupDemo() {
  const [view, setView] = React.useState("grid")

  return (
    <ToggleGroup
      type="single"
      value={view}
      onValueChange={(value) => value && setView(value)}
      variant="outline"
      aria-label="切换视图"
    >
      <ToggleGroupItem value="grid" aria-label="网格视图">
        <Grid2X2Icon />
      </ToggleGroupItem>
      <ToggleGroupItem value="comfortable" aria-label="舒适列表">
        <Rows3Icon />
      </ToggleGroupItem>
      <ToggleGroupItem value="compact" aria-label="紧凑列表">
        <ListIcon />
      </ToggleGroupItem>
    </ToggleGroup>
  )
}
