import { ProgressiveBlur } from "@/registry/ui/progressive-blur"

export default function ProgressiveBlurDirections() {
  return (
    <div className="grid w-full max-w-2xl grid-cols-1 gap-6 sm:grid-cols-2">
      {/* Bottom Blur */}
      <div className="relative h-60 overflow-hidden rounded-2xl border bg-muted/30 p-5">
        <h4 className="font-semibold text-foreground">Bottom Fade Out</h4>
        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
          Long document previews and activity feeds look vastly more polished
          when content gracefully fades out at the bottom boundary instead of
          being harshly cut off by standard overflow-hidden boxes.
        </p>
        <ProgressiveBlur
          direction="bottom"
          blurLayers={8}
          blurIntensity={0.8}
          className="absolute inset-x-0 bottom-0 h-24"
        />
      </div>

      {/* Top Blur */}
      <div className="relative h-60 overflow-hidden rounded-2xl border bg-muted/30 p-5">
        <ProgressiveBlur
          direction="top"
          blurLayers={8}
          blurIntensity={0.8}
          className="absolute inset-x-0 top-0 h-24 z-10"
        />
        <h4 className="relative z-20 font-semibold text-foreground">Top Fade Out</h4>
        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
          When scrolling upward or designing reverse timelines (such as chat message
          histories), top progressive blur provides a smooth perceptual threshold.
        </p>
      </div>
    </div>
  )
}
