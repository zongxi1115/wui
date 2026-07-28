import {
  GitCommitHorizontalIcon,
  MessageSquareTextIcon,
  RocketIcon,
} from "lucide-react"

import {
  Timeline,
  TimelineCard,
  TimelineContent,
  TimelineDescription,
  TimelineDot,
  TimelineHeader,
  TimelineItem,
  TimelineMeta,
  TimelineTime,
  TimelineTitle,
} from "@/registry/ui/timeline"

const events = [
  {
    title: "部署到生产环境",
    time: "14:32",
    description: "Release v2.4.0",
    icon: RocketIcon,
    variant: "success" as const,
  },
  {
    title: "合并提交",
    time: "13:48",
    description: "feat: add timeline layouts",
    icon: GitCommitHorizontalIcon,
    variant: "primary" as const,
  },
  {
    title: "新增评论",
    time: "11:20",
    description: "动效参数已经过设计评审，可以合并。",
    icon: MessageSquareTextIcon,
    variant: "default" as const,
  },
]

export default function TimelineIcons() {
  return (
    <Timeline className="w-full max-w-xl">
      {events.map((event, index) => {
        const Glyph = event.icon
        return (
          <TimelineItem key={event.title}>
            <TimelineDot size="icon" variant={event.variant}>
              <Glyph />
            </TimelineDot>
            <TimelineContent>
              <TimelineHeader>
                <TimelineTitle>{event.title}</TimelineTitle>
                <TimelineTime>{event.time}</TimelineTime>
              </TimelineHeader>
              {index === 1 ? (
                <TimelineCard>
                  <code className="text-xs">8f2a9c1 · feat/timeline</code>
                  <TimelineMeta>
                    <span>林宁提交</span>
                    <span>8 个文件变更</span>
                  </TimelineMeta>
                </TimelineCard>
              ) : (
                <TimelineDescription>{event.description}</TimelineDescription>
              )}
            </TimelineContent>
          </TimelineItem>
        )
      })}
    </Timeline>
  )
}
