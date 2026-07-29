import { ArrowUpRightIcon } from "lucide-react"

import { SpotlightCard } from "@/registry/ui/spotlight-card"

const chapters = [
  { number: "01", name: "Wind over dunes", meta: "12 frames" },
  { number: "02", name: "The ochre headland", meta: "08 frames" },
  { number: "03", name: "Shelter in rain", meta: "16 frames" },
]

export default function SpotlightCardDemo() {
  return (
    <SpotlightCard
      className="relative w-full max-w-3xl overflow-hidden bg-[#171b18] text-[#f5f0e5]"
      color="oklch(0.92 0.08 110 / 0.2)"
      radius={280}
    >
      <div className="grid min-h-[27rem] sm:grid-cols-[0.9fr_1.1fr]">
        <div className="flex flex-col justify-between p-6 sm:p-8">
          <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.25em]">
            <span>Field index</span>
            <ArrowUpRightIcon className="size-4" />
          </div>
          <h3 className="font-serif text-5xl leading-[0.9] tracking-[-0.05em]">
            A small archive of open air.
          </h3>
          <p className="text-xs text-white/55">
            Move across the surface to reveal the light.
          </p>
        </div>
        <div className="relative m-4 min-h-64 overflow-hidden rounded-t-[9rem] sm:m-6">
          <img
            src="/wui/demo/field-notes/silver-grass.jpg"
            alt="A walker in silver grass"
            className="absolute inset-0 size-full object-cover"
          />
          <div className="absolute inset-x-4 bottom-4 bg-[#171b18]/80 px-4 backdrop-blur-sm">
            {chapters.map((chapter) => (
              <div
                key={chapter.number}
                className="grid grid-cols-[2rem_1fr_auto] items-center border-b border-white/20 py-3 text-xs last:border-0"
              >
                <span className="text-white/45">{chapter.number}</span>
                <span>{chapter.name}</span>
                <span className="text-[10px] uppercase tracking-wider text-white/45">
                  {chapter.meta}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SpotlightCard>
  )
}
