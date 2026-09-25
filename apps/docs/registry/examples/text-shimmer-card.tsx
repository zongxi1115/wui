import { CheckIcon, LoaderCircleIcon } from "lucide-react"

import { TextShimmer } from "@/registry/ui/text-shimmer"

const steps = [
  { label: "读取 3 份会议纪要", state: "done" },
  { label: "提取行动项与负责人", state: "done" },
  { label: "对比上周目标完成情况", state: "active" },
  { label: "生成周报草稿", state: "pending" },
] as const

export default function TextShimmerCard() {
  return (
    <div className="w-full max-w-sm">
      <p className="text-sm font-medium">正在生成周报</p>
      <p className="text-muted-foreground text-xs">预计还需 20 秒</p>
      <ol className="mt-4 space-y-3">
        {steps.map((step) => (
          <li key={step.label} className="flex items-center gap-2.5 text-sm">
            {step.state === "done" ? (
              <CheckIcon className="text-muted-foreground size-4" />
            ) : step.state === "active" ? (
              <LoaderCircleIcon className="text-muted-foreground size-4 animate-spin" />
            ) : (
              <span className="flex size-4 items-center justify-center">
                <span className="bg-border size-1.5 rounded-full" />
              </span>
            )}
            {step.state === "active" ? (
              <TextShimmer duration={1.6}>{step.label}</TextShimmer>
            ) : (
              <span
                className={
                  step.state === "done"
                    ? "text-muted-foreground line-through decoration-border"
                    : "text-muted-foreground/60"
                }
              >
                {step.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </div>
  )
}
