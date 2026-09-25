import { Badge } from "@/registry/ui/badge"
import {
  Carousel,
  CarouselContent,
  CarouselDots,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/registry/ui/carousel"

const routes = [
  {
    title: "东极岛环岛海岸线",
    tag: "轻徒步",
    days: "2 天 1 晚",
    distance: "14 km",
    image: "/wui/demo/field-notes/coastal-hill.jpg",
  },
  {
    title: "安吉芒草坡日落线",
    tag: "摄影",
    days: "1 天",
    distance: "6 km",
    image: "/wui/demo/field-notes/silver-grass.jpg",
  },
  {
    title: "城市混凝土建筑漫步",
    tag: "城市",
    days: "半天",
    distance: "4 km",
    image: "/wui/demo/field-notes/concrete-stairs.jpg",
  },
  {
    title: "金石滩悬崖观景步道",
    tag: "进阶",
    days: "1 天",
    distance: "11 km",
    image: "/wui/demo/field-notes/cliff-horizon.jpg",
  },
  {
    title: "鸣沙山沙丘穿越",
    tag: "露营",
    days: "3 天 2 晚",
    distance: "22 km",
    image: "/wui/demo/field-notes/dune-figure.jpg",
  },
]

export default function CarouselCards() {
  return (
    <Carousel loop className="w-full max-w-3xl" aria-label="本周推荐路线">
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <h3 className="text-base font-semibold">本周推荐路线</h3>
          <p className="text-muted-foreground mt-1 text-sm">
            根据你收藏的目的地挑选，共 {routes.length} 条
          </p>
        </div>
        <div className="flex gap-2">
          <CarouselPrevious className="static size-8 translate-x-0 translate-y-0" />
          <CarouselNext className="static size-8 translate-x-0 translate-y-0" />
        </div>
      </div>

      <CarouselContent className="-ml-4">
        {routes.map((route) => (
          <CarouselItem
            key={route.title}
            className="pl-4 opacity-50 transition-opacity duration-300 data-[active]:opacity-100 sm:basis-1/2 lg:basis-1/3"
          >
            <article>
              <img
                src={route.image}
                alt={route.title}
                className="aspect-[4/3] w-full rounded-md object-cover"
              />
              <div className="mt-3 flex items-center gap-2">
                <Badge variant="secondary" size="sm">
                  {route.tag}
                </Badge>
                <span className="text-muted-foreground text-xs tabular-nums">
                  {route.days} · {route.distance}
                </span>
              </div>
              <h4 className="mt-1.5 truncate text-sm font-medium">
                {route.title}
              </h4>
            </article>
          </CarouselItem>
        ))}
      </CarouselContent>

      <CarouselDots className="mt-3" />
    </Carousel>
  )
}
