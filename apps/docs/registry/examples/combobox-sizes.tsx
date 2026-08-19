"use client"

import * as React from "react"

import { Combobox } from "@/registry/ui/combobox"

const options = [
  { value: "github", label: "GitHub" },
  { value: "gitlab", label: "GitLab" },
  { value: "bitbucket", label: "Bitbucket" },
]

export default function ComboboxSizes() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <span className="text-xs font-medium text-muted-foreground">紧凑尺寸 (sm - 32px)</span>
        <Combobox
          size="sm"
          options={options}
          defaultValue="github"
          placeholder="选择平台"
          searchPlaceholder="搜索平台…"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <span className="text-xs font-medium text-muted-foreground">默认尺寸 (default - 40px)</span>
        <Combobox
          size="default"
          options={options}
          defaultValue="github"
          placeholder="选择平台"
          searchPlaceholder="搜索平台…"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <span className="text-xs font-medium text-muted-foreground">大尺寸 (lg - 48px)</span>
        <Combobox
          size="lg"
          options={options}
          defaultValue="github"
          placeholder="选择平台"
          searchPlaceholder="搜索平台…"
        />
      </div>
    </div>
  )
}
