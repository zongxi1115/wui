import { Glow } from "@/registry/ui/glow"

export default function GlowDemo() {
  return (
    <div className="flex min-h-72 w-full flex-wrap items-center justify-center gap-10 px-8 py-10">
      <Glow spread={20} borderWidth={2} className="rounded-xl">
        <div className="bg-background w-60 rounded-xl px-6 py-5">
          <p className="font-medium">Rainbow edge</p>
          <p className="text-muted-foreground mt-1 text-sm leading-6">
            A color line travels around all four sides.
          </p>
        </div>
      </Glow>
      <Glow
        variant="solid"
        color="oklch(0.72 0.19 264)"
        spread={20}
        className="rounded-xl"
      >
        <div className="bg-background w-60 rounded-xl border px-6 py-5">
          <p className="font-medium">Solid glow</p>
          <p className="text-muted-foreground mt-1 text-sm leading-6">
            The original single-color pulse remains available.
          </p>
        </div>
      </Glow>
    </div>
  )
}
