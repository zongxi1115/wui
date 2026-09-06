"use client"

import * as React from "react"

import { cn } from "@/registry/lib/utils"
import {
  EmptyStateIllustration,
  emptyStateClassicIllustrations,
  emptyStateColorIllustrations,
  type EmptyStateIllustrationVariant,
} from "@/registry/ui/empty-state"

const variants: Array<{
  value: EmptyStateIllustrationVariant
  label: string
  count: number
}> = [
  {
    value: "gradient",
    label: "渐变",
    count: emptyStateClassicIllustrations.length,
  },
  {
    value: "flat",
    label: "扁平",
    count: emptyStateClassicIllustrations.length,
  },
  { value: "color", label: "彩色", count: emptyStateColorIllustrations.length },
]

function IllustrationItem({
  name,
  children,
}: {
  name: string
  children: React.ReactNode
}) {
  return (
    <figure className="flex min-h-44 flex-col items-center justify-between gap-4 border-b border-r p-5">
      <div className="flex min-h-28 items-center justify-center">
        {children}
      </div>
      <figcaption className="text-muted-foreground max-w-full truncate font-mono text-[11px]">
        {name}
      </figcaption>
    </figure>
  )
}

export default function EmptyStateIllustrations() {
  const [variant, setVariant] =
    React.useState<EmptyStateIllustrationVariant>("gradient")

  return (
    <div className="w-full overflow-hidden border">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b px-4 py-3">
        <div>
          <p className="text-sm font-medium">空状态插画库</p>
          <p className="text-muted-foreground mt-0.5 text-xs">
            选择系列并复制插画名称用于 EmptyStateIllustration。
          </p>
        </div>
        <div className="bg-muted flex items-center gap-0.5 p-0.5">
          {variants.map((item) => (
            <button
              key={item.value}
              type="button"
              aria-pressed={variant === item.value}
              onClick={() => setVariant(item.value)}
              className={cn(
                "text-muted-foreground hover:text-foreground px-3 py-1.5 text-xs transition-colors",
                variant === item.value &&
                  "bg-background text-foreground shadow-xs"
              )}
            >
              {item.label} · {item.count}
            </button>
          ))}
        </div>
      </div>

      <div className="-mb-px -mr-px grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
        {variant === "color"
          ? emptyStateColorIllustrations.map((name) => (
              <IllustrationItem key={name} name={name}>
                <EmptyStateIllustration
                  variant="color"
                  name={name}
                  className="w-32"
                />
              </IllustrationItem>
            ))
          : emptyStateClassicIllustrations.map((name) => (
              <IllustrationItem key={name} name={name}>
                <EmptyStateIllustration
                  variant={variant}
                  name={name}
                  className="w-32"
                />
              </IllustrationItem>
            ))}
      </div>
    </div>
  )
}
