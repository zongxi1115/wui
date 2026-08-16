import { ArrowDown, CheckCircle2, Cpu, Layers, Zap } from "lucide-react"

import { Badge } from "@/registry/ui/badge"
import { SmoothScroll } from "@/registry/ui/smooth-scroll"

const chapters = [
  {
    badge: "CHAPTER 01",
    title: "Inertial Physics & Kinetic Scroll",
    description:
      "Lenis-powered spring interpolation transforms browser scrolling into a fluid, tactile journey across your digital surface.",
    tag: "Sub-pixel Precision",
    image: "https://picsum.photos/seed/kinetic-motion/900/450",
    icon: Zap,
  },
  {
    badge: "CHAPTER 02",
    title: "Composable Spatial Primitives",
    description:
      "Stack, expand, and sequence visual layers effortlessly with absolute coordinate synchronization.",
    tag: "Zero Layout Shift",
    image: "https://picsum.photos/seed/spatial-arch/900/450",
    icon: Layers,
  },
  {
    badge: "CHAPTER 03",
    title: "Hardware Accelerated 120 FPS",
    description:
      "Pure GPU transforms and passive event listeners deliver consistent 120 FPS rendering without frame dropping.",
    tag: "Under 1ms Overhead",
    image: "https://picsum.photos/seed/hardware-gpu/900/450",
    icon: Cpu,
  },
]

export default function SmoothScrollDemo() {
  return (
    <SmoothScroll
      root={false}
      options={{ duration: 1.2, smoothWheel: true }}
      className="h-[32rem] w-full overflow-y-auto rounded-2xl border border-border bg-card text-card-foreground shadow-lg [scrollbar-width:thin]"
    >
      <div className="p-6 sm:p-8">
        <div className="mb-6 flex items-center justify-between border-b border-border pb-4">
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-sky-500" />
            <span className="text-xs font-semibold text-foreground">
              SmoothScroll Engine
            </span>
          </div>
          <div className="flex items-center gap-1 text-xs text-sky-600 dark:text-sky-400">
            <span>Scroll inside</span>
            <ArrowDown className="size-3.5 animate-bounce" />
          </div>
        </div>

        <div className="space-y-8 pb-8">
          {chapters.map((item, idx) => {
            const Icon = item.icon
            return (
              <div
                key={item.title}
                className="overflow-hidden rounded-xl border border-border bg-muted/30 shadow-xs transition-shadow hover:shadow-md"
              >
                <div className="relative h-48 w-full overflow-hidden sm:h-56">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="size-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3 flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className="border-white/30 bg-black/40 text-xs text-white backdrop-blur-md"
                    >
                      <Icon className="size-3 text-sky-300" />
                      {item.badge}
                    </Badge>
                  </div>
                  <span className="absolute bottom-3 right-3 font-mono text-xs text-white drop-shadow">
                    0{idx + 1} / 03
                  </span>
                </div>

                <div className="p-5">
                  <h4 className="text-lg font-semibold text-foreground">
                    {item.title}
                  </h4>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                    {item.description}
                  </p>

                  <div className="mt-4 flex items-center gap-2 border-t border-border pt-3 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="size-3.5" />
                    <span>{item.tag}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </SmoothScroll>
  )
}
