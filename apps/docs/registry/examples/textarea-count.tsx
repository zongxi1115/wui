"use client"

import * as React from "react"

import { Textarea } from "@/registry/ui/textarea"

export default function TextareaCount() {
  const [value, setValue] = React.useState("")

  return (
    <div className="w-full max-w-md space-y-2">
      <label htmlFor="release-summary" className="text-sm font-medium">
        更新摘要
      </label>
      <Textarea
        id="release-summary"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        maxLength={120}
        showCount
        resize="none"
        placeholder="用一句话说明这次更新…"
      />
    </div>
  )
}
