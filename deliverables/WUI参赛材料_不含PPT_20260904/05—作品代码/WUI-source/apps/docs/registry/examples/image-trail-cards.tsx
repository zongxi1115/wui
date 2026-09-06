import { Badge } from "@/registry/ui/badge"
import { ImageTrail } from "@/registry/ui/image-trail"

const miniBadges = [
  <div key="b1" className="rounded-xl border bg-card p-3 shadow-xl">
    <Badge variant="default" className="text-xs">⚡ Fast Inference</Badge>
    <div className="mt-1 text-[11px] font-mono text-muted-foreground">3.2ms Latency</div>
  </div>,
  <div key="b2" className="rounded-xl border bg-card p-3 shadow-xl">
    <Badge variant="secondary" className="text-xs">🔒 Zero Trust</Badge>
    <div className="mt-1 text-[11px] font-mono text-muted-foreground">Hardware Enclave</div>
  </div>,
  <div key="b3" className="rounded-xl border bg-card p-3 shadow-xl">
    <Badge variant="outline" className="text-xs">🌐 Edge Mesh</Badge>
    <div className="mt-1 text-[11px] font-mono text-muted-foreground">320+ Regions</div>
  </div>,
]

export default function ImageTrailCards() {
  return (
    <ImageTrail
      items={miniBadges}
      distance={64}
      lifetime={800}
      className="relative flex min-h-[360px] w-full max-w-xl items-center justify-center overflow-hidden rounded-2xl border bg-muted/20 p-8 shadow-xs"
    >
      <div className="pointer-events-none text-center">
        <h4 className="text-xl font-bold tracking-tight text-foreground">
          Interactive Architecture Stream
        </h4>
        <p className="mt-1.5 text-xs text-muted-foreground">
          Move your cursor to spawn floating capability badges.
        </p>
      </div>
    </ImageTrail>
  )
}
