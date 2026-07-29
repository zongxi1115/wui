import { SpotlightGrid } from "@/registry/ui/spotlight-grid"

export default function SpotlightGridDemo() {
  return (
    <SpotlightGrid
      className="relative min-h-[30rem] w-full max-w-4xl overflow-hidden bg-[#111512] text-[#d5ddc9]"
      patternColor="#c8d3bc"
      baseOpacity={0.045}
      radius={220}
    >
      <div className="grid min-h-[30rem] items-center gap-8 p-7 sm:grid-cols-[0.9fr_1.1fr] sm:p-10">
        <div className="relative z-10">
          <p className="text-[10px] uppercase tracking-[0.27em] text-white/45">
            Hidden structure
          </p>
          <h3 className="mt-6 font-serif text-5xl leading-[0.9] tracking-[-0.05em] text-[#f2eee3] sm:text-6xl">
            The route appears under light.
          </h3>
          <p className="mt-6 max-w-xs text-sm leading-6 text-white/50">
            Move across the field to expose the coordinate system beneath the
            journey.
          </p>
        </div>
        <div className="relative h-72 overflow-hidden rounded-bl-[10rem] rounded-tr-[10rem] opacity-75 mix-blend-luminosity sm:h-80">
          <img
            src="/wui/demo/field-notes/white-stairs.jpg"
            alt="White stairs forming a geometric route"
            className="size-full object-cover"
          />
        </div>
      </div>
    </SpotlightGrid>
  )
}
