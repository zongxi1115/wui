import { Avatar, AvatarFallback, AvatarImage } from "@/registry/ui/avatar"
import { Badge } from "@/registry/ui/badge"
import { Button } from "@/registry/ui/button"
import { HoverPreview } from "@/registry/ui/hover-preview"

export default function HoverPreviewUser() {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="rounded-xl border bg-card p-4 shadow-xs">
        <p className="text-sm text-foreground">
          Reviewed by{" "}
          <HoverPreview
            className="inline-block"
            previewClassName="w-64 rounded-xl border bg-popover p-4 shadow-xl text-popover-foreground"
            preview={
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Avatar className="size-10">
                    <AvatarImage src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80" />
                    <AvatarFallback>SC</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="text-sm font-semibold text-foreground">
                      Sarah Chen
                    </div>
                    <div className="text-xs text-muted-foreground">
                      @sarahchen
                    </div>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Principal Design Engineer at WUI. Passionate about web standards & accessible animations.
                </p>
                <div className="flex items-center justify-between border-t pt-2.5">
                  <Badge variant="secondary" className="text-[10px]">
                    12 PRs merged
                  </Badge>
                  <Button size="sm" variant="outline">
                    Follow
                  </Button>
                </div>
              </div>
            }
          >
            <span className="cursor-pointer font-medium text-primary underline underline-offset-4">
              Sarah Chen
            </span>
          </HoverPreview>{" "}
          on August 18, 2026.
        </p>
      </div>
    </div>
  )
}
