import { PlayIcon, Volume2Icon } from "lucide-react"

import { Button } from "@/registry/ui/button"
import {
  MorphingDialog,
  MorphingDialogClose,
  MorphingDialogContent,
  MorphingDialogDescription,
  MorphingDialogImage,
  MorphingDialogSubtitle,
  MorphingDialogTitle,
  MorphingDialogTrigger,
} from "@/registry/ui/morphing-dialog"

export default function MorphingDialogMedia() {
  return (
    <div className="flex w-full max-w-sm flex-col items-center justify-center p-4">
      <MorphingDialog>
        <MorphingDialogTrigger className="group relative block w-full overflow-hidden rounded-xl border bg-card p-0 text-left shadow-xs transition-shadow hover:shadow-md">
          <div className="relative aspect-video w-full overflow-hidden bg-muted">
            <MorphingDialogImage
              src="https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80"
              alt="Art exhibition cover"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity group-hover:opacity-100">
              <div className="flex size-12 items-center justify-center rounded-full bg-white/90 text-black shadow-md">
                <PlayIcon className="size-5 fill-current pl-0.5" />
              </div>
            </div>
          </div>
          <div className="p-4">
            <h4 className="font-semibold text-foreground">
              Masterpieces in Neon & Geometry
            </h4>
            <p className="mt-1 text-xs text-muted-foreground">
              Modern digital art retrospective · 4 min video preview
            </p>
          </div>
        </MorphingDialogTrigger>

        <MorphingDialogContent className="max-w-lg overflow-hidden p-0">
          <div className="relative aspect-video w-full bg-black">
            <MorphingDialogImage
              src="https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1200&q=80"
              alt="Art exhibition high-res"
              className="h-full w-full object-cover"
            />
            <div className="absolute bottom-3 left-3 flex items-center gap-2 rounded-full bg-black/60 px-3 py-1 text-xs text-white backdrop-blur-xs">
              <Volume2Icon className="size-3.5" />
              <span>Audio guide included</span>
            </div>
          </div>
          <div className="p-6">
            <MorphingDialogTitle className="text-xl">
              Masterpieces in Neon & Geometry
            </MorphingDialogTitle>
            <MorphingDialogSubtitle className="text-muted-foreground">
              Curated by Studio Lumière · Exhibition Series 2026
            </MorphingDialogSubtitle>
            <MorphingDialogDescription className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Explore the boundary where classic impressionist light meets modern
              algorithmic procedural generation. This showcase presents high-definition
              motion studies and responsive visual compositions.
            </MorphingDialogDescription>
            <div className="mt-6 flex items-center justify-between border-t pt-4">
              <span className="text-xs text-muted-foreground">
                High dynamic range video available in 4K
              </span>
              <div className="flex gap-2">
                <MorphingDialogClose asChild>
                  <Button variant="outline" size="sm">
                    Close
                  </Button>
                </MorphingDialogClose>
                <Button size="sm">Start Tour</Button>
              </div>
            </div>
          </div>
          <MorphingDialogClose />
        </MorphingDialogContent>
      </MorphingDialog>
    </div>
  )
}
