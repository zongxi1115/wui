import { ChevronRightIcon } from "lucide-react"

import { TextLoop } from "@/registry/ui/text-loop"

const announcements = [
  { tag: "新功能", text: "审批流模板市场正式上线" },
  { tag: "优化", text: "报表导出速度提升 3 倍" },
  { tag: "安全", text: "已支持企业单点登录（SSO）" },
  { tag: "公告", text: "10 月 2 日凌晨进行例行维护" },
]

export default function TextLoopBadges() {
  return (
    <a
      href="#text-loop-badges"
      className="bg-muted/60 hover:bg-muted focus-visible:ring-ring/50 group inline-flex items-center gap-2 rounded-full border py-1 pl-1 pr-3 text-xs outline-none transition-colors focus-visible:ring-[3px]"
    >
      <TextLoop interval={3} animateWidth>
        {announcements.map((item) => (
          <span key={item.text} className="flex items-center gap-2">
            <span className="bg-background rounded-full border px-2 py-0.5 font-medium">
              {item.tag}
            </span>
            <span>{item.text}</span>
          </span>
        ))}
      </TextLoop>
      <ChevronRightIcon className="text-muted-foreground size-3.5 transition-transform group-hover:translate-x-0.5" />
    </a>
  )
}
