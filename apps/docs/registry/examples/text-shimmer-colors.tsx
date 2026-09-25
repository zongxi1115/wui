import { TextShimmer } from "@/registry/ui/text-shimmer"
import { cn } from "@/registry/lib/utils"

const tones = [
  {
    token: "success",
    label: "同步完成，0 个冲突",
    className:
      "[--shimmer-base:var(--success)] [--shimmer-highlight:color-mix(in_oklch,var(--success)_35%,var(--background))]",
  },
  {
    token: "info",
    label: "正在推理，已用 12 秒",
    className:
      "[--shimmer-base:var(--info)] [--shimmer-highlight:color-mix(in_oklch,var(--info)_35%,var(--background))]",
  },
  {
    token: "warning",
    label: "等待负责人审批",
    className:
      "[--shimmer-base:var(--warning)] [--shimmer-highlight:color-mix(in_oklch,var(--warning)_35%,var(--background))]",
  },
  {
    token: "destructive",
    label: "正在回滚到 v2.3.2",
    className:
      "[--shimmer-base:var(--destructive)] [--shimmer-highlight:color-mix(in_oklch,var(--destructive)_35%,var(--background))]",
  },
]

export default function TextShimmerColors() {
  return (
    <dl className="w-full max-w-sm divide-y border-y">
      {tones.map((tone) => (
        <div key={tone.token} className="flex items-center justify-between py-3">
          <dt className="text-muted-foreground font-mono text-xs">{tone.token}</dt>
          <dd>
            <TextShimmer
              duration={2}
              className={cn("text-sm font-medium", tone.className)}
            >
              {tone.label}
            </TextShimmer>
          </dd>
        </div>
      ))}
    </dl>
  )
}
