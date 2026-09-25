import { Typewriter } from "@/registry/ui/typewriter"

export default function TypewriterDemo() {
  return (
    <div className="flex max-w-lg flex-col items-center gap-3 text-center">
      <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
        让团队把时间花在
        <br />
        <Typewriter
          className="text-primary"
          texts={["真正重要的决策上", "打磨产品细节上", "与用户的对话上"]}
        />
      </h2>
      <p className="text-sm text-muted-foreground">
        自动整理会议纪要、同步任务进度，减少重复沟通。
      </p>
    </div>
  )
}
