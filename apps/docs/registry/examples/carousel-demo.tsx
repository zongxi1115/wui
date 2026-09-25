import {
  Carousel,
  CarouselContent,
  CarouselDots,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/registry/ui/carousel"

const slides = [
  {
    image: "/wui/demo/field-notes/coastal-hill.jpg",
    title: "海岸线徒步",
    meta: "舟山 · 东极岛",
  },
  {
    image: "/wui/demo/field-notes/silver-grass.jpg",
    title: "秋日芒草坡",
    meta: "杭州 · 安吉",
  },
  {
    image: "/wui/demo/field-notes/cliff-horizon.jpg",
    title: "悬崖日落",
    meta: "大连 · 金石滩",
  },
  {
    image: "/wui/demo/field-notes/storm-cliffs.jpg",
    title: "风暴过境后的海岬",
    meta: "青岛 · 崂山",
  },
]

export default function CarouselDemo() {
  return (
    <Carousel className="w-full max-w-xl" aria-label="本周精选摄影">
      <div className="relative">
        <CarouselContent className="rounded-lg">
          {slides.map((slide, index) => (
            <CarouselItem key={slide.title} aria-label={`${index + 1} / ${slides.length}`}>
              <figure>
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="aspect-[16/10] w-full rounded-lg object-cover"
                />
                <figcaption className="mt-3 flex items-baseline justify-between gap-4 px-0.5">
                  <span className="text-sm font-medium">{slide.title}</span>
                  <span className="text-muted-foreground text-xs">
                    {slide.meta}
                  </span>
                </figcaption>
              </figure>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="top-[calc((100%-2rem)/2)] size-8" />
        <CarouselNext className="top-[calc((100%-2rem)/2)] size-8" />
      </div>
      <CarouselDots className="mt-2" />
    </Carousel>
  )
}
