"use client"

import * as React from "react"
import { CheckIcon, CopyIcon } from "lucide-react"

import { cn } from "@/registry/lib/utils"

export function CopyButton({
  value,
  className,
}: {
  value: string
  className?: string
}) {
  const [copied, setCopied] = React.useState(false)

  return (
    <button
      type="button"
      aria-label="Copy to clipboard"
      onClick={() => {
        void navigator.clipboard.writeText(value)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      }}
      className={cn(
        "absolute right-3 top-3 z-10 inline-flex size-7 items-center justify-center rounded-md border bg-background text-muted-foreground opacity-0 transition hover:text-foreground focus-visible:opacity-100 group-hover:opacity-100 [&_svg]:size-3.5",
        className
      )}
    >
      {copied ? <CheckIcon /> : <CopyIcon />}
    </button>
  )
}
