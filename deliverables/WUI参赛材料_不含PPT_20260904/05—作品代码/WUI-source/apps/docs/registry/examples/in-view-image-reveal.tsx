import { InView } from "@/registry/ui/in-view"

const variants = {
  hidden: { clipPath: "inset(0 0 100% 0 round 999px 999px 0 0)" },
  visible: { clipPath: "inset(0 0 0% 0 round 999px 999px 0 0)" },
}

export default function InViewImageReveal() {
  return (
    <div className="grid w-full max-w-3xl items-center gap-7 bg-[#d9d5ca] p-6 text-[#20211d] sm:grid-cols-[0.8fr_1.2fr] sm:p-9">
      <div>
        <p className="text-[10px] uppercase tracking-[0.27em]">
          First light / 05:42
        </p>
        <h3 className="mt-6 font-serif text-5xl leading-[0.9] tracking-[-0.05em]">
          The day arrives from below.
        </h3>
        <p className="mt-6 max-w-xs text-sm leading-6 text-[#55594f]">
          A vertical mask follows the way the eye climbs a landscape.
        </p>
      </div>
      <InView
        variants={variants}
        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        className="relative h-[24rem] overflow-hidden rounded-t-[12rem]"
      >
        <img
          src="/wui/demo/field-notes/storm-cliffs.jpg"
          alt="Coastal cliffs revealed from below"
          className="size-full object-cover"
        />
        <p className="absolute bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] uppercase tracking-[0.25em] text-white">
          Atlantic / North
        </p>
      </InView>
    </div>
  )
}
