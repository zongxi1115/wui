import { AnnotationHighlight, AnnotationPath } from "@/registry/ui/annotation"
import { Button } from "@/registry/ui/button"

export default function AnnotationCallout() {
  return (
    <div className="flex w-full max-w-md flex-col items-center text-center">
      <h3 className="text-xl font-semibold tracking-tight sm:text-2xl">
        发布新版本，
        <AnnotationHighlight color="color-mix(in oklch, var(--info) 22%, transparent)">
          用户零感知
        </AnnotationHighlight>
      </h3>
      <p className="text-muted-foreground mt-2 text-sm">
        健康检查通过后，流量会平滑切换到新版本。
      </p>

      <div className="relative mt-10">
        <span className="text-muted-foreground absolute -right-28 -top-8 hidden text-xs sm:inline">
          一键上线
        </span>
        <AnnotationPath
          path="M75 8C55 8 30 14 12 36"
          viewBox="0 0 85 45"
          color="var(--muted-foreground)"
          strokeWidth={2}
          delay={0.3}
          className="absolute -right-20 -top-6 hidden h-9 w-16 sm:block"
        />
        <Button size="sm">发布到生产环境</Button>
      </div>
    </div>
  )
}
