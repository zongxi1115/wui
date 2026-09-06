import { ArrowRightIcon, CheckCircle2Icon, SparklesIcon } from "lucide-react"

import { Button } from "@/registry/ui/button"
import { ShinyButton } from "@/registry/ui/shiny-button"

export default function ShinyButtonCardDemo() {
  return (
    <div className="flex w-full justify-center p-4 sm:p-8">
      <div className="border-border/80 bg-muted/20 w-full max-w-xl rounded-2xl border p-6 sm:p-8">
        <div className="flex items-center gap-2">
          <div className="bg-primary/10 text-primary flex size-8 items-center justify-center rounded-lg">
            <SparklesIcon className="size-4" />
          </div>
          <span className="font-mono text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Early Access · v4.2
          </span>
        </div>

        <h3 className="mt-4 text-xl font-bold tracking-tight sm:text-2xl">
          Supercharge your workflow with real-time intelligence
        </h3>

        <p className="mt-2 text-xs leading-relaxed text-muted-foreground sm:text-sm">
          Deploy production-grade LLM pipelines, autonomous tool agents, and
          distributed vector caches with one unified interface.
        </p>

        <div className="mt-6 space-y-2 border-t border-border/60 pt-5">
          <div className="flex items-center gap-2 text-xs">
            <CheckCircle2Icon className="size-4 text-emerald-500" />
            <span>Dedicated GPU clusters with sub-millisecond cold start</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <CheckCircle2Icon className="size-4 text-emerald-500" />
            <span>SOC2 Type II certified with zero-retention privacy mode</span>
          </div>
        </div>

        <div className="mt-7 flex flex-wrap items-center gap-3">
          <ShinyButton className="h-10 rounded-xl px-5 text-xs font-medium sm:text-sm">
            <SparklesIcon className="size-4" />
            Claim Early Access
            <ArrowRightIcon className="size-4" />
          </ShinyButton>
          <Button variant="outline" className="h-10 rounded-xl px-5 text-xs sm:text-sm">
            Schedule Architecture Review
          </Button>
        </div>
      </div>
    </div>
  )
}
