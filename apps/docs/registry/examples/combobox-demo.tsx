"use client"

import * as React from "react"
import { Layers } from "lucide-react"

import { Combobox } from "@/registry/ui/combobox"

const frameworks = [
  { value: "next", label: "Next.js", keywords: ["react", "ssr", "vercel"] },
  { value: "nuxt", label: "Nuxt", keywords: ["vue", "ssr", "nitro"] },
  { value: "remix", label: "Remix", keywords: ["react", "shopify"] },
  { value: "sveltekit", label: "SvelteKit", keywords: ["svelte", "vite"] },
  { value: "astro", label: "Astro", keywords: ["islands", "ssg", "content"] },
  { value: "solidstart", label: "SolidStart", keywords: ["solid", "reactive"] },
]

export default function ComboboxDemo() {
  const [value, setValue] = React.useState("next")

  return (
    <div className="grid w-full max-w-sm gap-2">
      <label className="text-sm font-medium text-foreground flex items-center gap-1.5">
        <Layers className="size-4 text-muted-foreground" />
        <span>前端基础框架</span>
      </label>
      <Combobox
        options={frameworks}
        value={value}
        onValueChange={setValue}
        placeholder="请选择或搜索框架…"
        searchPlaceholder="键入关键词（如 react, ssr, vue）…"
      />
      <p className="text-xs text-muted-foreground">
        当前选定: <span className="font-mono font-medium text-foreground">{value || "未选择"}</span>
      </p>
    </div>
  )
}
