"use client"

import * as React from "react"
import { CheckCircle2Icon, ShieldIcon, SparklesIcon, ZapIcon } from "lucide-react"

import { InView } from "@/registry/ui/in-view"

const features = [
  {
    icon: ZapIcon,
    title: "120 FPS Rendering",
    desc: "Physics-based springs running on GPU compositor threads.",
  },
  {
    icon: ShieldIcon,
    title: "Zero Layout Shift",
    desc: "Pre-measured geometric bounds prevent cumulative layout shift.",
  },
  {
    icon: SparklesIcon,
    title: "Tailwind v4 Native",
    desc: "Direct CSS variable hooks with full dark mode parity.",
  },
]

export default function InViewStagger() {
  const container = React.useRef<HTMLDivElement>(null)

  return (
    <div
      ref={container}
      className="relative h-96 w-full max-w-xl overflow-y-auto rounded-2xl border bg-card p-6 shadow-md [scrollbar-width:thin]"
    >
      <div className="text-center mb-6">
        <h4 className="text-base font-semibold text-foreground">
          Scroll Down to Trigger Cards
        </h4>
        <p className="text-xs text-muted-foreground">
          Cards animate in as they cross into the viewport intersection margin.
        </p>
      </div>

      <div className="h-48" />

      <div className="space-y-4">
        {features.map((f, index) => {
          const Icon = f.icon
          return (
            <InView
              key={f.title}
              transition={{ duration: 0.4, delay: index * 0.15 }}
              variants={{
                hidden: { opacity: 0, y: 24, scale: 0.95 },
                visible: { opacity: 1, y: 0, scale: 1 },
              }}
              viewOptions={{ margin: "-10% 0px" }}
              className="flex items-center gap-4 rounded-xl border bg-muted/30 p-4 shadow-xs"
            >
              <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon className="size-5" />
              </div>
              <div>
                <h5 className="text-sm font-semibold text-foreground">
                  {f.title}
                </h5>
                <p className="text-xs text-muted-foreground">{f.desc}</p>
              </div>
              <CheckCircle2Icon className="ml-auto size-4 text-emerald-500" />
            </InView>
          )
        })}
      </div>

      <div className="h-32" />
    </div>
  )
}
