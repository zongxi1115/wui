"use client"

import * as React from "react"
import { SearchIcon, XIcon } from "lucide-react"

import { Input } from "@/registry/ui/input"
import { Kbd, KbdGroup } from "@/registry/ui/kbd"

export default function InputDemo() {
  const [value, setValue] = React.useState("")

  return (
    <div className="w-full max-w-sm">
      <label
        htmlFor="spotlight-search"
        className="mb-2 block text-[13px] font-medium text-foreground/80"
      >
        Quick search
      </label>
      <Input
        id="spotlight-search"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Search projects, people, or files"
        visualSize="lg"
        wrapperClassName="h-11 rounded-xl border-border/60 bg-muted/45 shadow-none hover:bg-muted/60 focus-within:border-foreground/20 focus-within:bg-background focus-within:ring-[3px] focus-within:ring-foreground/8"
        className="text-[15px] placeholder:text-muted-foreground/65"
        startContent={<SearchIcon strokeWidth={1.75} />}
        endContent={
          value ? (
            <button
              type="button"
              className="rounded-full bg-muted-foreground/15 p-1 text-muted-foreground transition-colors hover:bg-muted-foreground/25 hover:text-foreground"
              onClick={() => setValue("")}
              aria-label="Clear search"
            >
              <XIcon strokeWidth={2.25} />
            </button>
          ) : (
            <KbdGroup aria-label="Shortcut: Command K">
              <Kbd
                size="sm"
                className="min-h-6 min-w-0 rounded-md border-foreground/10 bg-muted/70 px-1.5 font-mono text-[11px] font-normal tracking-tight text-muted-foreground"
              >
                ⌘ K
              </Kbd>
            </KbdGroup>
          )
        }
      />
      <p className="mt-2.5 text-xs text-muted-foreground/80">
        Results update instantly as you type.
      </p>
    </div>
  )
}
