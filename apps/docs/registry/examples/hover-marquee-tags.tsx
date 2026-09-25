import { HoverMarquee } from "@/registry/ui/hover-marquee"

const teams = [
  { title: "前端工程", count: 12, tags: ["React", "TypeScript", "Next.js", "Tailwind CSS", "Playwright"] },
  { title: "后端与基础设施", count: 9, tags: ["Go", "PostgreSQL", "Kubernetes", "Redis", "Terraform"] },
  { title: "设计与研究", count: 6, tags: ["Figma", "设计令牌", "可用性测试", "动效规范"] },
  { title: "安全与合规", count: 4, tags: ["等保三级", "SSO", "审计日志", "渗透测试"] },
]

export default function HoverMarqueeTags() {
  return (
    <div className="w-full max-w-xl divide-y border-y">
      {teams.map((team, index) => (
        <HoverMarquee
          key={team.title}
          tabIndex={0}
          speed={60}
          gap={8}
          reverse={index % 2 === 1}
          className="focus-visible:ring-ring/50 outline-none focus-visible:ring-[3px] focus-visible:ring-inset"
          marqueeClassName="bg-muted"
          marquee={
            <span className="flex items-center gap-2 whitespace-nowrap">
              {team.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-background rounded-full border px-2.5 py-0.5 text-xs"
                >
                  {tag}
                </span>
              ))}
            </span>
          }
        >
          <div className="flex h-12 items-center justify-between px-3 text-sm">
            <span className="font-medium">{team.title}</span>
            <span className="text-muted-foreground text-xs">{team.count} 人</span>
          </div>
        </HoverMarquee>
      ))}
    </div>
  )
}
