import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/registry/ui/carousel"

export default function CarouselVertical() {
  return (
    <Carousel
      orientation="vertical"
      loop
      className="w-full max-w-sm"
      aria-label="更新记录"
    >
      <CarouselContent className="h-72 rounded-xl border">
        {["建立组件清单", "实现基础能力", "同步 registry"].map(
          (item, index) => (
            <CarouselItem key={item}>
              <div className="flex h-full items-center justify-center px-12 text-center">
                <div>
                  <span className="text-muted-foreground text-xs tabular-nums">
                    0{index + 1}
                  </span>
                  <p className="mt-2 text-lg font-semibold">{item}</p>
                </div>
              </div>
            </CarouselItem>
          )
        )}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  )
}
