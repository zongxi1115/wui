import { ArrowUpRightIcon, SparklesIcon } from "lucide-react"

import { Button } from "@/registry/ui/button"
import { AuroraBackground } from "@/registry/ui/aurora-background"

export default function AuroraBackgroundCard() {
  return (
    <div className="w-full max-w-md p-4">
      <AuroraBackground
        className="rounded-3xl border border-border bg-slate-950 p-6 text-white shadow-2xl"
        colors={["#ec4899", "#8b5cf6", "#3b82f6"]}
        blur={48}
        duration={12}
      >
        <div className="flex items-center justify-between">
          <div className="flex size-9 items-center justify-center rounded-xl bg-white/10 text-pink-300 backdrop-blur-md">
            <SparklesIcon className="size-4" />
          </div>
          <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 font-mono text-[10px] uppercase text-white/90 backdrop-blur-md">
            PRO EDITION
          </span>
        </div>

        <div className="mt-8">
          <h3 className="text-xl font-bold tracking-tight text-white">
            Generative AI Engine
          </h3>
          <p className="mt-1.5 text-xs leading-relaxed text-slate-300">
            Real-time inference acceleration with native tensor graph compilation.
          </p>
        </div>

        <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-4">
          <div>
            <div className="text-[10px] uppercase text-slate-400">Starting at</div>
            <div className="text-lg font-bold text-white">$49 / mo</div>
          </div>
          <Button
            size="sm"
            className="bg-white font-semibold text-slate-950 hover:bg-slate-100"
          >
            Upgrade Plan
            <ArrowUpRightIcon className="ml-1 size-3.5" />
          </Button>
        </div>
      </AuroraBackground>
    </div>
  )
}
