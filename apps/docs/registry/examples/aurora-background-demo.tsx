import { AuroraBackground } from "@/registry/ui/aurora-background"

export default function AuroraBackgroundDemo() {
  return (
    <AuroraBackground className="relative min-h-[30rem] w-full max-w-4xl overflow-hidden text-white">
      <div className="relative grid min-h-[30rem] items-center gap-7 p-7 sm:grid-cols-[1.1fr_0.9fr] sm:p-10">
        <div>
          <p className="text-[10px] uppercase tracking-[0.28em] text-white/55">
            After weather / 22:18
          </p>
          <h3 className="mt-6 max-w-xl font-serif text-5xl leading-[0.88] tracking-[-0.055em] sm:text-7xl">
            Night carries its own horizon.
          </h3>
          <p className="mt-7 max-w-sm text-sm leading-6 text-white/60">
            Slow colour fields turn an empty background into atmosphere without
            competing with the story.
          </p>
        </div>
        <div className="relative mx-auto h-72 w-44 overflow-hidden rounded-[50%] border border-white/20 sm:h-80 sm:w-52">
          <img
            src="/wui/demo/field-notes/aerial-coast.jpg"
            alt="Rock island seen from above at dusk"
            className="size-full object-cover opacity-80 mix-blend-luminosity"
          />
        </div>
      </div>
    </AuroraBackground>
  )
}
