import { TiltCard } from "@/registry/ui/tilt-card"

export default function TiltCardDemo() {
  return (
    <div className="grid min-h-[430px] w-full place-items-center bg-[#d9d5ca] [perspective:1000px]">
      <TiltCard
        maxTilt={8}
        hoverScale={1.025}
        glare
        className="relative h-[22rem] w-64 overflow-hidden rounded-t-[8rem] bg-[#1b211d] text-white"
      >
        <img
          src="/wui/demo/field-notes/coastal-hill.jpg"
          alt="A figure crossing a coastal hill"
          className="absolute inset-0 size-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/10" />
        <div className="relative flex h-full flex-col justify-between p-5 [transform:translateZ(30px)]">
          <div className="flex justify-between text-[10px] uppercase tracking-[0.22em]">
            <span>Westward</span>
            <span>04 / 26</span>
          </div>
          <div>
            <p className="font-serif text-4xl italic leading-none">
              The last ridge.
            </p>
            <p className="mt-3 text-[10px] uppercase tracking-[0.22em] text-white/70">
              Move across the terrain
            </p>
          </div>
        </div>
      </TiltCard>
    </div>
  )
}
