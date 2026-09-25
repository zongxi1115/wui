import { Avatar, AvatarFallback, AvatarImage } from "@/registry/ui/avatar"
import { HoverPreview } from "@/registry/ui/hover-preview"

export default function HoverPreviewUser() {
  return (
    <div className="flex w-full max-w-md gap-3">
      <Avatar className="size-8">
        <AvatarImage src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80" />
        <AvatarFallback>林</AvatarFallback>
      </Avatar>
      <div className="text-sm">
        <div>
          <HoverPreview
            className="inline-block"
            tilt={0}
            offsetY={16}
            previewClassName="bg-popover text-popover-foreground w-64 rounded-md border p-4 shadow-lg"
            preview={
              <div>
                <div className="flex items-center gap-3">
                  <Avatar className="size-10">
                    <AvatarImage src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80" />
                    <AvatarFallback>林</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">林知夏</p>
                    <p className="text-muted-foreground text-xs">
                      设计系统负责人
                    </p>
                  </div>
                </div>
                <p className="text-muted-foreground mt-3 text-xs leading-5">
                  维护组件库与动效规范，关注可访问性与跨端一致性。
                </p>
                <div className="text-muted-foreground mt-3 flex gap-4 border-t pt-3 text-xs">
                  <span>
                    <span className="text-foreground font-medium">128</span>{" "}
                    次评审
                  </span>
                  <span>
                    <span className="text-foreground font-medium">12</span>{" "}
                    个 PR 本月合并
                  </span>
                </div>
              </div>
            }
          >
            <a href="#" className="font-medium hover:underline">
              林知夏
            </a>
          </HoverPreview>
          <span className="text-muted-foreground"> · 2 小时前</span>
        </div>
        <p className="text-muted-foreground mt-1 leading-6">
          按钮的按压反馈改成了 0.97 缩放，在低端机上也很稳定，可以合并。
        </p>
      </div>
    </div>
  )
}
