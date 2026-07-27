"use client"

import * as React from "react"

import { RadioGroup, RadioGroupItem } from "@/registry/ui/radio-group"

export default function RadioGroupDemo() {
  const [value, setValue] = React.useState("automatic")
  const options = [
    ["automatic", "Automatic", "Adjust to the system appearance"],
    ["light", "Light", "Always use the light appearance"],
    ["dark", "Dark", "Always use the dark appearance"],
  ]

  return (
    <RadioGroup value={value} onValueChange={setValue} className="w-full max-w-sm divide-y border-y">
      {options.map(([optionValue, label, description]) => (
        <label key={optionValue} className="flex cursor-pointer items-center gap-3 py-3.5">
          <RadioGroupItem value={optionValue} />
          <span className="min-w-0">
            <span className="block text-sm font-medium">{label}</span>
            <span className="block text-xs text-muted-foreground">{description}</span>
          </span>
        </label>
      ))}
    </RadioGroup>
  )
}
