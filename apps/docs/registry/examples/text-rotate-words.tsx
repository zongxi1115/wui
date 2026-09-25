import { TextRotate } from "@/registry/ui/text-rotate"

export default function TextRotateWords() {
  return (
    <div className="flex w-full max-w-md flex-col gap-3">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>部署流水线 · main</span>
        <span className="font-mono">#2048</span>
      </div>
      <div className="flex items-center gap-3 rounded-md border px-4 py-3">
        <span className="relative flex size-2 shrink-0">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-40" />
          <span className="relative inline-flex size-2 rounded-full bg-primary" />
        </span>
        <TextRotate
          split="words"
          blur
          interval={2.2}
          staggerDuration={0.06}
          className="font-mono text-sm text-foreground"
          texts={[
            "Installing 342 dependencies",
            "Running 128 unit tests",
            "Building production bundle",
            "Uploading assets to edge",
            "Deployed to production",
          ]}
        />
      </div>
      <p className="text-xs text-muted-foreground">
        按单词错峰切换，适合日志、状态与长度差异较大的英文短句。
      </p>
    </div>
  )
}
