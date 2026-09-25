import { Glow } from "@/registry/ui/glow"

export default function GlowBadge() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-6">
      <Glow spread={10} duration={5} glowOpacity={0.6} className="rounded-full">
        <span className="bg-background flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-medium">
          全新 AI 工作台预览版上线
        </span>
      </Glow>

      <Glow
        variant="solid"
        color="var(--success)"
        spread={12}
        glowOpacity={0.45}
        duration={2.4}
        className="rounded-full"
      >
        <span className="bg-background flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-medium">
          <span className="bg-success size-1.5 rounded-full" />
          所有服务运行正常
        </span>
      </Glow>

      <Glow
        variant="solid"
        color="var(--warning)"
        spread={12}
        glowOpacity={0.45}
        duration={2.4}
        className="rounded-full"
      >
        <span className="bg-background flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-medium">
          <span className="bg-warning size-1.5 rounded-full" />
          今晚 23:00 例行维护
        </span>
      </Glow>
    </div>
  )
}
