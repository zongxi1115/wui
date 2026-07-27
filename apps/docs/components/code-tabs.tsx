"use client"

import * as React from "react"

import { CopyButton } from "@/components/copy-button"
import { cn } from "@/registry/lib/utils"

const RUNNERS = {
  pnpm: (cmd: string) => `pnpm dlx ${cmd}`,
  npm: (cmd: string) => `npx ${cmd}`,
  yarn: (cmd: string) => `yarn dlx ${cmd}`,
  bun: (cmd: string) => `bunx ${cmd}`,
} as const

type PackageManager = keyof typeof RUNNERS

/**
 * Renders a runnable command across package managers, e.g.
 * `<CodeTabs command="wui@latest add @wui/button" />`.
 */
export function CodeTabs({ command }: { command: string }) {
  const [pm, setPm] = React.useState<PackageManager>("pnpm")
  const full = RUNNERS[pm](command)

  return (
    <div className="wui-code not-prose group relative my-6 overflow-hidden rounded-lg border">
      <div className="flex items-center gap-1 border-b bg-muted/40 px-2">
        {(Object.keys(RUNNERS) as PackageManager[]).map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => setPm(k)}
            className={cn(
              "px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground",
              pm === k && "text-foreground"
            )}
          >
            {k}
          </button>
        ))}
      </div>
      <CopyButton value={full} />
      <pre className="overflow-x-auto p-4 text-sm">
        <code className="font-mono">{full}</code>
      </pre>
    </div>
  )
}
