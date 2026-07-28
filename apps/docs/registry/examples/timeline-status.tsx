import { CheckIcon } from "lucide-react"

import {
  Timeline,
  TimelineContent,
  TimelineDescription,
  TimelineDot,
  TimelineItem,
  TimelineMeta,
  TimelineTitle,
} from "@/registry/ui/timeline"

const steps = [
  {
    title: "订单已确认",
    description: "商家已接单并开始准备商品。",
    state: "complete" as const,
  },
  {
    title: "配送中",
    description: "骑手距离收货地址约 1.8 公里。",
    state: "current" as const,
  },
  {
    title: "等待签收",
    description: "预计今天 16:20 前送达。",
    state: "upcoming" as const,
  },
]

export default function TimelineStatus() {
  return (
    <Timeline density="compact" connector="dashed" className="w-full max-w-lg">
      {steps.map((step) => (
        <TimelineItem key={step.title} state={step.state}>
          <TimelineDot
            size={step.state === "complete" ? "icon" : "dot"}
            variant={
              step.state === "complete"
                ? "success"
                : step.state === "current"
                  ? "primary"
                  : "default"
            }
            pulse={step.state === "current"}
          >
            {step.state === "complete" ? <CheckIcon /> : null}
          </TimelineDot>
          <TimelineContent>
            <TimelineTitle>{step.title}</TimelineTitle>
            <TimelineDescription>{step.description}</TimelineDescription>
            {step.state === "current" ? (
              <TimelineMeta>
                <span className="text-primary font-medium">实时更新</span>
                <span>更新于 2 分钟前</span>
              </TimelineMeta>
            ) : null}
          </TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  )
}
