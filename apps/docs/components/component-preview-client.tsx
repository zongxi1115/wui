"use client"

import * as React from "react"
import { RotateCwIcon } from "lucide-react"

import { Components } from "@/registry/__components__"
import { CopyButton } from "@/components/copy-button"
import { cn } from "@/registry/lib/utils"

export function ComponentPreviewClient({
  name,
  html,
  raw,
  className,
  previewClassName,
}: {
  name: string
  html: string
  raw: string
  className?: string
  previewClassName?: string
}) {
  const [tab, setTab] = React.useState<"preview" | "code">("preview")
  const [key, setKey] = React.useState(0)
  const [spinning, setSpinning] = React.useState(false)
  const Comp = Components[name]

  return (
    <div className={cn("not-prose my-6", className)}>
      <div className="flex items-center gap-1 border-b">
        <TabButton active={tab === "preview"} onClick={() => setTab("preview")}>
          Preview
        </TabButton>
        <TabButton active={tab === "code"} onClick={() => setTab("code")}>
          Code
        </TabButton>
        {tab === "preview" && (
          <button
            type="button"
            aria-label="Reload preview"
            title="重新加载"
            onClick={() => {
              setKey((k) => k + 1)
              setSpinning(true)
            }}
            className="ml-auto mr-1 inline-flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground [&_svg]:size-3.5"
          >
            <RotateCwIcon
              className={cn(spinning && "animate-spin")}
              onAnimationIteration={() => setSpinning(false)}
            />
          </button>
        )}
      </div>

      {tab === "preview" ? (
        <div
          className={cn(
            "flex min-h-[350px] w-full items-center justify-center rounded-b-lg border border-t-0 p-10",
            previewClassName
          )}
        >
          <React.Suspense
            fallback={
              <span className="text-sm text-muted-foreground">Loading…</span>
            }
          >
            {Comp ? (
              <Comp key={key} />
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
