import { AnnotationHighlight, AnnotationPath } from "@/registry/ui/annotation"

export default function AnnotationDemo() {
  return (
    <div className="flex min-h-[430px] w-full items-center justify-center px-6 py-12 sm:px-12">
      <div className="relative w-full max-w-xl">
        <p className="text-muted-foreground text-xs font-medium uppercase tracking-[0.18em]">
          Product update · 03
        </p>
        <h3 className="mt-4 max-w-lg text-3xl font-semibold leading-[1.18] tracking-tight sm:text-4xl">
          Make the important part feel{" "}
          <AnnotationHighlight>obvious</AnnotationHighlight>, not louder.
        </h3>
        <p className="text-muted-foreground mt-5 max-w-md text-sm leading-6">
          Draw attention with a path, a marker sweep, or a shape that follows
          the content you want people to notice.
        </p>

        <div className="mt-12 flex items-end justify-between gap-8 border-t pt-7">
          <div>
            <p className="text-muted-foreground text-xs">Hand-drawn marker</p>
            <p className="mt-2 text-lg font-medium">
              Ready for{" "}
              <AnnotationHighlight
                variant="rough"
                color="oklch(0.78 0.16 155 / 0.5)"
                delay={0.2}
              >
                review
              </AnnotationHighlight>
            </p>
          </div>

          <div className="relative pb-1">
            <AnnotationPath
              className="text-foreground absolute bottom-5 right-[88%] h-20 w-40"
              delay={0.35}
            />
            <button className="bg-foreground text-background px-4 py-2 text-sm font-medium">
              Continue
            </button>
          </div>
        </div>

        <div className="mt-9 flex justify-center">
          <span className="relative px-4 py-1.5 text-xs font-medium uppercase tracking-wide">
            Custom path
            <AnnotationPath
              path="M8 24C12 5 108 2 132 18C151 31 122 43 69 42C25 42 1 35 8 24Z"
              viewBox="0 0 140 48"
              arrow={false}
              color="oklch(0.65 0.2 25)"
              strokeWidth={2}
              duration={1}
              delay={0.55}
              className="absolute inset-0 h-full w-full"
            />
          </span>
        </div>
      </div>
    </div>
  )
}
