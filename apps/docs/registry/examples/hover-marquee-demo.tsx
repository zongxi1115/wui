import { ArrowUpRightIcon } from "lucide-react"

import { HoverMarquee } from "@/registry/ui/hover-marquee"

const projects = [
  { number: "01", title: "青禾零售会员体系", category: "品牌与增长", year: "2026" },
  { number: "02", title: "远帆科技设计系统", category: "组件与规范", year: "2025" },
  { number: "03", title: "知行教育学习应用", category: "移动端体验", year: "2025" },
  { number: "04", title: "北辰物流调度大屏", category: "数据可视化", year: "2024" },
]

export default function HoverMarqueeDemo() {
  return (
    <div className="w-full max-w-2xl border-y">
      {projects.map((project, index) => (
        <HoverMarquee
          key={project.number}
          tabIndex={0}
          speed={90}
          reverse={index % 2 === 1}
          marquee={
            <span className="flex shrink-0 items-center gap-6 whitespace-nowrap px-3 text-sm font-medium">
              {project.title}
              <span className="bg-background/40 size-1 rounded-full" />
              <span className="opacity-70">{project.category}</span>
              <span className="bg-background/40 size-1 rounded-full" />
              <span className="flex items-center gap-1">
                查看案例
                <ArrowUpRightIcon className="size-3.5" />
              </span>
            </span>
          }
          className="focus-visible:ring-ring/50 border-b outline-none last:border-b-0 focus-visible:ring-[3px]"
          marqueeClassName="bg-foreground text-background"
        >
          <div className="flex h-14 items-center gap-4 px-3 text-sm">
            <span className="text-muted-foreground font-mono text-xs tabular-nums">
              {project.number}
            </span>
            <span className="flex-1 font-medium">{project.title}</span>
            <span className="text-muted-foreground hidden text-xs sm:inline">
              {project.category}
            </span>
            <span className="text-muted-foreground font-mono text-xs tabular-nums">
              {project.year}
            </span>
          </div>
        </HoverMarquee>
      ))}
    </div>
  )
}
