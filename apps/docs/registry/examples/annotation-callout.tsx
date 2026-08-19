import { AnnotationHighlight, AnnotationPath } from "@/registry/ui/annotation"
import { Button } from "@/registry/ui/button"

export default function AnnotationCallout() {
  return (
    <div className="flex w-full max-w-lg flex-col items-center justify-center p-8 text-center">
      <div className="relative inline-block">
        <h3 className="text-xl font-bold tracking-tight sm:text-2xl text-foreground">
          Deploy with{" "}
          <AnnotationHighlight color="oklch(0.85 0.18 85 / 0.5)">
            zero downtime
          </AnnotationHighlight>
        </h3>
      </div>

      <p className="mt-2 text-xs text-muted-foreground max-w-sm">
        Our edge proxy swaps traffic seamlessly when your new version health checks pass.
      </p>

      <div className="relative mt-8">
        <span className="absolute -top-7 -right-24 hidden font-mono text-[11px] text-primary sm:inline-block">
          One click deploy ↗
        </span>
        <AnnotationPath
          path="M5 35C25 35 30 10 75 12"
          viewBox="0 0 85 45"
          color="var(--primary)"
          strokeWidth={2}
          delay={0.3}
          className="absolute -top-5 -right-16 hidden h-8 w-14 sm:block"
        />
        <Button size="sm">Publish to Production</Button>
      </div>
    </div>
  )
}
