import { TextShimmer } from "@/registry/ui/text-shimmer"

export default function TextShimmerColors() {
  return (
    <div className="flex w-full max-w-xl flex-col gap-5 rounded-xl border border-border bg-card p-6 shadow-xs">
      <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
        自定义微光色系 (Custom Color Palettes)
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {/* Emerald Glow */}
        <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-4">
          <span className="text-[10px] font-bold uppercase text-emerald-600 dark:text-emerald-400">
            Emerald Success
          </span>
          <div className="mt-1">
            <TextShimmer
              duration={1.8}
              spread={3}
              className="text-sm font-semibold [--shimmer-base:theme(colors.emerald.600)] [--shimmer-highlight:theme(colors.emerald.200)] dark:[--shimmer-base:theme(colors.emerald.400)] dark:[--shimmer-highlight:#ffffff]"
            >
              All nodes synchronized (0 errors)
            </TextShimmer>
          </div>
        </div>

        {/* Violet AI Aura */}
        <div className="rounded-lg border border-purple-500/20 bg-purple-500/5 p-4">
          <span className="text-[10px] font-bold uppercase text-purple-600 dark:text-purple-400">
            Violet Intelligence
          </span>
          <div className="mt-1">
            <TextShimmer
              duration={2}
              spread={3}
              className="text-sm font-semibold [--shimmer-base:theme(colors.purple.600)] [--shimmer-highlight:theme(colors.purple.200)] dark:[--shimmer-base:theme(colors.purple.400)] dark:[--shimmer-highlight:#ffffff]"
            >
              Reasoning model active
            </TextShimmer>
          </div>
        </div>

        {/* Amber Warning */}
        <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-4">
          <span className="text-[10px] font-bold uppercase text-amber-600 dark:text-amber-400">
            Amber Pending
          </span>
          <div className="mt-1">
            <TextShimmer
              duration={2.2}
              spread={3}
              className="text-sm font-semibold [--shimmer-base:theme(colors.amber.600)] [--shimmer-highlight:theme(colors.amber.200)] dark:[--shimmer-base:theme(colors.amber.400)] dark:[--shimmer-highlight:#ffffff]"
            >
              Awaiting human authorization...
            </TextShimmer>
          </div>
        </div>

        {/* Sky Blue Flow */}
        <div className="rounded-lg border border-sky-500/20 bg-sky-500/5 p-4">
          <span className="text-[10px] font-bold uppercase text-sky-600 dark:text-sky-400">
            Sky Streaming
          </span>
          <div className="mt-1">
            <TextShimmer
              duration={1.6}
              spread={3}
              className="text-sm font-semibold [--shimmer-base:theme(colors.sky.600)] [--shimmer-highlight:theme(colors.sky.200)] dark:[--shimmer-base:theme(colors.sky.400)] dark:[--shimmer-highlight:#ffffff]"
            >
              Streaming 1.2 MB / sec
            </TextShimmer>
          </div>
        </div>
      </div>
    </div>
  )
}
