import { HoverPreview } from "@/registry/ui/hover-preview"

export default function HoverPreviewLink() {
  return (
    <div className="text-muted-foreground max-w-md text-sm leading-7">
      动效的时长并不是越长越好。我们在{" "}
      <HoverPreview
        className="inline-block"
        tilt={0}
        previewClassName="bg-popover text-popover-foreground w-72 rounded-md border shadow-lg"
        preview={
          <div>
            <img
              src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80"
              alt=""
              className="bg-muted aspect-[2/1] w-full object-cover"
            />
            <div className="p-3">
              <p className="text-sm font-medium">弹簧参数的直觉</p>
              <p className="text-muted-foreground mt-1 text-xs leading-5">
                把刚度、阻尼与质量当作三个旋钮，理解它们如何塑造手感。
              </p>
              <p className="text-muted-foreground mt-2 text-xs">
                设计笔记 · 9 分钟阅读
              </p>
            </div>
          </div>
        }
      >
        <a
          href="#"
          className="text-foreground decoration-muted-foreground/40 hover:decoration-foreground font-medium underline underline-offset-4 transition-colors"
        >
          弹簧参数的直觉
        </a>
      </HoverPreview>{" "}
      一文中比较了三种曲线，结论是：界面内的小变化控制在 200ms 左右，用户感知最自然。
    </div>
  )
}
