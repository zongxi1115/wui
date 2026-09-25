import { MegaphoneIcon } from "lucide-react"

import {
  Carousel,
  CarouselContent,
  CarouselDots,
  CarouselItem,
} from "@/registry/ui/carousel"

const notices = [
  { date: "09-28", text: "数据库将于 02:00–04:00 例行维护，期间报表导出暂停" },
  { date: "09-26", text: "新版审批流已上线，支持按金额自动分配审批人" },
  { date: "09-24", text: "国庆期间客服工作时间调整为 09:00–18:00" },
  { date: "09-20", text: "发票抬头支持批量导入，最多 500 条 / 次" },
]

export default function CarouselVertical() {
  return (
    <Carousel
      orientation="vertical"
      loop
      autoplay={3500}
      className="flex w-full max-w-lg items-center gap-3 rounded-md border px-3"
      aria-label="系统公告"
    >
      <MegaphoneIcon className="text-muted-foreground size-4 shrink-0" />
      <CarouselContent className="h-14 min-w-0 flex-1">
        {notices.map((notice) => (
          <CarouselItem key={notice.date}>
            <a
              href="#"
              className="flex h-full items-center gap-3 text-sm outline-none hover:underline focus-visible:underline"
            >
              <span className="text-muted-foreground shrink-0 text-xs tabular-nums">
                {notice.date}
              </span>
              <span className="truncate">{notice.text}</span>
            </a>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselDots className="shrink-0 [&>button]:py-0.5" />
    </Carousel>
  )
}
