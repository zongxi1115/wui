import { ImageTrail } from "@/registry/ui/image-trail"

const trailItems = [
  <img
    key="dune"
    src="/wui/demo/field-notes/dune-figure.jpg"
    alt=""
    className="h-28 w-20 object-cover"
  />,
  <img
    key="cliff"
    src="/wui/demo/field-notes/cliff-horizon.jpg"
    alt=""
    className="h-20 w-32 object-cover"
  />,
  <img
    key="coast"
    src="/wui/demo/field-notes/aerial-coast.jpg"
    alt=""
    className="h-28 w-20 rounded-t-full object-cover"
  />,
  <img
    key="stairs"
    src="/wui/demo/field-notes/white-stairs.jpg"
    alt=""
    className="h-20 w-28 object-cover"
  />,
]

export default function ImageTrailDemo() {
  return (
    <ImageTrail
      items={trailItems}
      distance={58}
      lifetime={680}
      className="grid h-[30rem] w-full max-w-4xl place-items-center overflow-hidden bg-[#171b18] text-[#f5f0e5]"
      itemClassName="shadow-xl shadow-black/30"
    >
      <div className="pointer-events-none relative z-20 max-w-xl px-6 text-center">
        <p className="text-[10px] uppercase tracking-[0.28em] text-white/50">
          An atlas made by hand
        </p>
        <h3 className="mt-5 font-serif text-6xl leading-[0.88] tracking-[-0.055em] sm:text-7xl">
          Leave a trail through the landscape.
        </h3>
        <p className="mt-6 font-serif text-lg italic text-white/65">
          Move slowly. The coast remembers.
        </p>
      </div>
    </ImageTrail>
  )
}
