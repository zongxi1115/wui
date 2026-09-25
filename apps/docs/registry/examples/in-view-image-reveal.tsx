import { InView } from "@/registry/ui/in-view"

const reveal = {
  hidden: { clipPath: "inset(100% 0% 0% 0%)", scale: 1.08 },
  visible: { clipPath: "inset(0% 0% 0% 0%)", scale: 1 },
}

const caption = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 },
}

export default function InViewImageReveal() {
  return (
    <div className="grid w-full max-w-3xl items-end gap-8 sm:grid-cols-[0.9fr_1.1fr]">
      <InView
        variants={caption}
        transition={{ duration: 0.6, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
      >
        <p className="text-muted-foreground font-mono text-xs">
          实地笔记 · 第 07 期
        </p>
        <h3 className="mt-3 text-3xl font-semibold leading-tight tracking-tight">
          风从海上来，
          <br />
          悬崖记下了每一次潮汐。
        </h3>
        <p className="text-muted-foreground mt-4 max-w-xs text-sm leading-6">
          图片自下而上揭开，同时从轻微放大回落到原始比例，模拟视线沿地平线向上攀升的过程。
        </p>
      </InView>
      <InView
        variants={reveal}
        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        viewOptions={{ amount: 0.4 }}
        className="relative aspect-[4/5] overflow-hidden rounded-md"
      >
        <img
          src="/wui/demo/field-notes/storm-cliffs.jpg"
          alt="海边的悬崖与阴云"
          className="size-full object-cover"
        />
      </InView>
    </div>
  )
}
