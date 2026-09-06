import { ArrowRightIcon, SparklesIcon } from "lucide-react"

import { AnnotationHighlight, AnnotationPath } from "@/registry/ui/annotation"
import { Badge } from "@/registry/ui/badge"
import { Button } from "@/registry/ui/button"

export default function AnnotationDemo() {
  return (
    <div className="flex w-full items-center justify-center px-4 py-8 sm:px-8">
      <div className="relative w-full max-w-xl">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="font-mono text-xs">
            v4.2 Update
          </Badge>
          <span className="text-muted-foreground text-xs font-medium tracking-wide">
            Design Systems & UX
          </span>
        </div>

        <h3 className="mt-4 text-2xl font-semibold leading-snug tracking-tight sm:text-3xl">
          Make key actions feel{" "}
          <AnnotationHighlight>intuitive</AnnotationHighlight>, not complicated.
        </h3>

        <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
          Guide user focus naturally with animated vector paths, marker sweeps,
          and{" "}
          <AnnotationHighlight
            variant="rough"
            color="oklch(0.85 0.15 155 / 0.45)"
            delay={0.25}
          >
            hand-drawn accents
          </AnnotationHighlight>{" "}
          that emphasize without overwhelming.
        </p>

        {/* Feature showcase card */}
        <div className="border-border/80 bg-muted/20 mt-8 rounded-2xl border p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="bg-primary/10 text-primary flex size-8 items-center justify-center rounded-lg">
                <SparklesIcon className="size-4" />
              </div>
              <div>
                <p className="text-sm font-semibold">Adaptive Engine</p>
                <p className="text-muted-foreground text-xs">
                  Zero-latency inference pipeline
                </p>
              </div>
            </div>

            {/* Custom circled badge */}
            <div className="relative inline-flex items-center">
              <span className="relative z-10 px-3 py-1 font-mono text-[11px] font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                2.4x Speedup
              </span>
              <AnnotationPath
                path="M6 16C12 4 78 2 108 12C124 21 105 32 55 31C18 31 1 25 6 16Z"
                viewBox="0 0 116 36"
                arrow={false}
                color="oklch(0.75 0.18 55)"
                strokeWidth={2}
                duration={0.9}
                delay={0.4}
                className="absolute inset-0 size-full"
              />
            </div>
          </div>

          <div className="border-border/60 mt-6 flex flex-col justify-between gap-4 border-t pt-5 sm:flex-row sm:items-center">
            <div className="text-muted-foreground text-xs">
              <span className="text-foreground font-medium">99.98%</span> uptime
              verified across 12 clusters
            </div>

            {/* CTA action with pointing arrow */}
            <div className="relative flex items-center self-end sm:self-auto">
              <span className="text-muted-foreground absolute -top-5 right-20 hidden font-mono text-[11px] sm:inline-block">
                Start here
              </span>
              <AnnotationPath
                path="M5 45C22 45 28 16 68 18"
                viewBox="0 0 75 52"
                strokeWidth={2.5}
                color="oklch(0.6 0.18 25)"
                delay={0.5}
                duration={0.7}
                className="absolute -top-4 right-[92%] hidden h-10 w-16 sm:block"
              />
              <Button size="sm" className="gap-2">
                Deploy Node
                <ArrowRightIcon className="size-3.5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
