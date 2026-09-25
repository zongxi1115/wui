import { AnnotationPath } from "@/registry/ui/annotation"
import { Badge } from "@/registry/ui/badge"
import { Button } from "@/registry/ui/button"

export default function AnnotationShapesDemo() {
  return (
    <div className="grid w-full max-w-3xl grid-cols-1 divide-y sm:grid-cols-3 sm:divide-x sm:divide-y-0">
      <div className="flex flex-col gap-8 p-5">
        <div>
          <p className="text-sm font-medium">引导箭头</p>
          <p className="text-muted-foreground mt-1 text-xs">把视线引向下一步操作。</p>
        </div>
        <div className="relative flex justify-center pt-6">
          <AnnotationPath
            path="M10 50C25 50 30 15 70 20"
            viewBox="0 0 80 55"
            strokeWidth={2.5}
            color="var(--muted-foreground)"
            delay={0.1}
            className="absolute -top-3 left-0 h-12 w-20"
          />
          <Button size="sm" variant="outline">
            确认提交
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-8 p-5">
        <div>
          <p className="text-sm font-medium">圈选强调</p>
          <p className="text-muted-foreground mt-1 text-xs">突出价格、折扣与关键数字。</p>
        </div>
        <div className="flex justify-center py-2">
          <span className="relative inline-flex">
            <Badge variant="outline" className="px-3 py-1">
              限时 5 折
            </Badge>
            <AnnotationPath
              path="M8 20C14 6 74 4 98 14C114 23 96 33 50 32C18 32 2 26 8 20Z"
              viewBox="0 0 106 38"
              arrow={false}
              color="var(--destructive)"
              strokeWidth={2}
              duration={0.9}
              delay={0.2}
              className="absolute -inset-2 h-[calc(100%+1rem)] w-[calc(100%+1rem)]"
            />
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-8 p-5">
        <div>
          <p className="text-sm font-medium">手绘下划线</p>
          <p className="text-muted-foreground mt-1 text-xs">给关键词加一道随手的线。</p>
        </div>
        <div className="flex justify-center py-2">
          <span className="relative inline-block text-base font-semibold">
            零配置接入
            <AnnotationPath
              path="M2 14C35 8 70 18 115 12"
              viewBox="0 0 120 20"
              arrow={false}
              color="var(--info)"
              strokeWidth={3}
              duration={0.8}
              delay={0.3}
              className="absolute -bottom-2.5 left-0 h-3 w-full"
            />
          </span>
        </div>
      </div>
    </div>
  )
}
