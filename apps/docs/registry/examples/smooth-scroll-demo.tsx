import { SmoothScroll } from "@/registry/ui/smooth-scroll"

const chapters = [
  {
    number: "01",
    eyebrow: "The Atlantic edge",
    title: "Where stone learns the weather.",
    image: "/wui/demo/field-notes/dune-figure.jpg",
    position: "object-center",
  },
  {
    number: "02",
    eyebrow: "Walking north",
    title: "Follow the grass until the map goes quiet.",
    image: "/wui/demo/field-notes/silver-grass.jpg",
    position: "object-center",
  },
  {
    number: "03",
    eyebrow: "Shelter study",
    title: "Concrete, softened by rain.",
    image: "/wui/demo/field-notes/concrete-forest.jpg",
    position: "object-center",
  },
]

export default function SmoothScrollDemo() {
  return (
    <SmoothScroll
      root={false}
      options={{ duration: 1.05, smoothWheel: true }}
      className="h-[32rem] w-full max-w-3xl overflow-y-auto bg-[#171914] text-[#f5f1e8]"
    >
      {chapters.map((chapter, index) => (
        <section
          key={chapter.number}
          className="relative min-h-[30rem] overflow-hidden"
        >
          <img
            src={chapter.image}
            alt="Atlantic field journal landscape"
            className={`absolute inset-0 size-full object-cover ${chapter.position}`}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/5 to-black/75" />
          <div className="relative flex min-h-[30rem] flex-col justify-between p-6 sm:p-9">
            <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.28em]">
              <span>{chapter.eyebrow}</span>
              <span>{chapter.number} / 03</span>
            </div>
            <div
              className={
                index === 1 ? "ml-auto max-w-md text-right" : "max-w-lg"
              }
            >
              <h3 className="font-serif text-4xl leading-[0.92] tracking-[-0.045em] sm:text-6xl">
                {chapter.title}
              </h3>
              <div
                className={`mt-5 h-px w-20 bg-current ${index === 1 ? "ml-auto" : ""}`}
              />
            </div>
          </div>
        </section>
      ))}
    </SmoothScroll>
  )
}
