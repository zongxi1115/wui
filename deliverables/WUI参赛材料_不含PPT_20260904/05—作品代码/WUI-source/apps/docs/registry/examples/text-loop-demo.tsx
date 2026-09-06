import { TextLoop } from "@/registry/ui/text-loop"

export default function TextLoopDemo() {
  return (
    <div className="flex w-full max-w-md flex-col items-center justify-center rounded-xl border border-border bg-card p-8 text-center shadow-xs">
      <h3 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
        Build interfaces that are{" "}
        <TextLoop
          className="text-primary font-bold inline-flex underline decoration-primary/30 decoration-2 underline-offset-4"
          interval={2}
        >
          {[
            <span key="fast">lightning fast.</span>,
            <span key="accessible">fully accessible.</span>,
            <span key="beautiful">pixel perfect.</span>,
            <span key="scalable">enterprise ready.</span>,
          ]}
        </TextLoop>
      </h3>
      <p className="mt-2 text-xs text-muted-foreground">
        在行内无缝循环切换核心词汇，保持版式高度平稳。
      </p>
    </div>
  )
}
