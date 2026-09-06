import { ArrowRight, Sparkles, Terminal } from "lucide-react"

import { Badge } from "@/registry/ui/badge"
import { Button } from "@/registry/ui/button"
import { AuroraBackground } from "@/registry/ui/aurora-background"

export default function AuroraBackgroundDemo() {
  return (
    <AuroraBackground
      className="relative w-full rounded-2xl border border-border bg-slate-950 p-8 text-white shadow-xl dark:border-border sm:p-14"
      colors={["#38bdf8", "#818cf8", "#34d399"]}
      blur={56}
      duration={16}
    >
      <div className="relative mx-auto flex max-w-2xl flex-col items-center text-center">
        <Badge
          variant="outline"
          className="mb-5 gap-1.5 border-white/20 bg-white/10 px-3 py-1 text-xs text-white backdrop-blur-md"
        >
          <Sparkles className="size-3.5 text-sky-300" />
          <span>WUI 2.0 Motion Release</span>
        </Badge>

        <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-5xl">
          Build interfaces that feel truly alive
        </h2>

        <p className="mt-4 max-w-lg text-sm leading-relaxed text-slate-300 sm:text-base">
          A motion-first component library engineered for modern web
          applications, reactive interactions, and refined aesthetics.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button
            size="lg"
            className="gap-2 bg-white font-medium text-slate-950 shadow-md hover:bg-slate-100"
          >
            Get Started
            <ArrowRight className="size-4" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="gap-2 border-white/25 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20"
          >
            <Terminal className="size-4" />
            CLI Quickstart
          </Button>
        </div>

        <div className="mt-12 grid w-full grid-cols-3 divide-x divide-white/15 border-t border-white/15 pt-6 text-left">
          <div className="px-3 first:pl-0">
            <div className="text-lg font-bold tracking-tight text-white sm:text-xl">
              100+
            </div>
            <div className="text-xs text-slate-300">UI Primitives</div>
          </div>
          <div className="px-3">
            <div className="text-lg font-bold tracking-tight text-white sm:text-xl">
              120 FPS
            </div>
            <div className="text-xs text-slate-300">GPU Accelerated</div>
          </div>
          <div className="px-3 last:pr-0">
            <div className="text-lg font-bold tracking-tight text-white sm:text-xl">
              0-Config
            </div>
            <div className="text-xs text-slate-300">Tailwind Native</div>
          </div>
        </div>
      </div>
    </AuroraBackground>
  )
}
