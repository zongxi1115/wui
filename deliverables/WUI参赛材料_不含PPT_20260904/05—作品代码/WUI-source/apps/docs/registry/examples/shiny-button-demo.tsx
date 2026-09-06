import {
  ArrowRightIcon,
  RocketIcon,
  SparklesIcon,
  TagIcon,
  ZapIcon,
} from "lucide-react"

import { ShinyButton } from "@/registry/ui/shiny-button"

export default function ShinyButtonDemo() {
  return (
    <div className="flex w-full flex-wrap items-center justify-center gap-4 p-4 sm:p-8">
      {/* 1. Flagship Primary CTA */}
      <ShinyButton className="shadow-primary/20 h-11 rounded-xl px-6 text-sm font-medium shadow-md">
        <SparklesIcon className="size-4" />
        Start Building Today
        <ArrowRightIcon className="size-4" />
      </ShinyButton>

      {/* 2. Sleek Dark Action */}
      <ShinyButton
        speed={2.5}
        gap={0.8}
        className="border-zinc-700/50 bg-zinc-900 text-zinc-100 shadow-xs hover:bg-zinc-800 dark:border-zinc-300/40 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
      >
        <ZapIcon className="size-4 text-amber-400 dark:text-amber-600" />
        Instant Deploy
      </ShinyButton>

      {/* 3. Pill Action */}
      <ShinyButton
        speed={3.5}
        gap={1.5}
        className="border-border/80 bg-secondary text-secondary-foreground hover:bg-accent h-8 rounded-full px-4 text-xs font-medium"
      >
        <TagIcon className="size-3.5 text-emerald-500" />
        v4.2 Available
      </ShinyButton>

      {/* 4. High-frequency Sweep */}
      <ShinyButton speed={1.8} gap={0.4}>
        <RocketIcon className="size-4" />
        Turbo Mode
      </ShinyButton>
    </div>
  )
}
