import { AnnotationPath } from "@/registry/ui/annotation"
import { Badge } from "@/registry/ui/badge"
import { Button } from "@/registry/ui/button"

export default function AnnotationShapesDemo() {
  return (
    <div className="grid w-full grid-cols-1 gap-6 p-4 sm:grid-cols-3 sm:p-8">
      {/* 1. Pointer Arrow */}
      <div className="border-border/60 bg-muted/20 flex flex-col justify-between rounded-xl border p-5">
        <div>
          <p className="text-muted-foreground font-mono text-xs uppercase tracking-wider">
            Pointer Arrow · 引导箭头
          </p>
          <p className="mt-2 text-sm">Direct attention to interactive elements.</p>
        </div>
        <div className="relative mt-8 flex items-center justify-center pt-6">
          <AnnotationPath
            path="M10 50C25 50 30 15 70 20"
            viewBox="0 0 80 55"
            strokeWidth={2.5}
            color="oklch(0.65 0.2 25)"
            delay={0.1}
            className="absolute -top-3 left-2 h-12 w-20"
          />
          <Button size="sm" variant="secondary" className="shadow-xs">
            Confirm Action
          </Button>
        </div>
      </div>

      {/* 2. Enclosed Loop / Circle */}
      <div className="border-border/60 bg-muted/20 flex flex-col justify-between rounded-xl border p-5">
        <div>
          <p className="text-muted-foreground font-mono text-xs uppercase tracking-wider">
            Enclosure · 圈选强调
          </p>
          <p className="mt-2 text-sm">Draw focus to critical badges and prices.</p>
        </div>
        <div className="relative mt-8 flex items-center justify-center py-4">
          <div className="relative inline-flex items-center">
            <Badge variant="outline" className="px-3 py-1 font-mono text-xs">
              SAVE 50%
            </Badge>
            <AnnotationPath
              path="M8 20C14 6 74 4 98 14C114 23 96 33 50 32C18 32 2 26 8 20Z"
              viewBox="0 0 106 38"
              arrow={false}
              color="oklch(0.7 0.18 145)"
              strokeWidth={2}
              duration={0.9}
              delay={0.2}
              className="absolute -inset-1 size-full"
            />
          </div>
        </div>
      </div>

      {/* 3. Underline Scribble */}
      <div className="border-border/60 bg-muted/20 flex flex-col justify-between rounded-xl border p-5">
        <div>
          <p className="text-muted-foreground font-mono text-xs uppercase tracking-wider">
            Underline · 手绘下划线
          </p>
          <p className="mt-2 text-sm">Underline essential keywords dynamically.</p>
        </div>
        <div className="relative mt-8 flex items-center justify-center py-4">
          <span className="relative inline-block text-base font-semibold">
            Zero Config
            <AnnotationPath
              path="M2 14C35 8 70 18 115 12"
              viewBox="0 0 120 20"
              arrow={false}
              color="oklch(0.65 0.22 265)"
              strokeWidth={3}
              duration={0.8}
              delay={0.3}
              className="absolute -bottom-2 left-0 h-4 w-full"
            />
          </span>
        </div>
      </div>
    </div>
  )
}
