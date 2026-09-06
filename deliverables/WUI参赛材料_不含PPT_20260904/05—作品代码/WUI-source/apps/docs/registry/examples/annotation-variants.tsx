import { AnnotationHighlight } from "@/registry/ui/annotation"

export default function AnnotationVariantsDemo() {
  return (
    <div className="flex w-full flex-col gap-6 p-4 sm:p-8">
      {/* Smooth Variant */}
      <div className="border-border/60 bg-muted/20 rounded-xl border p-5">
        <p className="text-muted-foreground font-mono text-xs uppercase tracking-wider">
          Smooth Marker · 平整荧光笔
        </p>
        <p className="mt-3 text-base leading-relaxed">
          Standard highlights with{" "}
          <AnnotationHighlight color="oklch(0.88 0.16 92 / 0.58)">
            classic amber
          </AnnotationHighlight>
          , vibrant{" "}
          <AnnotationHighlight
            color="oklch(0.82 0.14 160 / 0.5)"
            delay={0.2}
          >
            mint emerald
          </AnnotationHighlight>
          , or calming{" "}
          <AnnotationHighlight
            color="oklch(0.82 0.12 240 / 0.5)"
            delay={0.4}
          >
            sky azure
          </AnnotationHighlight>{" "}
          strokes for clean documentation.
        </p>
      </div>

      {/* Rough Variant */}
      <div className="border-border/60 bg-muted/20 rounded-xl border p-5">
        <p className="text-muted-foreground font-mono text-xs uppercase tracking-wider">
          Rough Marker · 手绘纹理笔触
        </p>
        <p className="mt-3 text-base leading-relaxed">
          Textured double-stroke marker for an authentic{" "}
          <AnnotationHighlight
            variant="rough"
            color="oklch(0.85 0.16 85 / 0.55)"
          >
            handcrafted feel
          </AnnotationHighlight>
          , perfect for{" "}
          <AnnotationHighlight
            variant="rough"
            color="oklch(0.8 0.15 25 / 0.45)"
            delay={0.3}
          >
            design reviews
          </AnnotationHighlight>{" "}
          and editorial notes.
        </p>
      </div>
    </div>
  )
}
