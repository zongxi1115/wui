import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/registry/ui/carousel"

const slides = [
  { eyebrow: "本周重点", title: "统一结算流程", meta: "3 个任务进行中" },
  { eyebrow: "设计系统", title: "补齐基础组件", meta: "完成度 76%" },
  { eyebrow: "用户反馈", title: "优化图片预览", meta: "12 条反馈已处理" },
]

export default function CarouselDemo() {
  return (
    <Carousel className="w-full max-w-xl" aria-label="项目摘要">
      <CarouselContent className="rounded-xl border">
        {slides.map((slide, index) => (
          <CarouselItem key={slide.title}>
            <div className="flex min-h-64 flex-col justify-between p-8 sm:p-10">
              <span className="text-muted-foreground text-sm">
                {slide.eyebrow}
              </span>
              <div>
                <p className="text-2xl font-semibold tracking-tight">
                  {slide.title}
                </p>
                <p className="text-muted-foreground mt-2 text-sm">
                  {slide.meta} · {index + 1} / {slides.length}
                </p>
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  )
}
