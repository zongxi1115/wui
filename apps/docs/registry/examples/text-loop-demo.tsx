import { TextLoop } from "@/registry/ui/text-loop"

export default function TextLoopDemo() {
  return (
    <div className="w-full max-w-lg text-center">
      <h3 className="text-2xl font-semibold tracking-tight sm:text-3xl">
        为
        <TextLoop
          animateWidth
          interval={2.2}
          className="text-muted-foreground mx-1.5"
        >
          {[
            <span key="design">设计师</span>,
            <span key="engineer">前端工程师</span>,
            <span key="pm">产品经理</span>,
            <span key="ops">运营团队</span>,
          ]}
        </TextLoop>
        打造的协作空间
      </h3>
      <p className="text-muted-foreground mt-3 text-sm">
        开启 animateWidth 后，关键词长度变化时容器宽度平滑过渡，后面的文字不会跳动。
      </p>
    </div>
  )
}
