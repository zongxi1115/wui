import { CheckIcon } from "lucide-react"

import {
  Timeline,
  TimelineContent,
  TimelineDescription,
  TimelineDot,
  TimelineItem,
  TimelineTitle,
} from "@/registry/ui/timeline"

const steps = [
  { title: "创建项目", state: "complete" },
  { title: "邀请成员", state: "complete" },
  { title: "连接数据", state: "current" },
  { title: "开始使用", state: "upcoming" },
] as const

export default function TimelineHorizontal() {
  return (
    <div className="w-full overflow-x-auto pb-2">
      <Timeline orientation="horizontal" className="min-w-[42rem]">
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
              <TimelineDescription>
                {step.state === "complete"
                  ? "已完成"
                  : step.state === "current"
                    ? "正在进行"
                    : "尚未开始"}
              </TimelineDescription>
            </TimelineContent>
          </TimelineItem>
        ))}
      </Timeline>
    </div>
  )
}
