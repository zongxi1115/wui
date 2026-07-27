"use client"

import * as React from "react"

import { Components } from "@/registry/__components__"
import { CopyButton } from "@/components/copy-button"
import { cn } from "@/registry/lib/utils"

export function ComponentPreviewClient({
  name,
  html,
  raw,
  className,
}: {
  name: string
  html: string
  raw: string
  className?: string
}) {
  const [tab, setTab] = React.useState<"preview" | "code">("preview")
  const Comp = Components[name]

  return (
    <div className={cn("my-6", className)}>
      <div className="flex items-center gap-1 border-b">
        <TabButton active={tab === "preview"} onClick={() => setTab("preview")}>
          Preview
        </TabButton>
        <TabButton active={tab === "code"} onClick={() => setTab("code")}>
          Code
        </TabButton>
      </div>

      {tab === "preview" ? (
        <div className="flex min-h-[350px] w-full items-center justify-center rounded-b-lg border border-t-0 p-10">
          <React.Suspense
            fallback={
              <span className="text-sm text-muted-foreground">Loading…</span>
            }
          >
            {Comp ? (
              <Comp />
            ) : (
              <p className="text-sm text-destructive">
                Unknown preview: <code>{name}</code>
              </p>
            )}
          </React.Suspense>
        </div>
      ) : (
        <div className="wui-code not-prose group relative">
          <CopyButton value={raw} />
          <div
            className="max-h-[600px] overflow-auto rounded-b-lg border border-t-0 text-sm [&_pre]:m-0 [&_pre]:p-4 [&_pre]:leading-relaxed"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>
      )}
    </div>
  )
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "relative px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground",
        active &&
          "text-foreground after:absolute after:inset-x-0 after:-bottom-px after:h-0.5 after:bg-foreground"
      )}
    >
      {children}
    </button>
  )
}
