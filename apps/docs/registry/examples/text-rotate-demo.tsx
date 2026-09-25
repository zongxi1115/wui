import { TextRotate } from "@/registry/ui/text-rotate"

export default function TextRotateDemo() {
  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <h2 className="flex flex-wrap items-center justify-center gap-x-2.5 gap-y-2 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
        <span>为</span>
        <TextRotate
          texts={["设计师", "开发者", "产品团队", "增长运营"]}
          staggerFrom="last"
          staggerDuration={0.03}
          className="rounded-md bg-primary px-3 py-1 text-primary-foreground"
        />
        <span>打造的界面工具</span>
      </h2>
      <p className="max-w-sm text-sm text-muted-foreground">
        从设计稿到上线，同一套组件贯穿评审、开发与发布。
      </p>
    </div>
  )
}
