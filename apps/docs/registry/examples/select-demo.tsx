"use client"

import * as React from "react"
import { Globe2Icon } from "lucide-react"

import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/registry/ui/select"

export default function SelectDemo() {
  const [value, setValue] = React.useState("shanghai")

  return (
    <div className="grid w-full max-w-md gap-3">
      <div className="flex items-center gap-2">
        <Globe2Icon className="size-4 text-muted-foreground" />
        <div><p className="text-sm font-semibold">Workspace region</p><p className="text-xs text-muted-foreground">Choose the nearest data center</p></div>
      </div>
      <Select value={value} onValueChange={setValue}>
        <SelectTrigger className="w-full" aria-label="Workspace region"><SelectValue placeholder="Select region" /></SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Asia Pacific</SelectLabel>
            <SelectItem value="shanghai">Shanghai</SelectItem>
            <SelectItem value="singapore">Singapore</SelectItem>
            <SelectItem value="tokyo">Tokyo</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  )
}
