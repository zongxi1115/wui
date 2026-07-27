import { InView } from "@/registry/ui/in-view"

export default function InViewDemo() {
  return (
    <div className="bg-muted/30 h-72 w-full max-w-xl overflow-y-auto rounded-lg border p-6 text-center">
      <p className="text-muted-foreground text-sm">向下滚动</p>
      <div className="h-56" />
      <InView
        className="bg-background shadow-xs rounded-md border px-5 py-4 text-left"
        viewOptions={{ margin: "-15% 0px" }}
      >
        <p className="font-medium">内容进入视口</p>
        <p className="text-muted-foreground mt-1 text-sm">
          透明度与位移同时过渡，并且默认只播放一次。
        </p>
      </InView>
      <div className="h-24" />
    </div>
  )
}
