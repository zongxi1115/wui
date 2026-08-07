"use client"

import * as React from "react"

import { Combobox } from "@/registry/ui/combobox"

const frameworks = [
  { value: "next", label: "Next.js", keywords: ["react"] },
  { value: "nuxt", label: "Nuxt", keywords: ["vue"] },
  { value: "sveltekit", label: "SvelteKit", keywords: ["svelte"] },
  { value: "astro", label: "Astro" },
]

export default function ComboboxDemo() {
  const [value, setValue] = React.useState("")

  return (
    <div className="grid w-full max-w-sm gap-2">
      <label className="text-sm font-medium">项目框架</label>
      <Combobox
        options={frameworks}
        value={value}
        onValueChange={setValue}
        placeholder="选择框架"
        searchPlaceholder="搜索框架…"
      />
      <p className="text-muted-foreground text-xs">
        {value ? `当前值：${value}` : "尚未选择"}
      </p>
    </div>
  )
}
