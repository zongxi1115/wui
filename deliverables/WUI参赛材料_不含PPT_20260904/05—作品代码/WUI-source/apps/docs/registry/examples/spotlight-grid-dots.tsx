import { TerminalIcon } from "lucide-react"

import { Button } from "@/registry/ui/button"
import { SpotlightGrid } from "@/registry/ui/spotlight-grid"

export default function SpotlightGridDots() {
  return (
    <SpotlightGrid
      pattern="dots"
      size={24}
      radius={200}
      patternColor="var(--primary)"
      baseOpacity={0.08}
      className="w-full max-w-xl rounded-2xl border bg-card p-6 shadow-md text-card-foreground"
    >
      <div className="flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <TerminalIcon className="size-5" />
        </div>
        <div>
          <h4 className="font-semibold text-foreground">
            Dot Matrix Spotlight
          </h4>
          <p className="text-xs text-muted-foreground">
            Move your cursor across this surface to illuminate radial matrix points.
          </p>
        </div>
      </div>

      <div className="mt-6 rounded-xl border bg-muted/40 p-4 font-mono text-xs text-muted-foreground">
        <span className="text-primary">$</span> pnpm add @wui-design/cli@latest
        <br />
        <span className="text-emerald-600 dark:text-emerald-400">✓</span> Initialized WUI engine in 42ms
      </div>

      <div className="mt-4 flex justify-end">
        <Button size="sm" variant="outline">
          Inspect Node
        </Button>
      </div>
    </SpotlightGrid>
  )
}
