import { ChevronRightIcon } from "lucide-react"

import { HoverMarquee } from "@/registry/ui/hover-marquee"

const services = [
  {
    code: "S-01",
    name: "设计工程",
    highlights: ["React 19", "Tailwind CSS v4", "Motion", "无障碍组件"],
  },
  {
    code: "S-02",
    name: "AI 工作流",
    highlights: ["流式输出", "工具调用", "向量检索", "评测体系"],
  },
  {
    code: "S-03",
    name: "数据可视化",
    highlights: ["实时大屏", "Canvas 渲染", "地理信息", "自助报表"],
  },
]

export default function HoverMarqueeCatalogDemo() {
  return (
    <div className="w-full max-w-xl overflow-hidden rounded-lg border">
      {services.map((service, index) => (
        <HoverMarquee
          key={service.code}
          tabIndex={0}
          speed={70}
          gap={12}
          reverse={index % 2 === 1}
          marquee={
            <span className="flex shrink-0 items-center gap-3 whitespace-nowrap">
              {service.highlights.map((item) => (
                <span
                  key={item}
                  className="border-primary-foreground/25 rounded-md border px-2 py-0.5 text-xs"
                >
                  {item}
                </span>
              ))}
            </span>
          }
          className="focus-visible:ring-ring/50 border-b outline-none last:border-b-0 focus-visible:ring-[3px] focus-visible:ring-inset"
          marqueeClassName="bg-primary text-primary-foreground"
        >
          <div className="flex h-12 items-center gap-3 px-4 text-sm">
            <span className="text-muted-foreground font-mono text-xs">
              {service.code}
            </span>
            <span className="flex-1 font-medium">{service.name}</span>
            <ChevronRightIcon className="text-muted-foreground size-4" />
          </div>
        </HoverMarquee>
      ))}
    </div>
  )
}
