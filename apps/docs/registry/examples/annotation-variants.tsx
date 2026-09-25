import { AnnotationHighlight } from "@/registry/ui/annotation"

export default function AnnotationVariantsDemo() {
  return (
    <div className="w-full max-w-xl divide-y border-y">
      <div className="py-5">
        <p className="text-muted-foreground text-xs">variant=&quot;smooth&quot;</p>
        <p className="mt-2 text-base leading-8">
          平整的荧光笔适合文档与说明：
          <AnnotationHighlight>默认琥珀色</AnnotationHighlight>、
          <AnnotationHighlight
            color="color-mix(in oklch, var(--success) 25%, transparent)"
            delay={0.2}
          >
            成功绿
          </AnnotationHighlight>
          ，或者
          <AnnotationHighlight
            color="color-mix(in oklch, var(--info) 25%, transparent)"
            delay={0.4}
          >
            信息蓝
          </AnnotationHighlight>
          。
        </p>
      </div>
      <div className="py-5">
        <p className="text-muted-foreground text-xs">variant=&quot;rough&quot;</p>
        <p className="mt-2 text-base leading-8">
          双层笔触带来
          <AnnotationHighlight variant="rough">手写批注的质感</AnnotationHighlight>
          ，适合
          <AnnotationHighlight
            variant="rough"
            color="color-mix(in oklch, var(--destructive) 22%, transparent)"
            delay={0.3}
          >
            设计评审
          </AnnotationHighlight>
          与编辑修订。
        </p>
      </div>
    </div>
  )
}
