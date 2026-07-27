"use client"

import * as React from "react"

import { Checkbox } from "@/registry/ui/checkbox"

export default function CheckboxDemo() {
  const [selected, setSelected] = React.useState(["icloud", "handoff"])
  const options = [
    ["icloud", "Sync settings with iCloud"],
    ["handoff", "Allow Handoff between devices"],
    ["analytics", "Share device analytics"],
  ]

  return (
    <div className="w-full max-w-sm divide-y border-y">
      {options.map(([value, label]) => {
        const checked = selected.includes(value)
        return (
          <label key={value} className="flex cursor-pointer items-center gap-3 py-3.5 text-sm">
            <Checkbox
              checked={checked}
              onCheckedChange={(next) =>
                setSelected((current) =>
                  next ? [...current, value] : current.filter((item) => item !== value)
                )
              }
            />
            <span>{label}</span>
          </label>
        )
      })}
    </div>
  )
}
