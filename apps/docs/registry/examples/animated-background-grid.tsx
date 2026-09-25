"use client"

import * as React from "react"

import { AnimatedBackground } from "@/registry/ui/animated-background"

const regions = [
  { id: "cn-east", name: "华东 1", city: "杭州", latency: "12 ms" },
  { id: "cn-north", name: "华北 2", city: "北京", latency: "28 ms" },
  { id: "cn-south", name: "华南 1", city: "深圳", latency: "31 ms" },
  { id: "cn-west", name: "西南 1", city: "成都", latency: "44 ms" },
  { id: "hk", name: "中国香港", city: "香港", latency: "52 ms" },
  { id: "sg", name: "新加坡", city: "新加坡", latency: "86 ms" },
]

export default function AnimatedBackgroundGrid() {
  const [region, setRegion] = React.useState("cn-east")
  const selected = regions.find((item) => item.id === region)

  return (
    <div className="flex w-full max-w-md flex-col gap-3">
      <div
        role="group"
        aria-label="部署地域"
        className="grid grid-cols-2 gap-1 rounded-lg border p-1 sm:grid-cols-3"
      >
        <AnimatedBackground
          value={region}
          onValueChange={setRegion}
          highlightClassName="rounded-md border border-border bg-background shadow-xs"
        >
          {regions.map((item) => (
            <button
              key={item.id}
              data-id={item.id}
              type="button"
              aria-pressed={region === item.id}
              className="flex flex-col items-start gap-0.5 rounded-md px-3 py-2 text-left outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
            >
              <span className="text-sm font-medium text-foreground">
                {item.name}
              </span>
              <span className="text-xs text-muted-foreground">
                {item.city} · {item.latency}
              </span>
            </button>
          ))}
        </AnimatedBackground>
      </div>
      <p className="text-xs text-muted-foreground">
        新实例将部署在 {selected?.name}，可在创建后迁移。
      </p>
    </div>
  )
}
