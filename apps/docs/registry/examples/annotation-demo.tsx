import { ArrowRightIcon } from "lucide-react"

import { AnnotationHighlight, AnnotationPath } from "@/registry/ui/annotation"
import { Button } from "@/registry/ui/button"

export default function AnnotationDemo() {
  return (
    <div className="w-full max-w-xl">
      <p className="text-muted-foreground text-xs">v2.4 更新说明</p>
      <h3 className="mt-3 text-2xl font-semibold leading-snug tracking-tight sm:text-3xl">
        审批不该是
        <AnnotationHighlight className="mx-1">等待</AnnotationHighlight>
        ，而是顺手完成的一步。
      </h3>
      <p className="text-muted-foreground mt-4 text-sm leading-7">
        新版审批流支持在消息卡片中直接处理，平均处理时长从 2 天缩短到
        <span className="relative mx-1 inline-block px-1 font-medium text-foreground">
          4 小时
          <AnnotationPath
            path="M6 16C12 4 78 2 108 12C124 21 105 32 55 31C18 31 1 25 6 16Z"
            viewBox="0 0 116 36"
            arrow={false}
            color="var(--warning)"
            strokeWidth={2}
            duration={0.9}
            delay={0.5}
            className="absolute -inset-x-2 -inset-y-1.5 h-[calc(100%+0.75rem)] w-[calc(100%+1rem)]"
          />
        </span>
        ，并且
        <AnnotationHighlight variant="rough" delay={0.3} className="mx-1">
          每一步都有记录
        </AnnotationHighlight>
        。
      </p>

      <div className="relative mt-10 flex items-center gap-3">
        <Button size="sm">
          立即体验
          <ArrowRightIcon />
        </Button>
        <AnnotationPath
          path="M76 10C52 2 22 8 6 30"
          viewBox="0 0 80 48"
          color="var(--muted-foreground)"
          strokeWidth={2}
          delay={0.9}
          duration={0.6}
          className="h-10 w-16"
        />
        <span className="text-muted-foreground -mt-6 text-xs">从这里开始</span>
      </div>
    </div>
  )
}
