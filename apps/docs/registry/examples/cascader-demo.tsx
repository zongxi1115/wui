"use client"

import * as React from "react"
import { MapPinIcon } from "lucide-react"

import { Cascader, type CascaderOption } from "@/registry/ui/cascader"

const locations: CascaderOption[] = [
  {
    value: "china",
    label: "China",
    children: [
      {
        value: "zhejiang",
        label: "Zhejiang",
        children: [
          { value: "hangzhou", label: "Hangzhou" },
          { value: "ningbo", label: "Ningbo" },
          { value: "wenzhou", label: "Wenzhou" },
        ],
      },
      {
        value: "jiangsu",
        label: "Jiangsu",
        children: [
          { value: "nanjing", label: "Nanjing" },
          { value: "suzhou", label: "Suzhou" },
        ],
      },
    ],
  },
  {
    value: "japan",
    label: "Japan",
    children: [
      {
        value: "kanto",
        label: "Kanto",
        children: [
          { value: "tokyo", label: "Tokyo" },
          { value: "yokohama", label: "Yokohama" },
        ],
      },
      {
        value: "kansai",
        label: "Kansai",
        children: [
          { value: "osaka", label: "Osaka" },
          { value: "kyoto", label: "Kyoto" },
        ],
      },
    ],
  },
]

export default function CascaderDemo() {
  const [value, setValue] = React.useState(["china", "zhejiang", "hangzhou"])

  return (
    <div className="grid w-full max-w-md gap-3">
      <div className="flex items-center gap-2.5">
        <span className="bg-accent flex size-8 items-center justify-center rounded-lg">
          <MapPinIcon className="size-4" />
        </span>
        <div>
          <p className="text-sm font-semibold">Delivery region</p>
          <p className="text-muted-foreground text-xs">
            Choose a country, region, and city
          </p>
        </div>
      </div>
      <Cascader
        options={locations}
        value={value}
        onValueChange={setValue}
        placeholder="Choose a delivery region"
      />
    </div>
  )
}
