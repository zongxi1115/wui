import { ScrollSnap, ScrollSnapItem } from "@/registry/ui/scroll-snap"

const sections = [
  {
    number: "01",
    label: "Above",
    title: "The island holds its own weather.",
    image: "/wui/demo/field-notes/aerial-coast.jpg",
    align: "items-start text-left",
  },
  {
    number: "02",
    label: "Across",
    title: "A single figure gives the hill its scale.",
    image: "/wui/demo/field-notes/coastal-hill.jpg",
    align: "items-end text-right",
  },
  {
    number: "03",
    label: "Within",
    title: "Concrete becomes another kind of cliff.",
    image: "/wui/demo/field-notes/concrete-forest.jpg",
    align: "items-start text-left",
  },
]

export default function ScrollSnapDemo() {
  return (
    <ScrollSnap
      className="h-[32rem] w-full max-w-3xl bg-[#18201c]"
      hideScrollbar
    >
      {sections.map((section) => (
        <ScrollSnapItem
          key={section.number}
          stop
          className={`relative flex h-full flex-col justify-between overflow-hidden p-6 text-white sm:p-9 ${section.align}`}
        >
          <img
            src={section.image}
            alt={`${section.label} landscape study`}
            className="absolute inset-0 size-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/70" />
          <div className="relative flex w-full justify-between text-[10px] uppercase tracking-[0.27em]">
            <span>{section.label}</span>
            <span>{section.number} / 03</span>
          </div>
          <h3 className="relative max-w-lg font-serif text-4xl leading-[0.94] tracking-[-0.045em] sm:text-6xl">
            {section.title}
          </h3>
        </ScrollSnapItem>
      ))}
    </ScrollSnap>
  )
}
