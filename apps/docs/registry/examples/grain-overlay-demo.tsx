import { GrainOverlay } from "@/registry/ui/grain-overlay"

export default function GrainOverlayDemo() {
  return (
    <div className="relative min-h-[29rem] w-full max-w-3xl overflow-hidden bg-[#9d4b31] text-[#f3eadb]">
      <img
        src="/wui/demo/field-notes/cliff-horizon.jpg"
        alt="Sun-washed cliffs printed with grain"
        className="absolute inset-0 size-full object-cover mix-blend-multiply"
      />
      <div className="absolute inset-0 bg-[#a64f33]/35" />
      <GrainOverlay opacity={0.3} blendMode="multiply" />
      <div className="relative flex min-h-[29rem] flex-col justify-between p-6 sm:p-9">
        <div className="flex justify-between text-[10px] uppercase tracking-[0.26em]">
          <span>Field print</span>
          <span>No. 08</span>
        </div>
        <div className="grid items-end gap-6 sm:grid-cols-[1.2fr_0.8fr]">
          <h3 className="font-serif text-6xl leading-[0.82] tracking-[-0.06em] sm:text-7xl">
            Salt,
            <br />
            stone,
            <br />
            <span className="italic">signal.</span>
          </h3>
          <p className="border-current/50 border-l pl-4 text-sm leading-6">
            Grain makes the photograph feel handled, printed, and carried home.
          </p>
        </div>
      </div>
    </div>
  )
}
